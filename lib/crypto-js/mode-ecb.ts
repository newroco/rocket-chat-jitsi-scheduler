// @ts-nocheck

/**
 * Electronic Codebook block mode.
 */
import {
  BlockCipherMode,
} from './cipher-core';

export class ECB extends BlockCipherMode {
}
ECB.Encryptor = class extends ECB {
  processBlock(words, offset) {
    this._cipher.encryptBlock(words, offset);
  }
};
ECB.Decryptor = class extends ECB {
  processBlock(words, offset) {
    this._cipher.decryptBlock(words, offset);
  }
};
