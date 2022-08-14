import { Store } from 'vuex'
import { RootState } from '~/store/index'
import { useStore } from '~/composables/Store/useStore'

export const useAccountStore = (): AccountStore => {
  const store = useStore()

  return new AccountStore(store)
}

export class AccountStore {
  private store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
  }
}
