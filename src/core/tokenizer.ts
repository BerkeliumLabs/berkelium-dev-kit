export class Tokenizer {

    // private language: string = 'en';

    constructor() {
        // this.language = 'en';
    }

    async initialize(sentence: string) {
        const rawString = await this.whiteSpaceToken(sentence);

        return rawString;
    }

    private whiteSpaceToken(sentence: string) {
        return sentence.split(' ');
    }

    private removePunctuations(tokens: Array<string>) {
        
    }
}