<script setup lang="ts">
import { useSessionStorage } from "@vueuse/core";
import {
  onProtocolSave,
  getTeams,
  getPlayerNames,
  applyStats,
  // getPlayers,
  setCheckboxes,
  Stat,
  // getPlayerData,
  // getPlayer,
  TournamentEntry,
} from "../utils/funcs";

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

const newStat = (team: "a" | "b") => {
  tournament.value.stats[team].push({
    player: players![team][0],
    type: "goal",
    time: 0,
  });
};

const removeStat = (team: "a" | "b", stat: Stat) => {
  tournament.value.stats[team] = tournament.value.stats[team].filter(
    (item) => item !== stat
  );
};

const applySize = (size: 4 | 5 | 6) => {
  tournament.value.size = size;
  setCheckboxes(size);
};

const teams = getTeams();
const players = getPlayerNames();

onProtocolSave(() => {
  tournament.value.isGoalsFilled = true;
});

const teamSize = useSessionStorage(`teamsize_tour_${url.searchParams.get("cid[]")}`, 0);
if (teamSize.value !== 0) {
  applySize(<4 | 5 | 6>Number(teamSize.value));
}

["a", "b"].forEach((key, index) => {
  const team = teams![index];
  if (tournament.value.stats[<"a" | "b">key].length !== 0) return;
  const score = Number(team.querySelector(".demo-title")?.innerHTML.split(":")[1]);
  for (let i = 0; i < score; i++) {
    newStat(<"a" | "b">key);
  }
});
</script>

<template>
  <div class="grid gap-2 grid-cols-3 items-center">
    <template v-for="val in [4, 5, 6]">
      <button
        :class="{ 'lh-btn__active': tournament.size === val }"
        class="lh-btn"
        @click="() => applySize(<4|5|6>val)"
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
      v-for="(key, index) in ['a', 'b']"
      class="rounded-md flex flex-col bg-gray-200 p-2 w-1/2 gap-1 items-center"
    >
      <p>Команда {{ teams![index].querySelector(".demo-title")?.innerHTML }}</p>
      <button
        class="w-full lh-btn lh-btn__green"
        @click="() => newStat(index === 0 ? 'a' : 'b')"
      >
        +
      </button>
      <div
        v-if="tournament.stats[index === 0 ? 'a' : 'b'].length > 0"
        class="text-center w-full grid gap-2 grid-cols-4 justify-center items-center"
      >
        <p :class="{ 'order-4': index === 0 }">Игрок</p>
        <p :class="{ 'order-3': index === 0 }">Минута</p>
        <p :class="{ 'order-2': index === 0 }">Событие</p>
        <p :class="{ 'order-1': index === 0 }"></p>
      </div>
      <div
        v-for="(stat, i) in tournament.stats[index === 0 ? 'a' : 'b']"
        class="rounded-md divide-gray-900 bg-gray-200 grid p-1 gap-2 grid-cols-4 items-center even:bg-white"
      >
        <select
          :tabindex="Number(`${index + 1}00`) + 1 + i + 1 + 2"
          :class="{ 'order-4': index === 0 }"
          class="focus:outline-2 focus:outline-green-500"
          id="pselect"
          v-model="stat.player"
          title="player"
        >
          <option v-for="player in players![index === 0 ? 'a' : 'b']" :value="player">
            {{
              player
                .split(" ")
                [player.split(" ").length - 1].replace(/\D+/g, "")
                .replace(/\b0+\B/g, "")
            }}
          </option>
        </select>
        <input
          :tabindex="Number(`${index + 1}00`) + 1 + i + 1 + (index === 0 ? 1 : 3)"
          class="focus:outline-2 focus:outline-green-500"
          type="number"
          pattern="^[0-9]*$"
          min="0"
          placeholder="0"
          v-model="stat.time"
          :class="{ 'order-3': index === 0 }"
          id="minput"
          @focus="(<HTMLInputElement>$event.target!).select()"
        />
        <select
          :class="{ 'order-2': index === 0 }"
          id="tselect"
          v-model="stat.type"
          title="type"
        >
          <option value="goal">Гол</option>
          <option value="assist">Пас</option>
          <option value="pgoal">Гол (Пенальти)</option>
          <option value="autogoal">АГ</option>
          <option value="nogoal">НП</option>
          <option value="keeperskip">ПВ</option>
          <option value="yellow">ЖК</option>
          <option value="2yellow">2ЖК</option>
          <option value="red">КК</option>
        </select>
        <button
          :class="{ 'order-1': index === 0 }"
          id="remove"
          class="w-full lh-btn lh-btn__red"
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
