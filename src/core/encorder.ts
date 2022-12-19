//import { ENGLISH_CHAR } from './lang/english';

export interface DICTIONARY_BOOK {
    [key: string]: number;
}
export class TextEncorder {
    //private language = 'en';

    constructor() {
        //this.language = 'en';
    }

    async encode(tokens: Array<string>) {
        let encodedTokens: Array<any> = [];
        const vocab: DICTIONARY_BOOK = {
            'oov': 0
        }

        /* if (this.language === 'en') {
            tokens.map(async (word: string)=>{
                const encoded = await this.generateEncodings(word);
                encodedTokens.push(encoded);
            });
        } */

        return new Promise((resolve, reject) => {
            try {
                const uniqueVocab = tokens.map((word) => {
                    if (!encodedTokens.includes(word)) {
                        encodedTokens.push(word);
                    }
                });
        
                Promise.all(uniqueVocab).then(() => {
                    encodedTokens.sort();
                    encodedTokens.map((word, index)=>{
                        vocab[word] = index + 1;
                    });
                    // console.log(encodedTokens);
                });
        
                resolve(vocab);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /* private generateEncodings(word: string) {
        const encodedToken = new Promise((resolve, reject) => {
            try {
                const encoding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let word_length = encoding.length;
                if (word.length <= word_length) {
                    word_length = word.length;
                }

                for(let index = 0; index < word.length; index++) {
                    let charID = 0;
                    const hasNumber = parseInt(word.charAt(index));
                    // console.log(typeof hasNumber);
                    if (!isNaN(hasNumber)) {
                        charID = parseInt(word.charAt(index));
                    } else {
                        charID = ENGLISH_CHAR[word.charAt(index)];
                    }
                    // console.log(charID, word.charAt(index), typeof charID);
                    encoding[index] = charID;
                }
                resolve(encoding);               
            } catch (error) {
                reject(error);
                console.log(error);
            }
        });

        return encodedToken;
    } */
}