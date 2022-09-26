import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('SID')
export class SiDScalar implements CustomScalar<string, number> {
  description = 'ID custom scalar type';

  private salt = process.env.SID_SALT;

  private prefix = process.env.SID_PREFIX;

  parseValue(value: string): number {
    // parse a `base64` encoded id from the client when provided as a variable
    const string = this.decrypt(this.salt, value);

    const number = parseInt(
      Buffer.from(string, 'base64').toString('utf8').replace(this.prefix, ''),
    );
    return !isNaN(number) ? number : 0;
  }

  serialize(value: number): string {
    // serialize a number into the base64 representation
    const plain = Buffer.from(`${this.prefix}${value}`, 'utf8').toString(
      'base64',
    );
    return this.crypt(this.salt, plain);
  }

  parseLiteral(ast: ValueNode): number | null {
    // parse a `base64` encoded id from the client when hardcoded into the query
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }

  crypt(salt, text) {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  }

  decrypt(salt, encoded) {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
  }
}
