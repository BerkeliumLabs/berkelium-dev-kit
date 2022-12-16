import { berkelium } from '../dist/berkelium.esm';

let answer = [];
const intentData = './test/data/intents.json';
const outputFolder = 'build';
const modelUrl = 'file://D:/BerkeliumLabs/project/nlp-test/models/model.json';
const metadata = 'models/model_metadata.json';

test('Tokenizer', async () => {
    answer = await berkelium.tokenize('hello, how  are you? It\'s 10');

    console.log(answer);
});

test('Encoder', async () => {
    const encodes = await berkelium.encode(answer);

    console.log(encodes);
    console.log(encodes);
});

test('Train Intent Classification Model', async () => {
    // await berkelium.classification.intent.train(intentData, outputFolder);
});