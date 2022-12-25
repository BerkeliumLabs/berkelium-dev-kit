import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import chalk from 'chalk';
import { DATASET } from '../core/preprocess';

export class IntentClassification {

    private MODEL: any;

    private INTENT_PATTERNS: Array<any> = [];
    private INTENT_CLASSES: Array<any> = [];
    private TRAINING_LABELS: Array<string> = [];

    private TRAIN_EPOCHS: number = 20;
    private INPUT_LENGTH: number = 10;
    private VOCABULARY: any;

    constructor(dataset: DATASET) {
        this.INTENT_PATTERNS = dataset.x;
        this.INTENT_CLASSES = dataset.y;
        this.TRAINING_LABELS = dataset.labels;
        this.INPUT_LENGTH = dataset.length;
        this.VOCABULARY = dataset.vocab;
    }

    train() {
        // console.log(this.INPUT_LENGTH);
        return new Promise(async (resolve, reject) => {
            const trainX = tf.stack(this.INTENT_PATTERNS.map(x => tf.tensor1d(x)));
            const trainY = tf.stack(this.INTENT_CLASSES.map(x => tf.tensor1d(x)));
            const length = this.TRAINING_LABELS.length;
            // const batchSize = this.INTENT_PATTERNS.length;
            // const xyDataset = tf.data.zip({ xs: trainX, ys: trainY }).batch(batchSize);
            const inputShape = [this.INPUT_LENGTH];

            // console.log(`dataset: ${trainX.shape}`);

            const embeddings = tf.layers.embedding({
                inputDim: Object.keys(this.VOCABULARY).length,
                outputDim: 16,
                name: 'bkEmbed',
                inputShape: inputShape,
                maskZero: true
            });

            this.MODEL = tf.sequential();
            this.MODEL.add(embeddings);
            // this.MODEL.add(tf.layers.globalAveragePooling1d());
            // this.MODEL.add(tf.layers.bidirectional({ layer: tf.layers.lstm({ units: 64 }) }));
            this.MODEL.add(tf.layers.flatten());
            this.MODEL.add(tf.layers.dense({ units: 64, activation: 'relu' }));
            // this.MODEL.add(tf.layers.dropout({ rate: 0.5 }));
            this.MODEL.add(tf.layers.dense({ units: length, activation: 'sigmoid' }));
            this.MODEL.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
            // console.log(trainX.shape, this.INTENT_PATTERNS[5], this.INTENT_PATTERNS[5].length);

            this.MODEL.summary();

            try {
                await this.MODEL.fit(trainX, trainY, {
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

                    resolve(this.MODEL);
                });
            } catch (err) {
                console.log('Training Err:', err);
                reject(err);
            };
        });
    }
}