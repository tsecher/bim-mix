const fs = require('fs');

/**
 * Init working directory after postinstall.
 */
class MixEasyStructurePostInstall {
	constructor() {
		this.templatesDir = __dirname + '/../templates/';

		this.workingDir = process.cwd().split('/node_modules')[0] + '/';
	}

	/**
	 * Run post install.
	 */
	run() {
		this.copyScratch();
		this.initGitIgnore();
		this.addMixScripts();
	}

	/**
	 * Move webpack.mix.js and webpack.mix.local.js.example
	 */
	copyScratch() {
		const scratchDir = this.templatesDir + 'scratch/';
		console.log(`1. ${scratchDir} files to "${this.workingDir}"`);
		fs.readdirSync(scratchDir).forEach(file => {
			if (!fs.existsSync(this.workingDir + file)) {
				fs.copyFileSync(scratchDir + file, this.workingDir + file)
			}
		});
	}


	/**
	 * Init .gitignore
	 */
	initGitIgnore() {
		console.log(`2. Init .gitignore`);
		if (!fs.existsSync(this.workingDir + '.gitignore')) {
			fs.copyFileSync(this.templatesDir + '_.gitignore', this.workingDir + '.gitignore');
		} else {
			// Copy content of template file into destination file.
			fs.readFile(this.templatesDir + '_.gitignore', (err, data) => {
				if (err) {
					throw err;
				}

				// Append into existing .gitignore.
				fs.appendFile(this.workingDir + '.gitignore', data, (err) => {
					if (err) {
						throw err;
					}
				});
			});
		}
	}

	/**
	 * Add mix scripts into package.json.
	 */
	addMixScripts() {
		console.log(`3. Add mix scripts into package.json`);
		const packageJson = JSON.parse(fs.readFileSync(this.workingDir + 'package.json'))
		packageJson.scripts.dev = "npm run development";
		packageJson.scripts.development = "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js";
		packageJson.scripts.watch = "npm run development -- --watch";
		packageJson.scripts.hot = "cross-env NODE_ENV=development node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js";
		packageJson.scripts.prod = "npm run production";
		packageJson.scripts.production = "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --no-progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js";

		// Write package.json.
		fs.writeFile(this.workingDir + 'package.json', JSON.stringify(packageJson, null, 4), 'utf8', (err) => {
			if (err) {
				throw err;
			}
		});
	}
}

module.exports = new MixEasyStructurePostInstall();
