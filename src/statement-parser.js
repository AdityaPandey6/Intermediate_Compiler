// Handles parsing of statements and extraction of global variables for the simplified compiler

function extractGlobalVariables(sourceCode) {
    let code = sourceCode.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/[^]*/g, '');
    const lines = code.split('\n');
    const globalVarRegex = /^(int|float|double|char)\s+(\w+)\s*=\s*(.+);$/;
    const globalVariables = [];
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        if (trimmedLine.includes('(') && trimmedLine.includes(')') && !trimmedLine.endsWith(';')) break;
        const match = trimmedLine.match(globalVarRegex);
        if (match) {
            globalVariables.push({ type: match[1], name: match[2], value: match[3] });
        }
    }
    return globalVariables;
}

function parseStatements(sourceCode) {
    const statements = [];
    let code = sourceCode.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/[^]*/g, '');
    const lines = code.split('\n');
    let i = 0;
    while (i < lines.length) {
        let trimmedLine = lines[i].trim();
        if (!trimmedLine) { i++; continue; }
        // If-else statement
        if (trimmedLine.startsWith('if')) {
            const conditionMatch = trimmedLine.match(/^if\s*\((.*)\)\s*{\s*$/);
            if (conditionMatch) {
                const condition = conditionMatch[1];
                let ifBlock = [];
                i++;
                while (i < lines.length && !lines[i].trim().startsWith('}')) {
                    ifBlock.push(lines[i]);
                    i++;
                }
                i++; // skip '}'
                // Check for else
                let elseBlock = [];
                if (i < lines.length && lines[i].trim().startsWith('else')) {
                    i++; // skip 'else {'
                    if (lines[i].trim().startsWith('{')) i++;
                    while (i < lines.length && !lines[i].trim().startsWith('}')) {
                        elseBlock.push(lines[i]);
                        i++;
                    }
                    i++; // skip '}'
                }
                statements.push({
                    type: 'if_else',
                    condition,
                    ifBlock: parseStatements(ifBlock.join('\n')),
                    elseBlock: elseBlock.length > 0 ? parseStatements(elseBlock.join('\n')) : []
                });
                continue;
            }
        }
        const varDeclMatch = trimmedLine.match(/^(int|float|double|char)\s+(\w+)\s*=\s*(.+);$/);
        if (varDeclMatch) {
            statements.push({ type: 'variable_declaration', dataType: varDeclMatch[1], name: varDeclMatch[2], value: varDeclMatch[3] });
            i++; continue;
        }
        const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+);$/);
        if (assignMatch) {
            statements.push({ type: 'assignment', name: assignMatch[1], value: assignMatch[2] });
            i++; continue;
        }
        const exprMatch = trimmedLine.match(/^(.+);$/);
        if (exprMatch) {
            statements.push({ type: 'expression', value: exprMatch[1] });
            i++; continue;
        }
        i++;
    }
    return statements;
}

module.exports = { extractGlobalVariables, parseStatements };
