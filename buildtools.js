#!/usr/bin/env node

/**
 * @project buildtools
 * @author  Imran Khan
 * @license See LICENSE.md file included in this distribution.
 */
 
var program = require('commander');
var generate_diagram = require('./lib/generate_diagrams');
 

program
  .version('0.0.1')
  .command('generate_diagram [inputFolder]')
  .description('run genereate diagram command')
  .option("-v, --verbose", "Verbose output")
  .action(function(inputFolder, options){
    var verboseFlag = options.verbose;
    inputFolder = inputFolder || '.';

    console.log('inputfolder= %s verbose=%s', inputFolder, verboseFlag);
    iterateJsToOutputGraph ( inputFolder );
});

program.parse(process.argv);
