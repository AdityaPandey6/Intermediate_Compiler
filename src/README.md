# src/

This folder contains the backend logic for the Intermediate Compiler project.

## Files
- `lexer.js` — Lexical analyzer (tokenizes C code input)
- `compiler.js` — Main compiler logic (coordinates parsing and code generation)
- `simplified-compiler.js` — Simplified/alternative compiler logic
- `function-parser.js` — Parses C function definitions
- `statement-parser.js` — Parses C statements
- `code-generator.js` — Generates intermediate code from parsed structures

## Purpose
- Modularizes the compiler backend for clarity and maintainability.
- Each file handles a specific part of the compilation process.

## Usage
- These files are used by `server.js` to process API requests from the frontend.
- No need to run these files directly; use the main server entry point.

---

For more details, see the main project README.
