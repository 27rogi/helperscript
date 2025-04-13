<script setup lang="ts">
import { useSessionStorage } from "@vueuse/core";
import { TournamentEntry } from "./utils/funcs";

const props = defineProps(["cid"]);
// const url = new URL(window.location.href);

const tournament = useSessionStorage<TournamentEntry>(
  `tour_${props.cid}`,
  {
    isGoalsFilled: false,
    isDataFilled: false,
    stats: {
      a: [],
      b: [],
    },
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div
    class="flex flex-row font-base font-extrabold m-auto text-xs gap-0.5 justify-center"
  >
    <p
      class="rounded-md bg-green-600 text-white py-0.5 px-1 inline-flex m-0"
      v-if="tournament.isGoalsFilled"
    >
      Г
    </p>
    <p
      class="rounded-md bg-blue-400 text-white py-0.5 px-1 inline-flex m-0"
      v-if="tournament.isDataFilled"
    >
      Д
    </p>
  </div>
</template>

<style>
tr[class] > td:nth-child(10) {
  @apply flex flex-row gap-0.5 justify-center;
}
</style>
