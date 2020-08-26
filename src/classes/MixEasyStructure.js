/**
 * Init the use of an easy default mix structure.
 *
 * Here is the default structure.
 *
 * /dev                         // Destination for the development built sources.
 *     /js
 *     /css
 * /dist                        // Destinatio for the prod built sources
 * /src                         // Sources directory.
 *      /js                     // The js sources that will be generated in dist|dev/js
 *      /scss                   // The css sources that will be generated in dist|dev/css
 *      /ts                     // The TypeScript sources that will be generated in dist|dev/js
 *      package.json
 *      webpack.mix.js          // The mix configurator
 *      webpack.mix.local.js    // The file allowing local (unversioned) configuration.
 *
 */
const MixGlob = require('laravel-mix-glob');
const MixEasyConfMatch = require('./MixEasyConfigMatch');
const MixEasyStructureConfig = require('./MixEasyStructureConfig');
const fs = require('fs');
const minimatch = require('minimatch');

class MixEasyStructure {

	constructor(mix) {
		this.mix = mix;
		this.mixGlob = new MixGlob({mix}); // mix is required
		this.mixOverrideCallbacks = {};

		// Define the destination root according to environment.
		this.setDestination();

		// Init process defautl config.
		this.initDefaultConfig();
	}

	/**
	 * Return the mix object.
	 *
	 * @returns {*}
	 */
	getMix() {
		return this.mix;
	}

	/**
	 * Return the mix glob object.
	 *
	 * @return {*}
	 */
	getMixGlob() {
		return this.mixGlob;
	}

	/**
	 * Return the list of diretories availables in the src directory.
	 *
	 * @param source
	 * @returns {string[]}
	 */
	getDirectories(source) {
		return fs.readdirSync(source, {withFileTypes: true})
			.filter(currentDir => currentDir.isDirectory())
			.map(currentDir => currentDir.name);
	}

	/**
	 * Return the list of defined process.
	 *
	 * @returns {*}
	 */
	getListOfProcess() {
		return this.processConfig;
	}

	/**
	 * Update the destination roots.
	 *
	 * @param string prod
	 * @param string dev
	 */
	setDestination(prod = '../dist', dev = '../dev') {
		this.destinationRoot = this.mix.inProduction() ? prod : dev;
	}

	/**
	 * Init the default config.
	 */
	initDefaultConfig() {
		this.processConfig = [];

		// Get the list of current directories.
		this.getDirectories('./').map(i => {
			const method = `initDefaultConfig_${i}`;
			if (typeof this[method] === "function") {
				this[method]();
			}
			else{
				this.initDefaultConfigFallback(i);
			}
		});
	}

	/**
	 * Init default scss config
	 */
	initDefaultConfig_scss() {
		const match = MixEasyConfMatch.get('scss');
		const cssConfig = new MixEasyStructureConfig('scss')
			.setMixCallbackName(match.callback)
			.setDestinationRep(match.destination)
			.setOutputExtension(match.extension);
		this.addProcessConfig(cssConfig);
	}

	/**
	 * Init default js config.
	 */
	initDefaultConfig_js() {
		const match = MixEasyConfMatch.get('js');
		const jsConfig = new MixEasyStructureConfig('js')
			.setMixCallbackName(match.callback)
			.setDestinationRep(match.destination)
			.setOutputExtension(match.extension);
		this.addProcessConfig(jsConfig);
	}

	/**
	 * Init default ts config.
	 */
	initDefaultConfig_ts() {
		const match = MixEasyConfMatch.get('ts');
		const tsConfig = new MixEasyStructureConfig('ts')
			.setMixCallbackName(match.callback)
			.setDestinationRep(match.destination)
			.setOutputExtension(match.extension)
			.allFilesStartingWithLowerCaseAreEntryPoints();
		this.addProcessConfig(tsConfig);
	}

	/**
	 * Init default images config
	 */
	initDefaultConfig_img(){
		// add image min extension.
		const Imagemin = require('../extensions/mix-imagemin/Imagemin');
		this.mix.extend('imagemin', new Imagemin());

		const sourceRep = 'img'
		const match = MixEasyConfMatch.get(sourceRep);
		const imageConfig = new MixEasyStructureConfig(sourceRep)
			.setMixCallbackName(match.callback)
			.setExtension(match.extension)
			.setDestinationRep(match.destination)
			.setOutputExtension(match.extension)
			.setMixOptions(match.mixOptions)
			.allFilesAreEntryPoints();
		
		imageConfig.getMixExtensionSecondParameter = (processConfig) => {
			const patternData = processConfig.getPattern()[0].split('/')
			return {
				patterns: [
					{
						from: patternData.slice(1).join('/'),
						to: this.destinationRoot+'/'+(patternData[0]===sourceRep?sourceRep:''),
						context:patternData[0]+"/",
					},
				],
			}
		}

		this.addProcessConfig(imageConfig);
	}

	/**
	 * Fallback
	 */
	initDefaultConfigFallback(rep){
		const match = MixEasyConfMatch.get(rep);
		if( this._mixCallbackExists(match.callback)){
			const config = new MixEasyStructureConfig(rep)
				.setMixCallbackName(match.callback)
				.setDestinationRep(match.destination)
				.setOutputExtension(match.extension)
			this.addProcessConfig(config)
		}
	}

