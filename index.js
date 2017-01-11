#!/usr/bin/env node
'use strict';

let fs = require('fs'),
    parser = require('./talkative-parser'),
    filenames = process.argv.slice(2),
    saveAnswers = false;

let readfiles = (filename, index) => {
  saveAnswers = saveAnswers || filename === '-s';
  var firstCall = !(saveAnswers ? index - 1 : index); // coerce to boolean false if first iteration
 
  if (filename.charAt(0) !== '-'){
    fs.readFile(filename, 'utf8', (err, fileContent) => {
      if (err) {
        console.log('Error: ',err)
      }
      parser(fileContent, filename, saveAnswers, firstCall) 
    })
  }
}

filenames.forEach(readfiles)
