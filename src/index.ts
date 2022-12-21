import { Tokenizer } from './core/tokenizer';
import { TextEncorder } from './core/encorder';
import { DATASET, Preprocessor } from './core/preprocess';
import { IntentClassification } from './modules/intent-classification';
import { IntentPrediction } from './modules/intent-prediction';

import chalk from 'chalk';

let newModel: IntentPrediction;

export const berkelium = {
    tokenize: (sentence: string) => {
        const bkTokenizer = new Tokenizer();

        return bkTokenizer.initialize(sentence);
    },
    encode: (tokens: Array<string>) => {
        const encodings = new TextEncorder();

        return encodings.encode(tokens);
    },
    preprocess: async (rawData: Array<any>) => {
        const preProcessor = new Preprocessor(rawData);
        const preProcessedData = await preProcessor.init();

        return preProcessedData;
    },
    classification: {
        intent: {
            train: async (dataset: DATASET) => {
                try {
                    const bkTrain = new IntentClassification(dataset);

                    const model = await bkTrain.train();

                    return model;
                    
                } catch (error) {
                    console.log(chalk.red(' error ') + chalk.redBright(' Training failed: '), error);
                }
            },
            loadModel: async (modelURL: string) => {
                newModel = new IntentPrediction(modelURL);
                await newModel.loadModel();
                return newModel;
            }
        }
    }
}