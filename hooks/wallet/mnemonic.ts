import AsyncStorage from "@react-native-async-storage/async-storage";
import { Network } from "@defichain/jellyfish-network";
import { MnemonicHdNodeProvider } from "@defichain/jellyfish-wallet-mnemonic";
import { mnemonicToSeed } from "@defichain/jellyfish-wallet-mnemonic/dist/mnemonic";

const STORAGE_KEY = 'MNEMONIC_WALLET_HD_NODE_SEED'

export class MnemonicHdNodeStorage {

  constructor (private readonly network: Network) {
  }

  async hasSeed (): Promise<boolean> {
    const seed = await AsyncStorage.getItem(STORAGE_KEY)
    return seed !== null
  }

  async getHdNodeProvider (): Promise<MnemonicHdNodeProvider> {
    const seed = await MnemonicHdNodeStorage.getSeed()
    if (seed === undefined) {
      throw new Error('attempting to getHdNodeProvider() without having any seed stored')
    }
    return MnemonicHdNodeProvider.fromSeed(seed, {
      bip32: {
        public: this.network.bip32.publicPrefix,
        private: this.network.bip32.privatePrefix,
      },
      wif: this.network.wifPrefix
    })
  }

  async setMnemonic (mnemonic: string[]) {
    const seed = mnemonicToSeed(mnemonic)
    await MnemonicHdNodeStorage.setSeed(seed)
  }

  private static async getSeed (): Promise<Buffer | undefined> {
    const seed: string | null = await AsyncStorage.getItem(STORAGE_KEY)
    if (seed === null) {
      return undefined
    }
    return Buffer.from(seed, 'hex')
  }

  private static async setSeed (seed: Buffer): Promise<void> {
    const hex = seed.toString('hex')
    await AsyncStorage.setItem(STORAGE_KEY, hex)
  }
}
