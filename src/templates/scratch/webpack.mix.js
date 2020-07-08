const bimMix = require('bim-mix');

/* ---------------------------
 | Add the porject specific configuration here.
 | You can interact directly with the mix object.
 |----------------------------
// Ex:
const mix = bimMix.getMix();
*/

/* ---------------------------
 | You can also interact directly with the mixExasy object to add configuration.
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


/* ---------------------------
 | You can also use the default bundle structure.
 |----------------------------
  Bundles allow you to keep a bundle structure from src to build files.
  For example, you can have this structure with only one mix configuration :
  ./
    ./dist
        ./bundle1
            bundle1.js
            bundle1.screen.css
            bundle1.print.css

    ./src
        ./bundles
            ./bundle1
                ./js
                    ./components
                        component1.js
                        component2.js
                    bundle1.js
                ./scss
                    ./components
                        component.scss
                    bundle1.screen.scss
                    bundle1.print.scss
 */
// // Enable bundle auto configuration.
// const bundler = new MixEasyBundleConfigurator('bundles')
// bundler.autoConfiguration('*');


// Launch porcess configuration.
bimMix.process();
