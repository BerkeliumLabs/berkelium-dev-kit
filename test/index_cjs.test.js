const { berkelium } = require('../dist/berkelium.cjs');

let answer = [];

test('Tokenizer', async () => {
    answer = await berkelium.tokenize('hello, how  are you? It\'s 10');

    console.log(answer);
});

test('Encoder', async () => {
    const encodes = await berkelium.encode(answer);

    console.log(encodes);
});