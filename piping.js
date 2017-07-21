var fs = require("fs");

// Create a readable stream
var readerStream = fs.createReadStream('/Users/mac358813/Desktop/TypeScript/Node/input.txt');

// Create a writable stream
var writerStream = fs.createWriteStream('/Users/mac358813/Desktop/TypeScript/Node/output.txt');

// Pipe the read and write operations
// read input.txt and write data to output.txt
readerStream.pipe(writerStream);

console.log("Program Ended");