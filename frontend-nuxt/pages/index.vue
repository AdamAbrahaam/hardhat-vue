<template>
  <div>
    <p>
      {{lotteryState}}
    </p>

    Difficulty: <input v-model.number="difficulty" type="number"><br>
    Min Fee in ETH: <input v-model="minimumFee" type="number">
    <button @click="createLottery">Create</button><br><br>

    Number: <input v-model="bet" type="number">
    Name: <input v-model="name" type="text">
    <button @click="enterLottery">Enter</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import Onboard from 'bnc-onboard'
import { ethers, utils } from "ethers";
import { LotteryState } from '~/models/Lottery/LotteryState.ts'

import addresses from "~/contracts/addresses.json";
import LOTTERY from "~/contracts/Lottery.json";

export default defineComponent({
  name: 'Homepage',
  setup () {
    const contract = ref<any>({});
    const difficulty = ref<number>(100)
    const minimumFee = ref<string>('0')
    const bet = ref<number>(0)
    const name = ref<string>('')

    const lotteryState = ref<LotteryState>(LotteryState.INACTIVE)

    const onboard = Onboard({
      dappId: 'a12f71ee-5fff-43d9-ac13-7c1bd2a6ca3b',
      networkId: 1337,
      subscriptions: {
        wallet:async wallet => {
          const provider = new ethers.providers.Web3Provider(wallet.provider);

          const signer = provider.getSigner();

          const contractAddress = (addresses.Lottery as any)[wallet.provider.networkVersion];
          contract.value = new ethers.Contract(contractAddress, LOTTERY.abi, signer);

          lotteryState.value = LotteryState[await contract.value.state()]

          contract.value.on('LotteryStateChanged', lotteryStateChanged)
        }
      }
    });

    onMounted(async () => {
      await onboard.walletSelect();
      await onboard.walletCheck();
    })

    const createLottery = () => {
      contract.value.create(utils.parseEther(minimumFee.value), difficulty.value)
    }

    const lotteryStateChanged = (_error, result) => {
      console.log(result);
      lotteryState.value = LotteryState[result]
    }

    const enterLottery = () => {
      contract.value.enter(name.value, bet.value, { value: utils.parseEther(minimumFee.value) })
    }

    return {
      lotteryState,
      minimumFee,
      difficulty,
      createLottery,
      enterLottery,
      bet,
      name
    }
  } 
})
</script>

<style scoped>

</style>
