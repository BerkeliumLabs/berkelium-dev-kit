import { Tokenizer } from './core/tokenizer';
import { TextEncorder } from './core/encorder';
import { DATASET, Preprocessor } from './core/preprocess';
import { IntentClassification } from './modules/intent-classification';
import { IntentPrediction } from './modules/intent-prediction';

import chalk from 'chalk';

let newModel: IntentPrediction;

export const berkelium = {
    /**
     * Tokenizer function is used to tokenize
     * text input and returns a `Array<string>` of tokens.
     * @param sentence `string` A string input to be tokenized.
     * @returns `Array<string>` Returns a string array of tokens.
     */
    tokenize: (sentence: string) => {
        const bkTokenizer = new Tokenizer();

        return bkTokenizer.initialize(sentence);
    },
    /**
     * Encoder function vectorize the string tokens. Which means,
     * each string tokens will be assigned a unique number.
     * This is important when preparing text data to be feed in to a machine learning model.
     * Usually this function is used after tokenizing your string data using `tokenize` function.
     * @param tokens `Array<string>` A string array of tokens.
     * @returns `DICTIONARY_BOOK` An dictionary of vocabulary with their assigned unique numeric value.
     */
    encode: (tokens: Array<string>) => {
        const encodings = new TextEncorder();

        return encodings.encode(tokens);
    },
    /**
     * Preprocessor function process the text data and create a `DATASET` object 
     * that can be used to train machine learning model.
     * @param rawData `Array<Array<string>>` training data
     * @returns `DATASET` returns a dataset object
     */
    preprocess: async (rawData: Array<any>) => {
        const preProcessor = new Preprocessor(rawData);
        const preProcessedData = await preProcessor.init();

        return preProcessedData;
    },
    multiClass: {
        /**
         * Use to train a model
         * @param dataset accept `DATASET` Object.
         * @returns `MODEL` Object
         */
        train: async (dataset: DATASET) => {
            try {
                const bkTrain = new IntentClassification(dataset);

                const model = await bkTrain.train();

                return model;

            } catch (error) {
                console.log(chalk.red(' error ') + chalk.redBright(' Training failed: '), error);
            }
        },
        /**
         * Use to load a trained model
         * Note: `loadModel` function only accepts absolute URLs.
         * @param modelURL Absolute URL to model location
         * @returns `MODEL` Object
         */
        loadModel: async (modelURL: string) => {
            newModel = new IntentPrediction(modelURL);
            await newModel.loadModel();
            return newModel;
        }
    }
}