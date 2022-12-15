import { ENGLISH_CHAR } from './lang/english';

export class TextEncorder {
    private language = 'en';

    constructor() {
        this.language = 'en';
    }

    async encode(tokens: Array<string>) {
        const encodedTokens: Array<any> = [];

        if (this.language === 'en') {
            tokens.map(async (word: string)=>{
                const encoded = await this.generateEncodings(word);
                encodedTokens.push(encoded);
            });
        }

        return encodedTokens;
    }

    private generateEncodings(word: string) {
        const encodedToken = new Promise((resolve, reject) => {
            try {
                const encoding = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                let word_length = encoding.length;
                if (word.length <= word_length) {
                    word_length = word.length;
                }
                for(let index = 0; index < word_length; index++) {
                    let charID = -1;
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
    }
}