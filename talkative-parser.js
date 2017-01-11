'use strict';
let fs = require('fs');

// IIFE to keep a private scope for most of the functions.
// Not strictly necessary for files exported with module.exports
// but good practise nonetheless.
module.exports = (function(){
  let _arrayOfText,
      _stars = '**************',
      _finalDetails;
 
  // Returns the wordcount of the text after replacing characters
  // not included in a character count and tabs and newlines. Also
  // creates an array of the text-words in the outer scope of the IIFE.
  let _countWords = text => {
    text = text.replace(/[.,']+/g,'').replace(/[\s()!?"]/g,' ').trim()
    _arrayOfText = text.split(/ +/g);
    return _arrayOfText.length;
  }

  // Rejoins the array of words, minus the spaces, to get a character
  // count. Returns the result of characterCount/wordCount to 3dp
  let _calculateAverage = wordCount => {
    let characterCount = _arrayOfText.join('').length;
    return (characterCount/wordCount).toFixed(3);
  }

  // Creates an array and iterates through the _arrayOfText. For each 
  // occurrence of a particular word length, the corresponding index of 
  // the arrayOfWordLengths is incremented by 1.
  let _orderByLength = () => {
    let arrayOfWordLengths = [];
    _arrayOfText.forEach( (word,index) => {
      arrayOfWordLengths[word.length] = arrayOfWordLengths[word.length] || 0;
      arrayOfWordLengths[word.length] += 1;
    })
    return arrayOfWordLengths;
  }

  // Pushes into the _finalDetails a template string of each word length
  // above 0, and the number of times it occurs.
  let _addEachWordLengthToDetailArray = (arrayOfWordLengths, details) => {
    let occurrenceMax = 0,
        plural,
        mostFrequentLengths = [];

    arrayOfWordLengths.forEach((length, index) => {
        if ( length > occurrenceMax){
          occurrenceMax = length;
          mostFrequentLengths = [index]
        } else if ( length === occurrenceMax ){
          mostFrequentLengths.push(index);
        }
        if ( index ){ // ensures no empty strings are counted
          _finalDetails.push(`Number of words of length ${index} is ${length}`);    
        }
    })
    plural = mostFrequentLengths.length > 1 ? 's' : '';
    _finalDetails.push(`The most frequently occurring word length is ${occurrenceMax},`
              + ` for length${plural} ${mostFrequentLengths.join(' & ')}`);
  }

  // Adds the word count and average word length to details array
  let _addWcAndAvLengthToDetailArray = (wordCount, averageLength) => {
    _finalDetails.push(`Word count = ${wordCount}`)
    _finalDetails.push(`Average word length = ${averageLength}`);
  }
    
  // This is where all the data finally gets logged to the console
  let _printToConsole = (filename) => {
    console.log();
    console.log(`${_stars}  ${filename.toUpperCase()}  ${_stars}`)
    _finalDetails.forEach(function(detail){
      console.log(detail)
    })
    console.log();
  }

  // If you add the save option this will be called
  // and the results will be saved to parsed_txt.txt
  let _saveToFile = (filename, firstCall) => {
    let combineLines = (acc, detail) => `${acc}\n${detail}`,
        heading = `${_stars}  ${filename.toUpperCase()}  ${_stars}`,
        toSave = _finalDetails.reduce(combineLines, heading),
        fileAction = firstCall ? 'writeFile' : 'appendFile';

    fs[fileAction]('parsed_text.txt', `${toSave}\n\n`, (err) =>{
      if ( err ){
        console.log('Error:', err) 
      }
    }) 
  }

  // This is the only 'public' function. Utilises the other private functions
  // to coordinate the correct order of use, in order to log the results
  // to the console or save to file.
  let parseText = (text, filename, save, firstCall) => {
    _finalDetails = ['']; // make sure to reset the _finalDetails
    let wordCount = _countWords(text),
        averageLength = _calculateAverage(wordCount),
        arrayOfWordLengths = _orderByLength();
    _addWcAndAvLengthToDetailArray(wordCount, averageLength);
    _addEachWordLengthToDetailArray(arrayOfWordLengths);
    save ? _saveToFile(filename, firstCall) : _printToConsole(filename);
  }

  return parseText;

})()