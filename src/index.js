const mix = require('laravel-mix');
const MixEasyStructure = require('./classes/MixEasyStructure');
const MixEasyStructureConfig = require('./classes/MixEasyStructureConfig');

// Export mixEasy object.
module.exports = new MixEasyStructure(mix);
module.exports.config = MixEasyStructureConfig;

