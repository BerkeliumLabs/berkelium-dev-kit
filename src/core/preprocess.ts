import * as tf from '@tensorflow/tfjs';
import { Tokenizer } from '../core/tokenizer';
import { TextEncorder } from '../core/encorder';
import chalk from 'chalk';

export interface DATASET {
    x: Array<any>,
    y: Array<any>,
    labels: Array<string>,
    vocab: any,
    length: number
}

export class Preprocessor {

    private RAW_DATA: Array<any> = [];
    private CORPUS_DATA: Array<any> = [];
    private INTENT_PATTERNS: Array<any> = [];
    private INTENT_CLASSES: Array<any> = [];
    private TRAINING_DATA: Array<any> = [];
    private TRAINING_LABELS: Array<string> = [];

    private INPUT_LENGTH: number = 10;
    private VOCABULARY: any;

    constructor(rawDataset: Array<any>) {
        this.RAW_DATA = rawDataset;
    }

    async init() {
        let trainingDataset: DATASET = {
            x: this.TRAINING_DATA,
            y: this.INTENT_CLASSES,
            labels: this.TRAINING_LABELS,
            vocab: this.VOCABULARY,
            length: this.INPUT_LENGTH
        };
        try {
            await this.prepareTrainingData();
            await this.generateVocabulary(this.CORPUS_DATA.flat());
            await this.textVectorize();
            await this.padSequence();

            trainingDataset = {
                x: this.TRAINING_DATA,
                y: this.INTENT_CLASSES,
                labels: this.TRAINING_LABELS,
                vocab: this.VOCABULARY,
                length: this.INPUT_LENGTH
            };
        } catch (error) {
            console.log(chalk.red(' error ') + chalk.redBright(' Data read error: '), error);
        }

        return trainingDataset;
    }

    private async prepareTrainingData() {

        console.log(
            chalk.bgGreen.black(' info ') +
            chalk.greenBright(` Data Preprocessing Started: ${this.RAW_DATA.length} inputs\n`)
        );

        try {
            const intentLabels = this.RAW_DATA.map((dataObj: Array<string>) => {
                if (!this.TRAINING_LABELS.includes(dataObj[1])) {
                    this.TRAINING_LABELS.push(dataObj[1]);
                }
                this.CORPUS_DATA.push(dataObj[0]);
            });

            Promise.all(intentLabels).then(async () => {
                return;
            });

        } catch (error) {
            console.error(chalk.redBright('Encoding Error:'), error);
        }
    }

    private generateVocabulary(textData: Array<string>) {
        const bkTokenizer = new Tokenizer();
        const tokenCollection: Array<any> = [];

        return new Promise((resolve) => {
            const getVocab = textData.map(async (sentence) => {
                let tokens = await bkTokenizer.initialize(sentence);
                tokenCollection.push(tokens);
            });

            Promise.all(getVocab).then(async () => {
                const bkEncoder = new TextEncorder();
                this.VOCABULARY = await bkEncoder.encode(tokenCollection.flat());
                // console.log(Object.keys(this.VOCABULARY).length);
                resolve(this.VOCABULARY);
            });
        });
    }

    private textVectorize() {
        const bkTokenizer = new Tokenizer();
        return new Promise((resolve, reject) => {
            const encodedDS = this.RAW_DATA.map(async (dataObj: Array<string>) => {
                const patternEmbeddings = await bkTokenizer.initialize(dataObj[0]);
                const classEmbeddings = await this.classOneHotEncode(dataObj[1]);

                if (this.INPUT_LENGTH < patternEmbeddings.length) {
                    this.INPUT_LENGTH = patternEmbeddings.length;
                    //console.log(patternEmbeddings.length);
                }

                this.INTENT_PATTERNS.push(patternEmbeddings);
                this.INTENT_CLASSES.push(classEmbeddings);
                // console.log(`sample encoding?: ${patternEmbeddings.length}`);

            });

            Promise.all(encodedDS).then(() => {
                resolve(this.INTENT_PATTERNS);
            }).catch((err) => {
                console.log('Data Error:', err);
                reject(err);
            });;
        });
    }

    private padSequence() {
        return new Promise((resolve, reject) => {
            const paddedSequences = this.INTENT_PATTERNS.map((tokens) => {
                const numPad = this.INPUT_LENGTH - tokens.length;
                const zeroPads = tf.zeros([1, numPad]).arraySync() as Array<number>;
                // console.log(`pad?: ${numPad} => ${tokens.length} ${typeof zeroPads}`);
                try {
                    let finalEmbedding: Array<any> = [];
                    const mapToken = tokens.map((word: string) => {
                        finalEmbedding.push(this.VOCABULARY[word]);
                        // console.log(word);
                    });

                    Promise.all(mapToken).then(() => {
                        if (numPad !== 0) {
                            this.TRAINING_DATA.push(finalEmbedding.concat(zeroPads[0]));
                        } else {
                            this.TRAINING_DATA.push(finalEmbedding);
                        }
                        // console.log(this.TRAINING_DATA);
                    }).catch((err) => {
                        console.log('Padding Error:', err);
                        reject(err);
                    });
                } catch (error) {
                    console.log('Vectorizing Error:', error);
                }
            });

            Promise.all(paddedSequences).then(() => {
                // console.log(this.TRAINING_DATA);
                resolve(this.TRAINING_DATA);
            }).catch((err) => {
                console.log('Padding Error:', err);
                reject(err);
            });
        });
    }

    private classOneHotEncode(className: string) {
        let classVector = tf.zeros([1, this.TRAINING_LABELS.length]).arraySync() as Array<any>;
        const classIndex = this.TRAINING_LABELS.indexOf(className);
        classVector[0][classIndex] = 1;
        // console.log(classVector);
        return classVector[0];
    }
}