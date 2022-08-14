import { GetterTree } from 'vuex'
import { RootState } from '@/store/index'
import { AccountState } from '@/store/account/index'

// Getters
export enum GetterTypes {
  chainId = 'CHAIN_ID',
  ethersProvider = 'PROVIDER_ETHERS',
  w3mProvider = 'PROVIDER_W3M',
  web3Modal = 'WEB3_MODAL',
  address = 'ADDRESS'
}

export type Getters = {
  [GetterTypes.chainId](state: AccountState): string | null
  [GetterTypes.ethersProvider](state: AccountState): any
  [GetterTypes.w3mProvider](state: AccountState): any
  [GetterTypes.web3Modal](state: AccountState): any
  [GetterTypes.address](state: AccountState): string | null
}

export const getters: GetterTree<AccountState, RootState> & Getters = {
  [GetterTypes.chainId]: state => state.chainId,
  [GetterTypes.ethersProvider]: state => state.ethersProvider,
  [GetterTypes.w3mProvider]: state => state.w3mProvider,
  [GetterTypes.web3Modal]: state => state.web3Modal,
  [GetterTypes.address]: state => state.address
}

export default getters
