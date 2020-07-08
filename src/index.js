const mix = require('laravel-mix');
const MixEasyStructure = require('./classes/MixEasyStructure');
const MixEasyStructureConfig = require('./classes/MixEasyStructureConfig');
const MixEasyConfigMatch = require('./classes/MixEasyConfigMatch');

// Export mixEasy object.
module.exports = new MixEasyStructure(mix);
module.exports.configMatch = MixEasyConfigMatch;
module.exports.config = MixEasyStructureConfig;
