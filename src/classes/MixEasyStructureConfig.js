/**
 */
class MixEasyStructureConfig {

	constructor(id, config) {
		const _config = config || id;
		this.config = {
			id: id
		};

		// If config is a string, then we create a default config :
		if ((typeof _config === 'string' || _config instanceof String)) {
			this.initDefaultConfig(_config);
		} else if (typeof _config === 'object') {
			this.config = {...this.config, ..._config};
		}
	}

	/**
	 * Create default config :
	 *
	 * {
	 *	'rep': '{type}',
	 *	'callback': '{type}',
	 *	'ext': '{type}',
	 *	'dest': '{type}',
	 *	'pattern': [
	 *		'{type}/**\/*.{type}',
	 *		'!{type}/**\/_*.{type}',
	 *		],
	 *	}
	 *
	 * @param string type
	 */
	initDefaultConfig(type) {
		this.setInputRep(type)
		this.setMixCallbackName(type);
		this.setExtension(type);
		this.setDestinationRep(type);
		this.allFilesNotStartingWithUnderscoreAreEntryPoints();
		this.setOutputCallback((src, out, option, conf) => this.defaultOutputCallback(src, out, option, conf));
	}

	/**
	 * Return the congi object.
	 *
	 * @returns {*}
	 */
	getConfig() {
		return this.config;
	}

	/**
	 *
	 */
	getId() {
		if ("undefined" === this.config.id) {
			throw "No id defined";
		}

		return this.config.id;
	}

	/**
	 * Return the input rep.
	 */
	getInputRep() {
		return this.config.rep;
	}

	/**
	 * Set the input rep.
	 *
	 * @param inputRep
	 */
	setInputRep(inputRep) {
		this.config.rep = inputRep;
		return this;
	}

	/**
	 * Return the mix callback name.
	 */
	getMixCallbackName() {
		return this.config.callback;
	}

	/**
	 * Set the mix callback name.
	 *
	 * @param callbackName
	 */
	setMixCallbackName(callbackName) {
		this.config.callback = callbackName;
		return this;
	}

	/**
	 * Return the input extension.
	 */
	getExtension() {
		return this.config.ext;
	}

	/**
	 * Set the input extension.
	 *
	 * @param extension
	 */
	setExtension(extension) {
		this.config.ext = extension;
		if( 'undefined' === typeof this.config.outputExt){
			this.setOutputExtension(extension);
		}
		return this;
	}

	/**
	 * Return the output extension.
	 */
	getOutputExtension(){
		return this.config.outputExt;
	}

	/**
	 * Set the output extension.
	 *
	 * @param extension
	 * @returns {MixEasyStructureConfig}
	 */
	setOutputExtension(extension){
		this.config.outputExt = extension;
		return this;
	}

	/**
	 * Return the destination rep.
	 */
	getDestinationRep() {
		return this.config.dest;
	}

	/**
	 * Set the destination rep.
	 *
	 * @param destinationRep
	 */
	setDestinationRep(destinationRep) {
		this.config.dest = destinationRep;
		return this;
	}

	/**
	 * Return the pattern.
	 */
	getPattern() {
		return this.config.pattern;
	}

	/**
	 * Set the pattern.
	 *
	 * @param pattern
	 * @returns {MixEasyStructureConfig}
	 */
	setPattern(pattern) {
		this.config.pattern = pattern;
		return this;
	}

	/**
	 * Return the mix third arguments (options)
	 *
	 * @returns {*}
	 */
	getMixOptions(){
		return this.config.options || null;
	}

	/**
	 * Set the mix third argiments (options)
	 *
	 * @param options
	 */
	setMixOptions(options){
		this.config.options = options;
		return this;
	}

	/**
	 * Return the outputcallabck;
	 * @returns {*}
	 */
	getOutputCallback(){
		return this.config.outputCallback;
	}

	/**
	 * Set the output callback.
	 *
	 * @param callback
	 */
	setOutputCallback(callback){
		this.config.outputCallback = callback;
		return this;
	}

	/**
	 * Default callabck.
	 *
	 * @param src
	 * @param out
	 * @param option
	 * @returns {string}
	 */
	defaultOutputCallback(src, out, option, conf){
		let pathData = out.trim().split('/');
		pathData.splice(1, 1);
		return pathData.join('/');
	}

	/**
	 * Define a configuratin where all files that are not starting with '_' are entry points.
	 */
	allFilesNotStartingWithUnderscoreAreEntryPoints() {
		this._setAutoPattern(
			[
				'${rep}/**/*.${ext}',
				'!${rep}/**/_*.${ext}',
			],
			'allFilesNotStartingWithUnderscoreAreEntryPoints');
		return this;
	}

	/**
	 * Define a configuratin where all files that are starting with a lowercase letter are entry points.
	 */
	allFilesStartingWithLowerCaseAreEntryPoints() {
		this._setAutoPattern(
			[
				'${rep}/**/[a-z]*.${ext}'
			],
			'allFilesStartingWithLowerCaseAreEntryPoints');
		return this;
	}

	/**
	 * Update pattern with defautl elements if possible.
	 * @param patterns
	 * @param callingMethod
	 * @private
	 */
	_setAutoPattern(patterns = [], callingMethod) {
		if ('undefined' !== typeof this.config.rep) {
			const rep = this.config.rep;
			const ext = this.config.ext || this.config.rep;
			this.setPattern(patterns.map(i => {
				return this._replaceAll(i, {
					"${rep}": rep,
					"${ext}": ext,
				});
			}));
		} else {
			throw `The rep needs to be configured before using ${callingMethod}`;
		}
	}


	/**
	 * Replace all patterns key=>value elements in src string.
	 *
	 * @param src
	 * @param patterns
	 * @returns {string}
	 * @private
	 */
	_replaceAll(src, patterns) {
		let result = src;
		for (let i in patterns) {
			result = result.split(i).join(patterns[i]);
		}
		return result;
	}
}

module.exports = MixEasyStructureConfig;
