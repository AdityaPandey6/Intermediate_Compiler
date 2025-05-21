# Backend Source Folder (`src/`)

This folder contains the main backend code for the Intermediate Compiler project.

## What's Inside
- `lexer.js` — Turns C code into tokens (lexical analysis)
- `statement-parser.js` — Breaks code into statements and expressions (includes a recursive descent parser for expressions)
- `function-parser.js` — Handles C function definitions
- `code-generator.js` — Converts parsed code into intermediate (three-address) code
- `compiler.js` — Coordinates the whole compilation process
- `simplified-compiler.js` — An alternative, simpler compiler logic

## How It's Used
- These files work together to process C code and generate intermediate code.
- They are used by the main server (`server.js`).
- You do not run these files directly.

## Why This Structure?
- Each file has a clear job, making the code easier to read and maintain.

## Note on Expression Parsing
- The `statement-parser.js` file includes a recursive descent parser for arithmetic and logical expressions. This allows the compiler to break down complex expressions into three-address code using temporary variables, respecting operator precedence and parentheses.

---

For more details, see the main project README.
