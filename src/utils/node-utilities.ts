import { fileSystem } from '@tensorflow/tfjs-node/dist/io/file_system.js';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { DATASET } from '../core/preprocess';

const __OUTDIR = 'models';
// const __DSPATH: string = '';

export const bk_utils = {
    /**
     * This is a utility function used to read files (`.json` files).
     * This is used to load training data from `.json` files.
     * @param datasetPath `string` Path to `.json` file.
     * @returns `JSON` returns data in JSON format.
     */
    read: (datasetPath: string) => {
        let rawDataset;
        try {
            const rawData = fs.readFileSync(datasetPath);
            rawDataset = JSON.parse(rawData.toString()) as Array<any>;
        } catch (error) {
            console.log('Read Err:', error);
            rawDataset = undefined;
        }

        return rawDataset;
    },
    /**
     * This is a utility function used to save a model along with other necessary data.
     * @param model `MODEL` The model object return by `loadModel` function.
     * @param dataObj `DATASET` The dataset object return by `preprocess` function.
     */
    save: async (model: any, dataObj: DATASET) => {
        const timeStamp = Date.now();
        const modelOutFolder = path.resolve(__OUTDIR, timeStamp + '/');

        try {
            fs.mkdirSync(modelOutFolder, { recursive: true });
            await model.save(fileSystem(modelOutFolder)); // file://./model-1a

            const metaOutPath = path.resolve(modelOutFolder, 'metadata.json');
            const metadataJSON = {
                intents: dataObj.labels,
                vocab: dataObj.vocab,
                seq_len: dataObj.length
            };

            const metadataStr = JSON.stringify(metadataJSON);
            fs.writeFileSync(metaOutPath, metadataStr, { encoding: 'utf8' });

            console.log(
                chalk.bgGreen.black(' info ') +
                chalk.green(` Model data saved to: `) +
                chalk.underline(`${modelOutFolder}\n`)
            );
        } catch (error) {
            console.log(chalk.red(`Oops! We couldn't save your model:\n${error}`));
        }

        return;
    }
}