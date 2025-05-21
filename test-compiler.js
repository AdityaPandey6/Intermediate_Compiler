/**
 * Test script for the C to Intermediate Code compiler
 */

const fs = require('fs');
const path = require('path');
const { SimplifiedCompiler } = require('./src/simplified-compiler');
const { lex } = require('./src/lexer');

// Create a new compiler instance
const compiler = new SimplifiedCompiler();

// Function to compile a file
function compileFile(filename) {
  console.log(`\n=== Testing ${filename} ===\n`);

  // Path to the test file
  const testFilePath = path.join(__dirname, 'test', filename);
  const outputFilePath = path.join(__dirname, 'test', `${filename.replace('.c', '')}-output.ic`);

  // Read the test file
  const sourceCode = fs.readFileSync(testFilePath, 'utf8');
  console.log('Source code:');
  console.log('===========');
  console.log(sourceCode);
  console.log();

  // Print lexemes (tokens)
  const tokens = lex(sourceCode);
  console.log('Lexemes (tokens):');
  console.log('=================');
  console.log(tokens);
  console.log();

  // Compile the source code
  const result = compiler.compile(sourceCode);

  if (result.success) {
    console.log('Compilation successful!');
    console.log('Intermediate code:');
    console.log('=================');
    console.log(result.code);

    // Write the output to a file
    fs.writeFileSync(outputFilePath, result.code);
    console.log(`Output written to ${outputFilePath}`);
  } else {
    console.error(`Compilation failed: ${result.error}`);
  }
}

// Test with simple function
compileFile('input.c');

