/**
 * A simplified C to Intermediate Code compiler
 * This compiler parses and translates C code to intermediate code
 */

const { parseFunctions, parseParameters, parseFunctionBody } = require('./function-parser');
const { extractGlobalVariables, parseStatements } = require('./statement-parser');
const { generateIntermediateCode, generateStandaloneCode, generateFunctionCode } = require('./code-generator');

class SimplifiedCompiler {
  constructor() {
    this.sourceCode = '';
    this.globalVariables = [];
  }

  /**
   * Compile C code to intermediate code
   * @param {string} sourceCode - The C source code to compile
   * @returns {Object} Compilation result with success flag and code or error
   */
  compile(sourceCode) {
    this.sourceCode = sourceCode;
    this.globalVariables = extractGlobalVariables(this.sourceCode);
    try {
      const intermediateCode = generateIntermediateCode(this, {
        parseFunctions,
        parseParameters,
        parseFunctionBody,
        parseStatements
      });
      return { success: true, code: intermediateCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { SimplifiedCompiler };
