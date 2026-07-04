<script setup lang="ts">
import type { TournamentEntry } from '@/types/tournament'
import { useSessionStorage } from '@vueuse/core'

const props = defineProps(['cid'])
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
  },
)
</script>

<template>
  <div
    class="text-xs font-base font-extrabold m-auto flex flex-row gap-0.5 justify-center"
  >
    <p
      v-if="tournament.isGoalsFilled"
      class="text-white m-0 px-1 py-0.5 rounded-md bg-green-600 inline-flex"
    >
      Г
    </p>
    <p
      v-if="tournament.isDataFilled"
      class="text-white m-0 px-1 py-0.5 rounded-md bg-blue-400 inline-flex"
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
