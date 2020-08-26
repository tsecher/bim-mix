const bimMix = require('bim-mix');
const configMatch = require('./MixEasyConfigMatch')
const glob = require('glob');

/**
 * BundleConfigClass.
 *
 * Class keeping sources paths for build.
 */
class MixEasyBundleConfigurator {

  constructor(root) {
    this.initRoot(root)
  }

  /**
   * Init the root.
   *
   * @param root
   */
  initRoot(root) {
    if (root) {
      this.root = root.slice(-1) !== '/' ? root + '/' : root;
    } else {
      this.root = ''
    }
  }

  /**
   * Auto configuration according to rep names.
   *
   * @param pattern
   *   Pattern matchiing bundle rep.
   */
  autoConfiguration(pattern) {
    const result = glob.sync(this.root + pattern + '/*')
        // Get rep name.
        .map(item => {
          return item.split('/').slice(-1)[0]
        })
        // Unique.
        .filter((value, index, self) => {
          return self.indexOf(value) === index
        })
        // Auto create conf
        .map(action=>{
          const match = configMatch.get(action);
          this.addConf(action,  match.callback, `${pattern}/${action}`, match.extension)
        })
  }

  /**
   * Update the path for built assets.
   *
   * @param src
   * @param out
   * @param option
   * @param conf
   * @returns {string}
   */
  bundleOutput(src, out, option, conf) {
    let output = out.split('/')
    output.splice(0, 1)
    output.splice(-2, 1)

    if( output[0]+'/' === this.root ){
      output = output.slice(1)
    }
    return output.join('/');
  }

  /**
   * Add a specific bundle conf.
   *
   * @param id
   * @param mixCallbackName
   * @param dir
   * @param extension
   */
  addConf(id, mixCallbackName, dir, extension) {
    let conf = bimMix.getProcessConfig(id);
    if(typeof conf === "undefined"){
      conf = new bimMix.config(id)
          .setMixCallbackName(mixCallbackName)
          .setExtension(extension)
      bimMix.addProcessConfig(conf)
    }

    conf.setPattern([ `${this.root}${dir}/*.${extension}` ])
        .setOutputCallback((src, out, option, conf) => this.bundleOutput(src, out, option, conf))
  }
}


// Export mixEasy object.
module.exports = MixEasyBundleConfigurator;
