import { berkelium } from '../dist/berkelium.esm';
import { bk_utils } from '../dist/utils/utils.esm';
import { jest } from '@jest/globals';

let answer = [];
const intentData = './test/data/intents.json';
const outputFolder = 'build';
const modelUrl = 'file://D:/BerkeliumLabs/project/nlp-test/models/model.json';
const metadata = 'models/model_metadata.json';
let rawData;
let trainingData;

jest.setTimeout(30000);

test('Tokenizer', async () => {
    answer = await berkelium.tokenize('hello, how  are you? It\'s 10, hello?');

    console.log(answer);
});

test('Encoder', async () => {
    const encodes = await berkelium.encode(answer);

    console.log(encodes['you']);
    console.log(encodes);
});

test('Load Data', async () => {
    rawData = await bk_utils.read(intentData);
    console.log(rawData.slice(0, 3), rawData.length);
});

test('Preprocess Data', async () => {
    trainingData = await berkelium.preprocess(rawData.slice(0, 300));
    console.log(trainingData.y, trainingData.x.length);
});

test('Train Intent Classification Model', async () => {
    // await berkelium.classification.intent.train(intentData, outputFolder);
});