import { Tokenizer } from './core/tokenizer';
import { TextEncorder } from './core/encorder';
import { Preprocessor } from './core/preprocess';
import { IntentClassification } from './modules/intent-classification';

import chalk from 'chalk';

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
            train: () => {
                try {
                    const bkTrain = new IntentClassification();

                    bkTrain.trainModel();
                    
                } catch (error) {
                    console.log(chalk.red(' error ') + chalk.redBright(' Data read error: '), error);
                }
            }
        }
    }
}