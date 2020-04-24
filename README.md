# Bim-mix
A wrapper of laravel-mix-glob and laravel-mix to create easy default structure of assets.

## Principal
Bim-mix add a default preconfigured structure at laravel-mix.
By default, all elements in 
- the js directory will be transpiled in js
- the scss directory will be transpiled from sass to css
- ths ts directory will be transpiled from typescript to js

It is created to easily build bundle and add several output file.
For example you can have several js file that will be entry point, and each of theme will create an output file.

## How to use

### Change destination
You can change the directory destination.
```javascript
mixEasy.setDestination('../prod', '../dev');
```

### Add your own conf

#### Change output dynamically
You can change the output dynamically defining the setOutputCallback.

This example will replace each 'scss' occurence by 'css' in the output path : 
```
const cssConf = new mixEasy.config('scss')
   	.setOutputCallback((src, out, option, config) => {
   		return out.replace('scss', 'css');
   	});
mixEasy.addProcessConfig(cssConf);
```


In the next example, this will group output files into a single directory
even if sources files were not in the same folder. Thus, you easily output several bundles
with only one mix instance : 
```

const getBundleOutput = (src, out, option, config) => {
	const ext = config.getOutputExtension();
	return out
		.replace(`my-bundle/${config.getExtension()}`, '') // remove the srouce tree
		.replace(`.${ext}`, (mixEasy.getMix().inProduction() ? '.min.' : '.') + ext ) // add .min in extension
}

const jsConf = new mixEasy.config('js')
	.setInputRep('my-bundle')
	.setMixCallbackName('js')
	.setExtension('js')
	.setDestinationRep('my-bundle')
	.allFilesNotStartingWithUnderscoreAreEntryPoints()
	.setOutputCallback(getBundleOutput);
mixEasy.addProcessConfig(jsConf);

const cssConf = new mixEasy.config('scss')
	.setInputRep('my-bundle')
	.setMixCallbackName('sass')
	.setExtension('scss')
	.setOutputExtension('css')
	.setDestinationRep('my-bundle')
	.allFilesNotStartingWithUnderscoreAreEntryPoints()
	.setOutputCallback(getBundleOutput);
mixEasy.addProcessConfig(cssConf);
```
This will create the following directory tree : 
```
- dist
    - my-bundle
        - main.min.js
        - main.min.css
- src
    - my-bundle
        - js
            - main.js
        - scss
            - main.scss 
```
