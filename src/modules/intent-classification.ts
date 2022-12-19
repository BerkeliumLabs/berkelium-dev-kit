import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import chalk from 'chalk';

export class IntentClassification {

    private INTENT_PATTERNS: Array<any> = [];
    private INTENT_CLASSES: Array<any> = [];
    private TRAINING_LABELS: Array<string> = [];

    private TRAIN_EPOCHS: number = 20;
    private INPUT_LENGTH: number = 23;
    private VOCABULARY: any;

    constructor() {

    }

    async trainModel() {

        console.log(this.INPUT_LENGTH);

        const trainX = tf.stack(this.INTENT_PATTERNS.map(x => tf.tensor1d(x)));
        const trainY = tf.stack(this.INTENT_CLASSES.map(x => tf.tensor1d(x)));
        const length = this.TRAINING_LABELS.length;
        // const batchSize = this.INTENT_PATTERNS.length;
        // const xyDataset = tf.data.zip({ xs: trainX, ys: trainY }).batch(batchSize);
        const inputShape = [this.INPUT_LENGTH];

        console.log(`dataset: ${trainX.shape}`);

        const embeddings = tf.layers.embedding({
            inputDim: Object.keys(this.VOCABULARY).length,
            outputDim: 16,
            name: 'bkEmbed',
            inputShape: inputShape,
            maskZero: true
        });

        const model = tf.sequential();
        model.add(embeddings);
        // model.add(tf.layers.globalAveragePooling1d());
        // model.add(tf.layers.bidirectional({ layer: tf.layers.lstm({ units: 64 }) }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        // model.add(tf.layers.dropout({ rate: 0.5 }));
        model.add(tf.layers.dense({ units: length, activation: 'sigmoid' }));
        model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
        // console.log(trainX.shape, this.INTENT_PATTERNS[5], this.INTENT_PATTERNS[5].length);

        model.summary()

        try {
            await model.fit(trainX, trainY, {
                epochs: this.TRAIN_EPOCHS,
                verbose: 1,
                callbacks: tf.callbacks.earlyStopping({ monitor: 'acc' })
            }).then((info: any) => {

                const infoIndex = info.epoch.length - 1;
                const finalLoss = info.history.loss[infoIndex].toFixed(5);
                const finalAcc = info.history.acc[infoIndex].toFixed(5);

                console.log(
                    chalk.bgYellow.black(`\n Berkelium `) +
                    chalk.greenBright(` Training Completed at ${info.epoch.length} ==>`) +
                    chalk.yellowBright(` Loss: ${finalLoss}`) +
                    chalk.green(` | Accuracy: ${finalAcc}\n`)
                );

            });
        } catch (err) {
            console.log('Prom Err:', err)
        };
    }

    
}