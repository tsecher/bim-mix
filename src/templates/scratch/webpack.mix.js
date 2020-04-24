// const mix = require('laravel-mix');
const bimMix = require('bim-mix');


/* ---------------------------
 | Add the porject specific configuration here.
 | You can interact directly with the mix object.
 |----------------------------

// Ex:
const mix = bimMix.getMix();

// Disable notification.
mix.disableSuccessNotifications();

// Enable live reload.
const LiveReloadPlugin = require('webpack-livereload-plugin');
mix.webpackConfig({
plugins: [
	new LiveReloadPlugin()
]
});

*/


/* ---------------------------
 | You can although interact directly with the mixExasy object to add configuration.
 |----------------------------
 */
// const ownConfiguration = new bimMix.config('own_js')
// 	.setInputRep('own_js')
// 	.setDestinationRep('js')
// 	.setMixCallbackName('js')
// 	.setExtension('js')
// 	.allFilesNotStartingWithUnderscoreAreEntryPoints();
// bimMix.addProcessConfig(test);
//
//// Remove a default process id :
// bimMix.removeProcessId('js');
//
//// Change the destination path :
// bimMix.setDestination('../', '../build');

// Launch porcess configuration.
bimMix.process();
