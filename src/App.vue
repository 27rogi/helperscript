<script setup lang="ts">
import ProtocolEditor from "#/ProtocolEditor.vue";
import ProtocolDetails from "#/ProtocolDetails.vue";
import { hasParams } from "@/utils/url";
import { useLocalStorage } from "@vueuse/core";

const url = new URL(window.location.href);
const showMenu = useLocalStorage("script-menu-hidden", false);
</script>

<template>
  <div class="app -my-2">
    <div class="flex flex-col text-xs mb-2 px-2">
      <button class="lh-btn" @click="showMenu = !showMenu">{{ showMenu ? "Закрыть" : "Открыть" }} скрипт</button>
    </div>
    <div v-if="showMenu" class="flex flex-col font-bold text-base pb-2 px-4 gap-2">
      <div class="flex flex-row gap-2 items-center">
        <h1 class="text-sm">
          Турнир #<span class="text-blue-600 font-bold">{{ url.searchParams.get("cid[]") }}</span> (Протокол #
          <span class="text-blue-600 font-bold">{{
            url.searchParams.get("tournament_id")
}}</span>)
        </h1>
        <div class="flex flex-row flex-wrap ml-auto">
          <p v-if="url.searchParams.has('mode')" class="infoblock">
            Режим: {{ url.searchParams.get("mode") }}
          </p>
          <p v-if="url.searchParams.has('action')" class="infoblock">
            Действие: {{ url.searchParams.get("action") }}
          </p>
        </div>
      </div>
      <ProtocolEditor v-if="hasParams(url, 'protocols', 'edit')" />
      <ProtocolDetails v-if="hasParams(url, 'protocols', 'full')" />
    </div>
  </div>
</template>

<style>
.app {
  @apply font-base font-semibold text-sm;
}

.lh-btn {
  @apply border border-solid rounded-md font-bold bg-zinc-200 border-zinc-400/50 p-1 text-zinc-900 hover:bg-opacity-70 hover:border-opacity-100;
}
.lh-btn__green {
  @apply bg-emerald-200 border-green-600/50;
}
.lh-btn__red {
  @apply bg-red-200 border-red-600/50;
}
.lh-btn__yellow {
  @apply bg-amber-200 border-amber-600/50;
}
.lh-btn__teal {
  @apply bg-teal-300 border-teal-700/50;
}
.infoblock {
  @apply border-y border-l border-solid rounded-md font-bold bg-zinc-200 m-0 text-zinc-900 text-xs py-1 px-2;
}

.infoblock:first-child {
  @apply rounded-r-none;
}

.infoblock:last-child {
  @apply border-r rounded-l-none;
}
</style>
