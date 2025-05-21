const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { SimplifiedCompiler } = require('./src/simplified-compiler');
const { lex } = require('./src/lexer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/compile', (req, res) => {
    const code = req.body.code || '';
    const compiler = new SimplifiedCompiler();
    const result = compiler.compile(code);
    res.json({
        intermediate: result.code || '',
        error: result.error || null
    });
});

app.post('/api/lex', (req, res) => {
    const code = req.body.code || '';
    const tokens = lex(code);
    res.json({ tokens });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
