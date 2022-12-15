const { berkelium } = require('../dist/berkelium.cjs');

test('test', () => {
    console.log(berkelium.classification.train());
});