import { berkelium } from '../dist/berkelium.esm';

let answer = [];

test('Tokenizer', async () => {
    answer = await berkelium.tokenize('hello, how  are you? It\'s 10');

    console.log(answer);
});

test('Encoder', async () => {
    const encodes = await berkelium.encode(answer);

    console.log(encodes);
});