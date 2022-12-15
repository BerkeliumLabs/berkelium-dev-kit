import { Tokenizer } from './core/tokenizer';

export const berkelium = {
    tokenize: (sentence: string) => {
        const bkTokenizer = new Tokenizer();

        return bkTokenizer.initialize(sentence);
    }
}