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

const PRECEDENCE = {
    '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5,
    '==': 6, '!=': 6, '<': 7, '>': 7, '<=': 7, '>=': 7,
    '<<': 8, '>>': 8, '+': 9, '-': 9, '*': 10, '/': 10, '%': 10
};

function tokenizeExpr(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        let ch = expr[i];
        if (/\s/.test(ch)) { i++; continue; }
        if (/[a-zA-Z_]/.test(ch)) {
            let start = i;
            while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) i++;
            tokens.push({ type: 'id', value: expr.slice(start, i) });
            continue;
        }
        if (/[0-9]/.test(ch)) {
            let start = i;
            while (i < expr.length && /[0-9]/.test(expr[i])) i++;
            tokens.push({ type: 'num', value: expr.slice(start, i) });
            continue;
        }
        if (expr.slice(i, i + 2) === '==') { tokens.push({ type: 'op', value: '==' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '!=') { tokens.push({ type: 'op', value: '!=' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '>=') { tokens.push({ type: 'op', value: '>=' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '<=') { tokens.push({ type: 'op', value: '<=' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '&&') { tokens.push({ type: 'op', value: '&&' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '||') { tokens.push({ type: 'op', value: '||' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '<<') { tokens.push({ type: 'op', value: '<<' }); i += 2; continue; }
        if (expr.slice(i, i + 2) === '>>') { tokens.push({ type: 'op', value: '>>' }); i += 2; continue; }
        if ('+-*/%<>&^|=()'.includes(ch)) {
            tokens.push({ type: 'op', value: ch });
            i++;
            continue;
        }
        i++;
    }
    return tokens;
}

function parseExpression(expr, tempVars) {
    const tokens = tokenizeExpr(expr);
    const output = [];
    const stack = [];
    for (let t of tokens) {
        if (t.type === 'id' || t.type === 'num') {
            output.push(t.value);
        } else if (t.type === 'op') {
            if (t.value === '(') {
                stack.push(t.value);
            } else if (t.value === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop();
            } else {
                while (stack.length && stack[stack.length - 1] !== '(' && PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[t.value]) {
                    output.push(stack.pop());
                }
                stack.push(t.value);
            }
        }
    }
    while (stack.length) output.push(stack.pop());
    const evalStack = [];
    let tempCount = tempVars.count;
    const code = [];
    for (let tok of output) {
        if (!(tok in PRECEDENCE)) {
            evalStack.push(tok);
        } else {
            let b = evalStack.pop();
            let a = evalStack.pop();
            let t = `t${tempCount++}`;
            code.push({ target: t, left: a, op: tok, right: b });
            evalStack.push(t);
        }
    }
    tempVars.count = tempCount;
    return { result: evalStack[0], code };
}

function parseStatements(sourceCode, tempVars = { count: 0 }) {
    const statements = [];
    let code = sourceCode.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/[^]*/g, '');
    const lines = code.split('\n');
    let i = 0;
    while (i < lines.length) {
        let trimmedLine = lines[i].trim();
        if (!trimmedLine) { i++; continue; }
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
                i++;
                let elseBlock = [];
                let hasElse = false;
                if (i < lines.length && lines[i].trim().startsWith('else')) {
                    hasElse = true;
                    i++;
                    if (i < lines.length && lines[i].trim().startsWith('{')) i++;
                    while (i < lines.length && !lines[i].trim().startsWith('}')) {
                        elseBlock.push(lines[i]);
                        i++;
                    }
                    i++;
                }
                statements.push({
                    type: 'if_else',
                    condition,
                    ifBlock: parseStatements(ifBlock.join('\n'), tempVars),
                    elseBlock: hasElse ? parseStatements(elseBlock.join('\n'), tempVars) : []
                });
                continue;
            }
        }
        const varDeclMatch = trimmedLine.match(/^(int|float|double|char)\s+(\w+)\s*=\s*(.+);$/);
        if (varDeclMatch) {
            const expr = varDeclMatch[3];
            const exprResult = parseExpression(expr, tempVars);
            for (const c of exprResult.code) {
                statements.push({ type: 'assignment', name: c.target, value: `${c.left} ${c.op} ${c.right}` });
            }
            statements.push({ type: 'variable_declaration', dataType: varDeclMatch[1], name: varDeclMatch[2], value: exprResult.result });
            i++; continue;
        }
        const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+);$/);
        if (assignMatch) {
            const expr = assignMatch[2];
            const exprResult = parseExpression(expr, tempVars);
            for (const c of exprResult.code) {
                statements.push({ type: 'assignment', name: c.target, value: `${c.left} ${c.op} ${c.right}` });
            }
            statements.push({ type: 'assignment', name: assignMatch[1], value: exprResult.result });
            i++; continue;
        }
        const exprMatch = trimmedLine.match(/^(.+);$/);
        if (exprMatch) {
            const expr = exprMatch[1];
            const exprResult = parseExpression(expr, tempVars);
            for (const c of exprResult.code) {
                statements.push({ type: 'assignment', name: c.target, value: `${c.left} ${c.op} ${c.right}` });
            }
            statements.push({ type: 'expression', value: exprResult.result });
            i++; continue;
        }
        i++;
    }
    return statements;
}

module.exports = { extractGlobalVariables, parseStatements };
