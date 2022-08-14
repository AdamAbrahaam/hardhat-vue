import { createStore } from 'vuex'
import { actions as accountActions } from './account/actions'
import { getters as accountGetters } from './account/getters'
import { state as accountState } from './account/index'
import { mutations as accountMutations } from './account/mutations'

export const state = () => ({})
export type RootState = ReturnType<typeof state>

export const store = createStore({
  modules: {
    account: {
      namespaced: true,
      state: accountState,
      mutations: accountMutations,
      getters: accountGetters,
      actions: accountActions
    }
  }
})
