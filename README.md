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

---

Created by AdityaPandey6
