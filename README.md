# Intermediate Compiler

This project is a C-to-Intermediate-Code compiler with a modern, interactive web frontend.

## Features
- Input C code and view lexemes (tokens) in a table
- See generated intermediate code
- Modern, VS Code-inspired UI with neon/cyber dark theme
- Custom animated cursor and blinking caret
- Responsive design for desktop and mobile

## Project Structure
- `src/` - Compiler backend (lexer, parser, code generator)
- `public/` - Frontend (HTML, CSS, JS)
- `server.js` - Node.js/Express backend
- `test/` - Test files

## Usage
1. Start the server:
   ```powershell
   node server.js
   ```
2. Open your browser to `http://localhost:3000`
3. Enter C code, click Analyze, and view results

## Git & GitHub
- To push changes: `git add . && git commit -m "message" && git push`
- If you encounter merge conflicts, resolve them and commit again.

## Edge Cases and Limitations

This compiler is designed for educational purposes and supports a subset of the C language. Here are important edge cases and limitations to be aware of:

1. **Operator Precedence and Associativity**
   - The parser uses a precedence table, but may not handle all C operator precedence/associativity rules perfectly, especially for less common operators or combinations.

2. **Parentheses and Nested Expressions**
   - Parentheses are supported, but deeply nested or malformed expressions (e.g., missing parentheses) may not be handled robustly.

3. **Unary Operators**
   - Unary operators like `-a`, `+a`, `!a`, `~a`, and increment/decrement (`++a`, `a++`) are not handled by the current expression parser.

4. **Assignment Operators**
   - Compound assignments (`+=`, `-=`, etc.) are not expanded into their equivalent three-address code.

5. **Function Calls in Expressions**
   - Expressions like `int x = foo(a + b);` are not parsed into three-address code for the arguments and the call.

6. **Array Access and Structs**
   - Expressions like `a[i] + b[j]` or `s.x + t.y` are not supported.

7. **Type Handling**
   - Only `int`, `float`, `double`, and `char` are recognized for variable declarations. No type checking or casting is performed.

8. **Error Handling**
   - Syntax errors (e.g., missing semicolons, invalid tokens) are not reported with helpful messages; the parser may silently skip or misinterpret lines.

9. **Control Flow**
   - Only simple `if-else` is supported. No support for `while`, `for`, `do-while`, `switch`, or `goto`.

10. **Return Statements**
    - Only simple `return` statements are supported; complex return expressions may not be fully decomposed.

11. **No String or Character Literals**
    - String and character literals are not tokenized or parsed.

12. **No Floating Point or Hex Literals**
    - Only integer literals are handled; floating-point, hex, or octal literals are not parsed.

13. **No Preprocessor Directives**
    - Preprocessor directives (`#define`, `#include`, etc.) are ignored or treated as symbols, not processed.

14. **No Comments in Expressions**
    - Comments inside expressions may break parsing.

15. **No Multi-Statement Lines**
    - Multiple statements on a single line (e.g., `int a=1; int b=2;`) may not be parsed correctly.

---

**Summary:**
This compiler works well for simple, single-statement, arithmetic-heavy C code with basic if-else, but will not handle more advanced C features, complex expressions, or error cases robustly. These are the main edge cases and limitations to be aware of.

---

Created by AdityaPandey6
