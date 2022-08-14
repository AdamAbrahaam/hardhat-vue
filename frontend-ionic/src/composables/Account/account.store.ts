import { Store } from 'vuex'
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { computed, ComputedRef  } from '@nuxtjs/composition-api'
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import Authereum from "authereum";
import { RootState } from '~/store/index'
import { AccountNamespace } from '~/store/account/index';
import { ActionTypes } from '~/store/account/actions';
import { GetterTypes } from '~/store/account/getters';
import { ChainType } from '~/models/Chain/ChainTypes'
import { useStore } from '~/composables/Store/useStore'

export const useAccountStore = (): AccountStore => {
  const store = useStore()

  return new AccountStore(store)
}

export class AccountStore {
  private store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store

    // This will get deprecated soon. Setting it to false removes a warning from the console.
    window.ethereum.autoRefreshOnNetworkChange = false;

   if (!this.web3Modal.value) {
      this.initWeb3Modal()
   }

    if (this.isWalletConnected.value) {
      this.connectWeb3Modal()
    }
  }

  private initWeb3Modal(): void {
    const providerOptions = {
      burnerconnect: {
        package: BurnerConnectProvider // required
      },
      authereum: {
        package: Authereum // required
      }
    };

    const w3mObject = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions // required
    });

    this.store.dispatch(AccountNamespace + ActionTypes.InitW3Modal, w3mObject)
  } 

  public connectWeb3Modal(): void {
    this.store.dispatch(AccountNamespace + ActionTypes.ConnectW3Modal)
    localStorage.setItem('walletConnected', 'true');
  }


/*   public ethereumListener(): void {
    window.ethereum.on('accountsChanged', (accounts: any) => {
      if (this.isWalletConnected.value) {
        this.store.dispatch(AccountNamespace + ActionTypes.SetAddress, accounts[0])

        this.store.dispatch(AccountNamespace + ActionTypes.SetProvider,
          { ethersProvider: new ethers.providers.Web3Provider(this.w3mProvider.value), w3mProvider: this.w3mProvider.value })
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      this.store.dispatch(AccountNamespace + ActionTypes.SetChainId, chainId)
      this.store.dispatch(AccountNamespace + ActionTypes.SetProvider,
        { ethersProvider: new ethers.providers.Web3Provider(this.w3mProvider.value), w3mProvider: this.w3mProvider.value })
    });
  } */

  async disconnectWeb3Modal(): Promise<void> {
    await this.store.dispatch(AccountNamespace + ActionTypes.DisconnectProvider)
    localStorage.setItem('walletConnected', 'false');
  }

  public get isWalletConnected(): ComputedRef<boolean> {
    return computed<boolean>(() => this.ethersProvider.value && this.w3mProvider.value)
  }

  public get address(): ComputedRef<string | null> {
    return computed<string | null>(() => this.store.getters[AccountNamespace + GetterTypes.address])
  }

  public get ethersProvider(): ComputedRef<any> {
    return computed<any>(() => this.store.getters[AccountNamespace + GetterTypes.ethersProvider])
  }

  public get w3mProvider(): ComputedRef<any> {
    return computed<any>(() => this.store.getters[AccountNamespace + GetterTypes.w3mProvider])
  }

  public get web3Modal(): ComputedRef<any> {
    return computed<any>(() => this.store.getters[AccountNamespace + GetterTypes.web3Modal])
  }

  public get chainId(): ComputedRef<string | null> {
    return computed<string | null>(() => this.store.getters[AccountNamespace + GetterTypes.chainId])
  }

  public get chainName(): ComputedRef<string | null> {
    return computed<string | null>(() => {
      if (!this.chainId.value) {
        return null
      }

      switch (this.chainId.value) {
        case "0x1":
          return ChainType.MAINNET
        case "0x2a":
          return ChainType.KOVAN
        case "0x3":
          return ChainType.ROPSTEN
        case "0x4":
          return ChainType.RINKEBY
        case "0x5":
          return ChainType.GOERLI
        case "0x539": // 1337 (often used on localhost)
        case "0x1691": // 5777 (default in Ganache)
        default:
          return ChainType.LOCALHOST
      }
    })
  }
}
