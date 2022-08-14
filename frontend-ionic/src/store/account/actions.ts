import { ActionContext, ActionTree, Store } from 'vuex'
import { Mutations, MutationType } from '@/store/account/mutations'
import { RootState } from '@/store//index'
import { AccountState } from '@/store/account/index'

// Actions
export enum ActionTypes {
  DisconnectProvider = 'DISCONNECT_PROVIDER',
  InitW3Modal = 'INIT_W3M',
  ConnectW3Modal = 'CONNECT_WEB3_MODAL'
}

type ActionArguments = Omit<ActionContext<AccountState, RootState>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
}

export type Actions = {
  [ActionTypes.DisconnectProvider](this: Store<RootState>, context: ActionArguments,): void
  [ActionTypes.InitW3Modal](this: Store<RootState>, context: ActionArguments, w3mInstance: any): void
  [ActionTypes.ConnectW3Modal](this: Store<RootState>, context: ActionArguments): void
}

export const actions: ActionTree<AccountState, RootState> & Actions = {
  [ActionTypes.DisconnectProvider](this: Store<RootState>, context: ActionArguments): void {
    context.commit(MutationType.DisconnectProvider, undefined)
  },

  [ActionTypes.InitW3Modal](this: Store<RootState>, context: ActionArguments, w3mInstance: any): void {
    context.commit(MutationType.SetW3ModalInstance, w3mInstance)
  },

  [ActionTypes.ConnectW3Modal](this: Store<RootState>, context: ActionArguments): void {
    context.commit(MutationType.ConnectW3Modal, undefined)
  },
}

export default actions
