import { MutationTree } from 'vuex'
import { ethers } from 'ethers';
import { AccountState } from '@/store/account/index'

export interface Providers {
  ethersProvider: any
  w3mProvider: any
}

// Mutations
export enum MutationType {
  DisconnectProvider = 'DISCONNECT_PROVIDER',
  SetW3ModalInstance = 'SET_W3M_INSTANCE',
  ConnectW3Modal = 'CONNECT_WEB3_MODAL'
}

export type Mutations = {
  [MutationType.DisconnectProvider](state: AccountState): void
  [MutationType.SetW3ModalInstance](state: AccountState, w3mInstance: any): void
  [MutationType.ConnectW3Modal](state: AccountState): void
}

export const mutations: MutationTree<AccountState> & Mutations = {
  async [MutationType.DisconnectProvider](state: AccountState): Promise<void> {
    state.chainId = null
    state.ethersProvider = null;
    if (state.w3mProvider.close && state.w3mProvider !== null) {
      await state.w3mProvider?.close();
    }
    state.w3mProvider = null;
    await state.web3Modal?.clearCachedProvider();
  },

  [MutationType.SetW3ModalInstance](state: AccountState, w3mInstance: any): void {
    state.web3Modal = w3mInstance
  },

  async [MutationType.ConnectW3Modal](state: AccountState): Promise<void> {
    const w3m = { ...state.web3Modal }
    const w3mProvider = await w3m.connect();

    // state.address = window.ethereum.selectedAddress
    // state.chainId = window.ethereum.chainId
    // state.w3mProvider = w3mProvider
    // state.ethersProvider = new ethers.providers.Web3Provider(w3mProvider)
  },
}

export default mutations
