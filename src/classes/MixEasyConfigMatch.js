
const MixEasyConfigMatch = {
  data: {
    'scss': {
      callback: 'sass',
      destination: 'css',
      extension: 'scss',
    },
    'js': {
      callback: 'js',
      destination: 'js',
      extension: 'js',
    },
    'ts': {
      callback: 'js',
      destination: 'js',
      extension: 'js',
    },
    'img': {
      callback: 'imagemin',
      destination: 'img',
      extension: '*',
      mixOptions: (processConfig) => {
        return {
          optipng: {
            optimizationLevel: 1
          },
          jpegtran: null,
          plugins: [
            require('imagemin-mozjpeg')({
              quality: 75,
              progressive: true,
            }),
          ],
        }
      }
    }
  },

  get : function(type) {
    if( this.data[type] ){
      return this.data[type]
    }
    return {
      auto:true,
      callback: type,
      destination: type,
      extension: type,
    }
  }
}

module.exports = MixEasyConfigMatch;
