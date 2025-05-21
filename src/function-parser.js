// Handles parsing of functions, parameters, and function bodies for the simplified compiler

function parseFunctions(sourceCode, parseParameters) {
    const functions = [];
    const functionRegex = /(int|void|float|double|char)\s+(\w+)\s*\(([^)]*)\)\s*{/g;
    let match;
    while ((match = functionRegex.exec(sourceCode)) !== null) {
        const [fullMatch, returnType, name, params] = match;
        const startPos = match.index + fullMatch.length;
        let braceCount = 1;
        let endPos = startPos;
        for (let i = startPos; i < sourceCode.length; i++) {
            if (sourceCode[i] === '{') braceCount++;
            if (sourceCode[i] === '}') braceCount--;
            if (braceCount === 0) {
                endPos = i;
                break;
            }
        }
        const body = sourceCode.substring(startPos, endPos);
        const parameters = parseParameters(params);
        functions.push({ returnType, name, parameters, body });
    }
    return functions;
}

function parseParameters(params) {
    if (!params.trim()) return [];
    const paramList = params.split(',').map(param => param.trim());
    const result = [];
    for (const param of paramList) {
        const parts = param.split(/\s+/);
        if (parts.length >= 2) {
            const type = parts[0];
            const name = parts[1];
            result.push({ type, name });
        }
    }
    return result;
}

function parseFunctionBody(body, parseStatements) {
    return parseStatements(body);
}

module.exports = { parseFunctions, parseParameters, parseFunctionBody };
