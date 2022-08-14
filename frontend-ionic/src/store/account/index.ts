export const AccountNamespace = 'account/'

// State
export interface AccountState {
  address: string | null
  chainId: string | null
  ethersProvider: any // this is "provider" for Ethers.js
  w3mProvider: any // this is "provider" from Web3Modal
  web3Modal: any
}

export const state = (): AccountState => ({
  address: null,
  chainId: null,
  ethersProvider: null,
  w3mProvider: null,
  web3Modal: null
})

