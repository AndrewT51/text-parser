# Talkative text parser

To install this program, use the command line interface to navigate to its root folder (where the ```package.json``` is contained) and type ```npm install -g``` at the command line prompt. You should have node installed for this.  
To use, once installed, type ```parse-text``` followed by the files that you wish to parse. You can do more than one at a time eg: ```parse-text file1.txt file2.txt ../../file3.txt```. The results will be logged to the console.  

By adding a ```-s``` option after the ```parse-text``` command, the results will be saved as ```parsed_text.txt``` in the location from where the program is run. In this case, nothing will be logged to the console.

## index.js

This file uses node's file-system module to read the files and any options flagged after the parse-text command.
It iterates through the list of files given, and each of those files is passed into the ```readfiles()``` function.

#### readfiles(filename, index)  
 This function first looks for the presence of a ```-s``` flag, to determine if the ```saveAnswers``` flag should be set to true. Also, this function checks it is currently operating on the first file - this is important to pass to the ```parser()``` function so it can determine whether to create a new file or append an existing one.  

#### parser(fileContent, filename, saveAnswers, firstCall)  
This function is imported from the ```talkative-parser.js``` file, detailed below.
  
## talkative-parser.js  
This file contains all the business logic to perform the parsing of a text file into the response required, wrapped in an IIFE.
It exports a reference to ```parseText()```, which is the single publicly accessible function returned from the IIFE.  
#### parseText(text, filename, save, firstCall)  
This function uses the arguments passed in from its invocation in the ```index.js``` file to coordinate the calling of the private functions within the IIFE and, when the data is formatted correctly, either calls the ```_printToConsole()``` function or the ```saveToFile()``` function, depending on the value of the ```save``` parameter.  
#### _countWords(text)
The logic in the ```_countWords()``` function is based on some assumptions:  

* Punctuation such as periods, commas, exclamation marks, quotes etc are not counted as characters. 
* Delimiters between times and dates such as colons and backslashes ARE counted as characters.
* Numbers formatted like 34,454,345 will be counted as one word, but the comma delimiters or decimal points will not be counted as characters.  
* Characters that represent a word, such as **&** will be counted as a word.

The first regular expression in this function is used to replace each of ```.``` ```,``` and ```'``` with empty strings. If we were to replace these with whitespace, numbers as formatted in the third bullet-point above, would become a separate 'word' at each delimited place value or decimal. The same goes for the apostrophe in possessive nouns or in contractions.  
The next regular expression replaces several other punctuation marks (including whitespace characters such as ```\t```) with a space. This should take care of sloppy text where spaces have been omitted where they should not have been, eg.   
  
  *"Without spaces between brackets(and the same goes for other marks)this could be counted incorrectly"* 

Once the regex operation has been performed the resulting text is trimmed to remove excess whitespace, and then split on instances of one or more spaces.
  
A reference to the resulting array, ```_arrayOfText```, is set in the outer scope of the IIFE and its length (now representing the number of words in the text) is returned.  
#### _calculateAverage(wordCount)  
This function divides the joined character length of the ```_arrayOfText``` array by the ```wordCount``` parameter. The result to 3 decimal places is returned from this function. This returned value represents the average word length.  

#### _orderByLength()
Creates a new ```arrayOfWordLengths```array, and then iterates through the ```_arrayOfText```. For each occurrence of a particular word length, the corresponding index of the ```arrayOfWordLengths``` is incremented by 1.  
The ```arrayOfWordLengths``` will resemble something like this:  

```js
	[ 
		, 
		1, 
		1, 
		1, 
		2, 
		2, 
		, 
		1, 
		, 
		, 
		1 
	]
```

Notice this is a sparse array. The values in this array now represents the number of occurences of word lengths that match the index. If there were none the element is empty.  
This array is then returned from the function.  
#### _addEachWordLengthToDetailArray(arrayOfWordLengths, details)
This function iterates through the ```arrayOfWordLengths``` and keeps track of the highest value in the ```occurrenceMax``` variable. Each time a new high value is found, the ```mostFrequentLengths``` array is reinitialised with the current word length that is represented by that high value. If an equal value is found in a subsequent iteration, then the word length represesnted by that value is also pushed into the ```mostFrequentLengths``` array.
As the function is iterating through the values, it also pushes a templated string for each non-zero word-occurrence value into the ```_finalDetails``` array, which is in the outer scope of the IIFE.  
In addition, a ```plural``` variable represents either an ```s``` character or an empty string, depending on whether the ```mostFrequentLengths``` array has more than one element.  
A final templated string is pushed to the ```_finalDetails``` array, which gives details to the user about the maximum occurrences and which word lengths they represent.  

#### _addWcAndAvLengthToDetailArray(wordCount, averageLength)
Simply pushes two templated strings, incorporating both function parameters, into the ```_finalDetails``` array, which is in the outer scope of the IIFE.  

#### _printToConsole(filename)
Iterates through the ```_finalDetails``` array and logs each of the strings contained within to the console.  
#### _saveToFile(filename, firstCall) 
This function reduces all the strings  in the ```_finalDetails``` array (concatenating ```\n``` to each, for linebreaks) into a single string and then if it is the first call, writes a new file ```parsed_text.txt``` containing the results; subsequent iterations are appended to this file.