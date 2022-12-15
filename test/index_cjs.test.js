const { berkelium } = require('../dist/berkelium.cjs');

test('Tokenizer', async () => {
    const answer = await berkelium.tokenize('hello, how  are you? It\'s 11');

    console.log(answer);
});