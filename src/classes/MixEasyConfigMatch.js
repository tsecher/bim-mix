
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
    }
  },

  get : function(type) {
    if( this.data[type] ){
      return this.data[type]
    }
    return {
      callback: type,
      destination: type,
      extension: type,
    }
  }
}

module.exports = MixEasyConfigMatch;
