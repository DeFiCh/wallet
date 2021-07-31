import { StorageAPI } from '../storage'

export enum WalletType {
  MNEMONIC_UNPROTECTED = 'MNEMONIC_UNPROTECTED'
}

export interface WalletPersistenceData<T> {
  type: WalletType
  /* To migrate between app version upgrade */
  version: 'v1'
  /* Raw Data encoded in WalletType specified format */
  raw: T
}

async function get (): Promise<Array<WalletPersistenceData<any>>> {
  const count: string = await StorageAPI.getItem('WALLET.count') ?? '0'

  const list: Array<WalletPersistenceData<any>> = []
  for (let i = 0; i < parseInt(count); i++) {
    const data = await StorageAPI.getItem(`WALLET.${i}`)
    if (data === null) {
      throw new Error(`WALLET.count=${count} but ${i} doesn't exist`)
    }

    list[i] = JSON.parse(data)
  }
  return list
}

/**
 * @param wallets to set, override previous set wallet
 */
async function set (wallets: Array<WalletPersistenceData<any>>): Promise<void> {
  await clear()

  for (let i = 0; i < wallets.length; i++) {
    await StorageAPI.setItem(`WALLET.${i}`, JSON.stringify(wallets[i]))
  }
  await StorageAPI.setItem('WALLET.count', `${wallets.length}`)
}

/**
 * Clear all persisted wallet
 */
async function clear (): Promise<void> {
  const count: string = await StorageAPI.getItem('WALLET.count') ?? '0'

  for (let i = 0; i < parseInt(count); i++) {
    await StorageAPI.removeItem(`WALLET.${i}`)
  }
}

/**
 * Multi Wallet Persistence Layer
 */
export const WalletPersistence = {
  set,
  get
}
