<template>
  <ion-app>
    <ion-router-outlet />
    <VueMetamask @onComplete="onComplete" />

    <ion-fab horizontal="end" vertical="top" slot="fixed">
      <ion-fab-button color="light">
        o
      </ion-fab-button>
      <ion-fab-list v-if="number" side="start" color="light">
        {{ number }}
      </ion-fab-list>
    </ion-fab>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonFab,
  IonFabButton,
  IonFabList
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import VueMetamask from "vue-metamask";
import { ethers } from "ethers";

import addresses from "./contracts/addresses.json";
import CALC from "./contracts/Calc.json";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    VueMetamask,
    IonFab,
    IonFabButton,
    IonFabList
  },

  setup() {
    const contract = ref<any>({});

    const number = ref<number>(-1);

    const onComplete = async (response: any) => {
      const provider = new ethers.providers.Web3Provider(
        response.web3.currentProvider
      );

      const signer = provider.getSigner();

      const contractAddress = (addresses["Calc"] as any)[response.netID];
      contract.value = new ethers.Contract(contractAddress, CALC.abi, signer);

      number.value = Number(await contract.value.getNum());
    };

    const setNum = () => {
      contract.value.setNum(3);
    };

    return {
      onComplete,
      setNum,
      number
    };
  }
});
</script>
