# C to Intermediate Code Compiler

A compiler that translates C code to three-address intermediate code.

## Project Structure

- `src/` - Source code for the compiler
  - `lexer.js` - Tokenizes the input code
  - `parser.js` - Parses tokens into an AST
  - `intermediate-code-generator.js` - Generates intermediate code from the AST
  - `simple-compiler.js` - A simpler compiler that uses regex-based translation
  - `compiler.js` - Main compiler that ties everything together
- `test/` - Test files
  - `test.c` - Sample C code for testing
  - `run-tests.js` - Test runner

## Features

This compiler supports a subset of C language features:

- Basic data types: int, char, float, double
- Variable declarations and assignments
- Function declarations and calls
- Control structures: if-else, while, for
- Arithmetic and logical operations

## Implementation Approaches

The project includes two different approaches to compiling C to intermediate code:

1. **AST-based Compiler** (not fully implemented):
   - Lexical analysis (tokenization)
   - Parsing into an Abstract Syntax Tree (AST)
   - Intermediate code generation from the AST

2. **Regex-based Compiler** (currently used):
   - Uses regular expressions to directly translate C code to intermediate code
   - Simpler but less robust than the AST-based approach
   - Handles basic C constructs like functions, loops, and conditionals

## Intermediate Code Format

The compiler generates three-address code, which is a form of intermediate representation where each instruction has at most three operands. The general format is:

```
result = operand1 operator operand2
```

Examples:
- `t1 = a + b`
- `t2 = t1 * c`
- `x = t2`

Control flow is represented using labels and jumps:
- `L1:`
- `goto L1`
- `ifFalse condition goto L2`

## Usage

### Command Line

```bash
node src/compiler.js <source-file> [output-file]
```

Example:
```bash
node src/compiler.js test/test.c test/test.ic
```

### API

```javascript
const { Compiler } = require('./src/compiler');

const compiler = new Compiler();

// Compile a string
const result = compiler.compile('int main() { return 0; }');
console.log(result.code);

// Compile a file
compiler.compileFile('input.c', 'output.ic');
```

## Running Tests

```bash
npm test
```

## Limitations

- No preprocessor directives (#include, #define, etc.)
- Limited support for pointers
- No support for structs or unions
- No type checking
- Limited standard library
- Regex-based translation has limitations with complex nested structures

## Future Improvements

- Complete the AST-based compiler for more robust translation
- Add support for more C features
- Implement type checking
- Optimize the generated code
- Add more standard library functions
- Support for preprocessor directives
