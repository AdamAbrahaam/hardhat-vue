import { useContext } from '@nuxtjs/composition-api'
import { Store } from 'vuex'
import { RootState } from '~/store/index'

export const useStore = (): Store<RootState> => {
  const { store } = useContext()

  return store
}