	/**
	 * Add a process configuration.
	 *
	 * @param configuration
	 */
	addProcessConfig(configuration) {
		if (typeof configuration.getConfig === 'function' && typeof configuration.getId === 'function') {
			this.processConfig.push(configuration);
		}
	}

	/**
	 * Remove a configuration.
	 *
	 * @param id
	 */
	removeProcessId(id) {
		this.processConfig = this.processConfig.filter(i => {
			return i.getId() !== id;
		});
	}


	/**
	 * Init the list of processes of mix.
	 */
	process() {
		// Add the availability to load local (unversioned) configuration.
		this._hookLocalProcess();

		// Setup the public destination path.
		this.mix.setPublicPath(this.destinationRoot);

		// Build configruation according to list of process configuration.
		const listOfProcess = this.getListOfProcess();
		if (listOfProcess.length === 0) {
			console.error('No process defined or no file to process.');
			process.exit();
		}
		listOfProcess.map(processConfiguration => this._runProcess(processConfiguration))
	}

	/**
	 * Load webpack.mix.local.js if exists.
	 *
	 * This allows user to add unversioned configuration if needed.
	 *
	 * @private
	 */
	_hookLocalProcess() {
		// Allows hooks loading the webpack.mix.local.js file if exists.
		try {
			if (fs.existsSync('./webpack.mix.local.js')) {
				eval(fs.readFileSync('./webpack.mix.local.js') + '');
			}
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * Add a process from the process name according to processConfig.
	 *
	 * @param processConfiguration
	 * @private
	 */
	_runProcess(processConfig) {
		// Define the mix callback.
		const callbackName = processConfig.getMixCallbackName();

		// First, try to run the mix glob callback.
		if (typeof this.mixGlob[callbackName] === 'function') {
			this._runMixGlobCallback(processConfig, this.mixGlob[callbackName]);
		}
		// Then, try to run the default mix callback.
		else if( typeof this.mix[callbackName] === 'function'){
			this._runMixCallback(processConfig, this.mix[callbackName])
		}
	}

	/**
	 * Check if the mix callback exists.
	 * @param callbackName
	 * @return {boolean}
	 * @private
	 */
	_mixCallbackExists(callbackName){
		return typeof this.mixGlob[callbackName] === 'function' || typeof this.mix[callbackName] === 'function';
	}

	/**
	 * Run mix glob callback.
	 * @param processConfig
	 * @private
	 */
	_runMixGlobCallback(processConfig, mixCallback){
		// Initialise the method taht overrides the output item.
		this.initMixOverride(processConfig);

		this._runMixCallback(processConfig, mixCallback);
	}

	/**
	 * Run default mix callback.
	 * @param processConfig
	 * @param mixCallback
	 * @private
	 */
	_runMixCallback(processConfig, mixCallback){
		mixCallback(
			// the patterns that matches the files to process.
			processConfig.getPattern(),
			// the destination, relative to public path.
			processConfig.getMixExtensionSecondParameter(processConfig),
			// the mix configuration.
			processConfig.getMixOptions(),
			// the mixglob configuration.
			{
				base: (file, ext, mm) => {
					return '/../';
				}
			}
		)
	}

	/**
	 * Override the outpath.
	 *
	 * We redefine the mix callback to rewrite the output path because globMix use the complete relative
	 * path, including the "src/{rep}" part and we don't want it.
	 *
	 * @param config
	 */
	initMixOverride(processConfig) {
		const callbackName = processConfig.getMixCallbackName();
		const mixEasy = this;
		if (typeof this.mixOverrideCallbacks[callbackName] === "undefined") {
			// Save the default mix behavior.
			this.mixOverrideCallbacks[callbackName] = this.mix[callbackName];
			const _mixOverrideCallbacks = this.mixOverrideCallbacks;

			// We redefine the mix callback to rewrite the output path because globMix use the complete relative
			// path, including the "src/{rep}" part and we don't want it.
			this.mix[callbackName] = function (src, out, option) {
				// Then call the this.mix callback.
				return _mixOverrideCallbacks[callbackName].call(this.mix, src, mixEasy.getCleanOutput(src, out, option), option);
			}
		}
	}

	/**
	 * Return a cleaned output path that excludes the input first rep name.
	 * @param src
	 * @param out
	 * @param option
	 * @returns {void | string | never}
	 * @private
	 */
	getCleanOutput(src, out, option) {
		const matchingConfs = this.getConfsFromSrcFilePath(src);
		for( let i=0, length = matchingConfs.length; i<length; i++){
			if( 'function' === typeof matchingConfs[i].getOutputCallback ){
				let conf = matchingConfs[i];
				return conf.getOutputCallback()(src, out, option, conf);
			}
		}

		return out;
	}

	/**
	 * Return the first conf matching the source file path.
	 *
	 * @param srcFilePath
	 *
	 * @returns MixEasyStructureConfig
	 */
	getConfsFromSrcFilePath(src) {
		return this.getListOfProcess().filter(conf => {
			return conf.getPattern()
				// Parse only positive patterns.
				.filter(pattern => {
					return pattern[0] !== '!';
				})
				// Filter on minimatching pattern
				.filter(pattern => {
					return minimatch(src, pattern);
				})
				// REturn true of at least one pattern is matching.
				.length > 0;
		});
	}

	/**
	 * Return the config process.
	 * @param id
	 * @return {T}
	 */
	getProcessConfig(id){
		return this.processConfig.filter(config => {
			return  config.getId() === id
		})[0];
	}
}

module.exports = MixEasyStructure;
