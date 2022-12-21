import * as tf from '@tensorflow/tfjs';
import chalk from 'chalk';

export class IntentPrediction {

    private MODEL_URL: string;

    constructor(modelURL: string) {
        this.MODEL_URL = modelURL;
    }

    predict(sentence: Array<any>) {

        return new Promise(async(resolve, reject)=>{
            try {
                const model = await tf.loadLayersModel(this.MODEL_URL);
    
                const reply: any = await model.predict(tf.tensor([sentence]));
    
                const prediction = reply.arraySync();
                let max = Math.max(...prediction[0]);
    
                let index = prediction[0].indexOf(max);
                // console.log(prediction[0], index, max, prediction[0].length);
                const predictionData = {
                    max: max,
                    index: index,
                    predictions: reply
                };

                resolve(predictionData)
            } catch (error) {
                console.log(chalk.red(`Oops! We couldn't save your model:\n${error}`));
                reject(error);
            }
        });
    }
}