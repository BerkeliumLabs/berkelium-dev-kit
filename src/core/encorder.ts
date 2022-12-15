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
                const encoding = []
                for(let index = 0; index < word.length; index++) {
                    const charID = ENGLISH_CHAR[word.charAt(index)];
                    encoding.push(charID)
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