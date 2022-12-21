import * as tf from '@tensorflow/tfjs';
import chalk from 'chalk';
import { Tokenizer } from '../core/tokenizer';
import fetch from 'node-fetch';

interface METADATA {
    intents: Array<string>,
    vocab: any,
    seq_len: number
}

export class IntentPrediction {

    private MODEL_URL: string;
    private THE_MODEL: any;
    private THE_METADATA!: METADATA;

    constructor(modelURL: string) {
        this.MODEL_URL = modelURL;
    }

    loadModel() {
        return new Promise(async (resolve, reject) => {
            try {
                this.THE_MODEL = await tf.loadLayersModel(`${this.MODEL_URL}/model.json`);

                fetch(`${this.MODEL_URL}/metadata.json`)
                    .then((response) => response.json())
                    .then((data) => {
                        this.THE_METADATA = data;
                        resolve(this.THE_MODEL);
                    });
            } catch (error) {
                console.log(chalk.red(`Oops! We couldn't load your model:\n${error}`));
                reject(error);
            }
        });
    }

    predict(sentence: string) {

        return new Promise(async (resolve, reject) => {
            try {
                const inputVector: any = await this.input(sentence);
                const reply: any = await this.THE_MODEL.predict(tf.tensor([inputVector]));

                const prediction = reply.arraySync();
                let max = Math.max(...prediction[0]);

                let index = prediction[0].indexOf(max);
                // console.log(prediction[0], index, max, prediction[0].length);
                const predictionData = {
                    max: max,
                    index: index,
                    predictions: reply,
                    intent: this.THE_METADATA.intents[index]
                };

                resolve(predictionData)
            } catch (error) {
                console.log(chalk.red(`Oops! Prediction error:\n${error}`));
                reject(error);
            }
        });
    }

    private async input(sentence: string) {
        const bkTokenizer = new Tokenizer();

        const tokens = await bkTokenizer.initialize(sentence);

        const textVector = tokens.map((word) => {
            let vector;

            if(this.THE_METADATA.vocab.hasOwnProperty(word)) {
                vector = this.THE_METADATA.vocab[word];
            } else {
                vector = 0;
            }

            return vector;
        });

        return new Promise((resolve, reject) => {
            Promise.all(textVector).then(() => {
                const inputVector = this.padSequence(textVector);
                resolve(inputVector);
            }).catch((err) => {
                console.log(chalk.red(`input sentence error:\n${err}`));
                reject(err);
            });
        });
    }

    private padSequence(textVector: Array<number>) {
        let finalencode;

        if (textVector.length < this.THE_METADATA.seq_len) {
            const numPad = this.THE_METADATA.seq_len - textVector.length;
            const padzero: any = tf.zeros([1, numPad]).arraySync();
            finalencode = textVector.concat(padzero[0]);
        } else {
            finalencode = textVector.slice(0, (this.THE_METADATA.seq_len - 1));
        }
        return finalencode;
    }
}