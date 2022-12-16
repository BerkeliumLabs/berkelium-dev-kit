import { Tokenizer } from './core/tokenizer';
import { TextEncorder } from './core/encorder';
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
    classification: {
        intent: {
            train: (datasetPath: string, outputPath: string) => {
                try {
                    const bkTrain = new IntentClassification(datasetPath, outputPath);

                    bkTrain.init();
                    
                } catch (error) {
                    console.log(chalk.red(' error ') + chalk.redBright(' Data read error: '), error);
                }
            }
        }
    }
}