import { Tokenizer } from './core/tokenizer';
import { TextEncorder } from './core/encorder';

export const berkelium = {
    tokenize: (sentence: string) => {
        const bkTokenizer = new Tokenizer();

        return bkTokenizer.initialize(sentence);
    },
    encode: (tokens: Array<string>) => {
        const encodings = new TextEncorder();

        return encodings.encode(tokens);
    }
}