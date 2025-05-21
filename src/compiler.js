const { SimplifiedCompiler } = require('./simplified-compiler');

class Compiler {
  constructor() {
    this.compiler = new SimplifiedCompiler();
  }

  compile(sourceCode, options = {}) {
    return this.compiler.compile(sourceCode, options);
  }
}

module.exports = { Compiler };
