// Simple C lexer for tokenizing source code
const KEYWORDS = [
    'auto', 'break', 'case', 'char', 'const', 'continue',
    'default', 'do', 'double', 'else', 'enum', 'extern',
    'float', 'for', 'goto', 'if', 'inline', 'int',
    'long', 'register', 'restrict', 'return', 'short', 'signed',
    'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
    'unsigned', 'void', 'volatile', 'while',
    '_Alignas', '_Alignof', '_Atomic', '_Generic', '_Noreturn',
    '_Static_assert', '_Thread_local'
];
const OPERATORS = [
    '+', '-', '*', '/', '%', '++', '--',
    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|=',
    '==', '!=', '<', '>', '<=', '>=',
    '&&', '||', '!',
    '&', '|', '^', '~', '<<', '>>',
    '?', ':', '.', '->', '...'
];

const SYMBOLS = [
    '(', ')', '{', '}', '[', ']',
    ';', ',', '#', '##',
    '#define', '#include', '#ifdef', '#ifndef', '#endif', '#if', '#else', '#elif',
    '\\'
];

function isWhitespace(ch) {
    return /\s/.test(ch);
}

function isDigit(ch) {
    return /[0-9]/.test(ch);
}

function isAlpha(ch) {
    return /[a-zA-Z_]/.test(ch);
}

function isAlnum(ch) {
    return /[a-zA-Z0-9_]/.test(ch);
}

function lex(source) {
    const tokens = [];
    let i = 0;
    while (i < source.length) {
        let ch = source[i];
        if (isWhitespace(ch)) { i++; continue; }
        // Comments
        if (ch === '/' && source[i + 1] === '/') {
            while (i < source.length && source[i] !== '\n') i++;
            continue;
        }
        if (ch === '/' && source[i + 1] === '*') {
            i += 2;
            while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++;
            i += 2;
            continue;
        }
        // Numbers
        if (isDigit(ch)) {
            let start = i;
            while (i < source.length && isDigit(source[i])) i++;
            tokens.push({ type: 'NUMBER', value: source.slice(start, i) });
            continue;
        }
        // Identifiers/Keywords
        if (isAlpha(ch)) {
            let start = i;
            while (i < source.length && isAlnum(source[i])) i++;
            let word = source.slice(start, i);
            if (KEYWORDS.includes(word)) {
                tokens.push({ type: 'KEYWORD', value: word });
            } else {
                tokens.push({ type: 'IDENTIFIER', value: word });
            }
            continue;
        }
        // Operators
        let op = OPERATORS.find(op => source.startsWith(op, i));
        if (op) {
            tokens.push({ type: 'OPERATOR', value: op });
            i += op.length;
            continue;
        }
        // Symbols
        if (SYMBOLS.includes(ch)) {
            tokens.push({ type: 'SYMBOL', value: ch });
            i++;
            continue;
        }
        // Unknown character
        tokens.push({ type: 'UNKNOWN', value: ch });
        i++;
    }
    return tokens;
}

module.exports = { lex };
