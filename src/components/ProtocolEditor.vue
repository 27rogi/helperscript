<script setup lang="ts">
import type { Stat, StatType } from '@/types/stat'
import type { TournamentEntry } from '@/types/tournament'
import { useSessionStorage } from '@vueuse/core'
import { getPlayerNames } from '@/modules/player'
import { getTeams } from '@/modules/team'
import { applyStats, setCheckboxes } from '@/modules/tournament'
import { onProtocolSave } from '@/utils/events'

const teams = getTeams()
const players = getPlayerNames()

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

function newStat(team: 'a' | 'b', type: StatType = 'goal') {
  tournament.value.stats[team].push({
    player: players![team][0],
    type,
    time: 0,
  })
}

function removeStat(team: 'a' | 'b', stat: Stat) {
  tournament.value.stats[team] = tournament.value.stats[team].filter(
    item => item !== stat,
  )
}

function applySize(size: 4 | 5 | 6) {
  tournament.value.size = size
  setCheckboxes(size)
}

onProtocolSave(() => {
  tournament.value.isGoalsFilled = true
})

const teamSize = useSessionStorage(`teamsize_tour_${url.searchParams.get('cid[]')}`, 0)
if (teamSize.value !== 0) {
  applySize(Number(teamSize.value) as 4 | 5 | 6)
}

['a', 'b'].forEach((val, index) => {
  const key = val as 'a' | 'b'
  const team = teams![index]
  if (tournament.value.stats[key].length !== 0)
    return
  const score = Number(team.querySelector('.demo-title')?.innerHTML.split(':')[1])
  for (let i = 0; i < score; i++) {
    newStat(key)
  }
})
</script>

<template>
  <div class="gap-2 grid grid-cols-3 items-center">
    <template :key="val" v-for="val in [4, 5, 6]">
      <button
        :class="{ 'lh-btn__active': tournament.size === val }"
        class="lh-btn"
        @click="() => applySize(val)"
      >
        {{ val }}x{{ val }}
      </button>
    </template>
    <!-- <button :class="{'lh-btn__active': stats.size === 4}" class="lh-btn" @click="() => setCheckboxes(4)">4x4</button>
    <button :class="{'lh-btn__active': stats.size === 5}" class="lh-btn" @click="() => setCheckboxes(5)">5x5</button>
    <button :class="{'lh-btn__active': stats.size === 6}" class="lh-btn" @click="() => setCheckboxes(6)">6x6</button> -->
  </div>
  <div class="flex flex-row gap-2 items-start">
    <div
    :key="key"
      v-for="(key, index) in ['a', 'b']"
      class="p-2 rounded-md bg-gray-200 flex flex-col gap-1 w-1/2 items-center"
    >
      <p>Команда {{ teams![index].querySelector(".demo-title")?.innerHTML }}</p>
      <div class="gap-2 grid grid-cols-4 w-full">
        <button
          class="lh-btn lh-btn__green col-span-4 w-full"
          @click="() => newStat(index === 0 ? 'a' : 'b')"
        >
          +
        </button>
        <button
          class="lh-btn lh-btn__yellow col-span-1 w-full"
          @click="() => newStat(index === 0 ? 'a' : 'b', 'yellow')"
        >
          ЖК
        </button>
        <button
          class="lh-btn lh-btn__yellow col-span-1 w-full"
          @click="() => newStat(index === 0 ? 'a' : 'b', '2yellow')"
        >
          2ЖК
        </button>
        <button class="lh-btn lh-btn__red col-span-2 w-full" @click="() => newStat(index === 0 ? 'a' : 'b', 'red')">
          КК
        </button>
      </div>
      <div
        v-if="tournament.stats[index === 0 ? 'a' : 'b'].length > 0"
        class="text-center gap-2 grid grid-cols-4 w-full items-center justify-center"
      >
        <p :class="{ 'order-4': index === 0 }">
          Игрок
        </p>
        <p :class="{ 'order-3': index === 0 }">
          Минута
        </p>
        <p :class="{ 'order-2': index === 0 }">
          Событие
        </p>
        <p :class="{ 'order-1': index === 0 }" />
      </div>
      <div
      :key="stat + String(i)"
        v-for="(stat, i) in tournament.stats[index === 0 ? 'a' : 'b']"
        class="p-1 rounded-md bg-gray-200 gap-2 grid grid-cols-4 items-center divide-gray-900 even:bg-white"
      >
        <select
          id="pselect"
          v-model="stat.player"
          :tabindex="Number(`${index + 1}00`) + 1 + i + 1 + 2"
          :class="{ 'order-4': index === 0 }"
          class="focus:outline-2 focus:outline-green-500"
          title="player"
        >
          <option :key="player" v-for="player in players![index === 0 ? 'a' : 'b']" :value="player">
            {{
              player
                .split(" ")
                [player.split(" ").length - 1].replace(/\D+/g, "")
                .replace(/\b0+\B/g, "")
            }}
          </option>
        </select>
        <input
          id="minput"
          v-model="stat.time"
          :tabindex="Number(`${index + 1}00`) + 1 + i + 1 + (index === 0 ? 1 : 3)"
          class="focus:outline-2 focus:outline-green-500"
          type="number"
          pattern="^[0-9]*$"
          min="0"
          placeholder="0"
          :class="{ 'order-3': index === 0 }"
          @focus="($event.target! as HTMLInputElement).select()"
        >
        <select
          id="tselect"
          v-model="stat.type"
          :class="{ 'order-2': index === 0 }"
          title="type"
        >
          <option value="goal">
            Гол
          </option>
          <option value="assist">
            Пас
          </option>
          <option value="pgoal">
            Гол (Пенальти)
          </option>
          <option value="autogoal">
            АГ
          </option>
          <option value="nogoal">
            НП
          </option>
          <option value="keeperskip">
            ПВ
          </option>
          <option value="yellow">
            ЖК
          </option>
          <option value="2yellow">
            2ЖК
          </option>
          <option value="red">
            КК
          </option>
        </select>
        <button
          id="remove"
          :class="{ 'order-1': index === 0 }"
          class="lh-btn lh-btn__red w-full"
          @click="() => removeStat(index === 0 ? 'a' : 'b', stat)"
        >
          x
        </button>
      </div>
    </div>
  </div>
  <button class="lh-btn lh-btn__teal" @click="() => applyStats(tournament)">
    Заполнить голы и карточки
  </button>
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
