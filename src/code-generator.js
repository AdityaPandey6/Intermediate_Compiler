// Handles code generation for intermediate code, functions, and standalone code

function generateIntermediateCode(compiler, helpers) {
    const { parseFunctions } = helpers;
    const functions = parseFunctions(compiler.sourceCode, helpers.parseParameters);
    if (functions.length === 0) {
        return generateStandaloneCode(compiler, helpers);
    }
    let output = '';
    if (compiler.globalVariables.length > 0) {
        output += "// Global variables\n";
        for (const variable of compiler.globalVariables) {
            output += `${variable.name} = ${variable.value}\n`;
        }
        output += "\n";
    }
    for (const func of functions) {
        output += generateFunctionCode(func, helpers);
    }
    return output;
}

function generateStandaloneCode(compiler, helpers) {
    const { parseStatements } = helpers;
    const statements = parseStatements(compiler.sourceCode);
    if (statements.length === 0) {
        return "// No code to compile\n";
    }
    let output = "main:\n";
    output += "  // Entry\n";
    let tempCount = 0;
    function emitStatements(stmts, labelIndex = { value: 0 }) {
        for (const stmt of stmts) {
            if (stmt.type === 'variable_declaration') {
                output += `  ${stmt.name} = ${stmt.value}\n`;
            } else if (stmt.type === 'assignment') {
                output += `  ${stmt.name} = ${stmt.value}\n`;
            } else if (stmt.type === 'expression') {
                output += `  t${tempCount++} = ${stmt.value}\n`;
            } else if (stmt.type === 'if_else') {
                const lTrue = `L_if_true_${labelIndex.value}`;
                const lFalse = `L_if_false_${labelIndex.value}`;
                const lEnd = `L_if_end_${labelIndex.value}`;
                labelIndex.value++;
                output += `  ifFalse ${stmt.condition} goto ${lFalse}\n`;
                emitStatements(stmt.ifBlock, labelIndex);
                output += `  goto ${lEnd}\n`;
                output += `${lFalse}:\n`;
                if (stmt.elseBlock && stmt.elseBlock.length > 0) {
                    emitStatements(stmt.elseBlock, labelIndex);
                }
                output += `${lEnd}:\n`;
            }
        }
    }
    emitStatements(statements);
    output += "  return 0\n";
    output += "\nL_end:\n";
    output += "  // Function exit\n";
    return output;
}

function generateFunctionCode(func, helpers) {
    const { parseFunctionBody } = helpers;
    let code = '';
    code += `${func.name}:\n`;
    code += '  // Entry\n';
    const statements = parseFunctionBody(func.body, helpers.parseStatements);
    let tempCount = 0;
    function emitStatements(stmts, labelIndex = { value: 0 }) {
        for (const stmt of stmts) {
            if (stmt.type === 'variable_declaration') {
                code += `  ${stmt.name} = ${stmt.value}\n`;
            } else if (stmt.type === 'assignment') {
                code += `  ${stmt.name} = ${stmt.value}\n`;
            } else if (stmt.type === 'expression') {
                code += `  t${tempCount++} = ${stmt.value}\n`;
            } else if (stmt.type === 'if_else') {
                const lTrue = `L_if_true_${labelIndex.value}`;
                const lFalse = `L_if_false_${labelIndex.value}`;
                const lEnd = `L_if_end_${labelIndex.value}`;
                labelIndex.value++;
                code += `  ifFalse ${stmt.condition} goto ${lFalse}\n`;
                emitStatements(stmt.ifBlock, labelIndex);
                code += `  goto ${lEnd}\n`;
                code += `${lFalse}:\n`;
                if (stmt.elseBlock && stmt.elseBlock.length > 0) {
                    emitStatements(stmt.elseBlock, labelIndex);
                }
                code += `${lEnd}:\n`;
            } else if (stmt.type === 'return') {
                if (stmt.value) {
                    code += `  return ${stmt.value}\n`;
                } else {
                    code += '  return\n';
                }
            } else if (stmt.type === 'function_call') {
                for (const arg of stmt.arguments) {
                    code += `  param ${arg}\n`;
                }
                code += `  t${tempCount} = call ${stmt.name}, ${stmt.arguments.length}\n`;
                tempCount++;
            }
        }
    }
    emitStatements(statements);
    if (!statements.some(stmt => stmt.type === 'return')) {
        code += '  return 0\n';
    }
    code += '\nL_end:\n';
    code += '  // Function exit\n\n';
    return code;
}

module.exports = { generateIntermediateCode, generateStandaloneCode, generateFunctionCode };
