<script setup lang="ts">
import { useSessionStorage } from "@vueuse/core";
import { onProtocolSave, TournamentEntry, applyTimings } from "../utils/funcs";
// import { logger } from "../utils/logger";

const url = new URL(window.location.href);

const tournament = useSessionStorage<TournamentEntry>(
  `tour_${url.searchParams.get("cid[]")}`,
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

const { a, b } = JSON.parse(JSON.stringify(tournament.value.stats));

onProtocolSave(() => {
  tournament.value.isDataFilled = true;
});
</script>

<template>
  <div class="details">
    <div class="grid gap-2 grid-cols-4">
      <div class="rounded-md bg-green-200 p-2 text-green-900" v-for="stat of [...a, ...b]">
        <p>
          <b>{{ stat.player }}</b>
        </p>
        <p>Тип: {{ stat.type }}</p>
        <p>Время: {{ stat.time }}</p>
      </div>
    </div>
    <div class="flex flex-col">
      <button class="w-full lh-btn lh-btn__blue" @click="() => applyTimings(tournament.stats)">
        Автозаполнение
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  @apply text-sm;
}

p {
  @apply m-0 p-0;
}


input,
select {
  @apply bg-transparent border-solid rounded-md font-bold outline-none border-gray-400 border-0 text-lg text-center leading-none p-1 text-gray-900;
}
</style>
