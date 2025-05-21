/**
 * Main compiler file for the C-to-Intermediate-Code compiler
 */

const { SimplifiedCompiler } = require('./simplified-compiler');

class Compiler {
  constructor() {
    this.compiler = new SimplifiedCompiler();
  }

  /**
   * Compile C code to intermediate code
   * @param {string} sourceCode - The C source code to compile
   * @param {Object} options - Compilation options
   * @returns {Object} Compilation result
   */
  compile(sourceCode, options = {}) {
    return this.compiler.compile(sourceCode, options);
  }
}

module.exports = { Compiler };
