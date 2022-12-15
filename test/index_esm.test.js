import { berkelium } from '../dist/berkelium.esm';

test('Tokenizer', async () => {
    const answer = await berkelium.tokenize('hello, how  are you?');

    console.log(answer);
});