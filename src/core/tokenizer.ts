import { PUNCTUATIONS } from './lang/panctuations';
import { ENGLISH_CHAR } from './lang/english';
export class Tokenizer {

    private language: string = 'en';

    constructor() {
        this.language = 'en';
    }

    async initialize(sentence: string) {
        const rawString = sentence.toLowerCase();

        let stringTokens = await this.whiteSpaceToken(rawString);

        stringTokens = await this.removePunctuations(stringTokens);

        stringTokens = await this.normalizeText(stringTokens);

        return stringTokens;
    }

    private whiteSpaceToken(sentence: string) {
        return sentence.split(' ');
    }

    private removePunctuations(tokens: Array<string>) {
        const token_collection: Array<string> = [];

        tokens.map((token) => {
            if (token !== '') {
                PUNCTUATIONS.map((symbol) => {
                    token = token.replace(symbol, '');
                    // console.log(symbol, token);
                });
                token_collection.push(token);
            }
        });

        return token_collection;
    }

    private normalizeText(sentence: Array<string>) {
        let normalizedString: Array<string> = [];
        if (this.language === 'en') {
            sentence.map(async(word: string)=>{
                const isPure = await this.checkLanguageChar(word);
                
                if(isPure) {
                    normalizedString.push(word);
                }
            });
        }

        return normalizedString;
    }

    private checkLanguageChar(word: string) {
        const isPure = new Promise((resolve, reject) => {
            try {
                for(let index = 0; index < word.length; index++) {
                    const isChar = ENGLISH_CHAR.hasOwnProperty(word.charAt(index));
                    const hasNumber = parseInt(word.charAt(index));
                    if(!isChar && isNaN(hasNumber)) {
                        // console.log(index, hasNumber, typeof hasNumber);
                        resolve(false);
                    }
                    if (index === (word.length - 1)) {
                        resolve(true);
                    }
                }               
            } catch (error) {
                reject(error);
                console.log(error);
            }
        });

        return isPure;
    }
}