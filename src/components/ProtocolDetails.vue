<script setup lang="ts">
import type { TournamentEntry } from '@/types/tournament'
import { useSessionStorage } from '@vueuse/core'
import { applyTimings } from '@/modules/tournament'
import { onProtocolSave } from '@/utils/events'

const url = new URL(window.location.href)

const tournament = useSessionStorage<TournamentEntry>(
  `tour_${url.searchParams.get('cid[]')}`,
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
  },
)

const { a, b } = JSON.parse(JSON.stringify(tournament.value.stats))

onProtocolSave(() => {
  tournament.value.isDataFilled = true
})
</script>

<template>
  <div class="details">
    <div class="gap-2 grid grid-cols-4">
      <div :key="stat" v-for="stat of [...a, ...b]" class="text-green-900 p-2 rounded-md bg-green-200">
        <p>
          <b>{{ stat.player }}</b>
        </p>
        <p>Тип: {{ stat.type }}</p>
        <p>Время: {{ stat.time }}</p>
      </div>
    </div>
    <div class="flex flex-col">
      <button class="lh-btn lh-btn__blue w-full" @click="() => applyTimings(tournament.stats)">
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
