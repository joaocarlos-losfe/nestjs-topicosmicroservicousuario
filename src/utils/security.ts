import * as bcrypt from 'bcrypt';

export class Bcrypt{
    static async hash(value: string): Promise<string> {
        const salts = 10;
        const hashValue = await bcrypt.hash(value, salts);
        return hashValue;
    }
}