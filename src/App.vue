<script setup lang="ts">
import ProtocolEditor from "./components/ProtocolEditor.vue";
import ProtocolDetails from "./components/ProtocolDetails.vue";
import { hasParams } from "./utils/funcs";
import { useLocalStorage } from "@vueuse/core";

const url = new URL(window.location.href);

const hidden = useLocalStorage("script-menu-hidden", false);
</script>

<template>
  <div class="app -my-2">
    <div v-if="hidden" class="flex flex-col font-bold text-base py-2 px-4 gap-2">
      <button class="lh-btn" @click="hidden = false">Открыть скрипт</button>
    </div>
    <div v-else class="flex flex-col font-bold text-base py-2 px-4 gap-2">
      <button class="lh-btn" @click="hidden = true">Закрыть скрипт</button>
      <div class="flex flex-row gap-2 items-center">
        <h1 class="text-sm">
          Турнир #<span class="text-blue-600 font-bold">{{ url.searchParams.get("cid[]") }}</span> (Протокол #
          <span class="text-blue-600 font-bold">{{
            url.searchParams.get("tournament_id")
          }}</span>)
        </h1>
        <div class="flex flex-row flex-wrap ml-auto gap-2">
          <p
            v-if="url.searchParams.has('mode')"
            class="font-bold bg-blue-600 m-0 text-white text-sm py-1 px-2"
          >
            Режим: {{ url.searchParams.get("mode") }}
          </p>
          <p
            v-if="url.searchParams.has('action')"
            class="font-bold bg-blue-600 m-0 text-white text-sm py-1 px-2"
          >
            Действие: {{ url.searchParams.get("action") }}
          </p>
        </div>
      </div>
      <ProtocolEditor v-if="hasParams(url, 'protocols', 'edit')" />
      <ProtocolDetails v-if="hasParams(url, 'protocols', 'full')" />
    </div>
  </div>
</template>

<style lang="scss">
.app {
  @apply font-base font-semibold text-sm;
}
.lh-btn {
  @apply border border-solid rounded-md font-bold bg-zinc-200 border-zinc-400/50 p-1 text-zinc-900 hover:bg-opacity-70 hover:border-opacity-100;
  &__green {
    @apply bg-green-300 border-green-600/50 text-green-900;
  }
  &__red {
    @apply bg-red-200 border-red-400/50 text-red-900;
  }
  &__blue {
    @apply bg-blue-700 border-blue-900/50 text-blue-50;
  }
  &__teal {
    @apply bg-teal-700 border-teal-900/50 text-white;
  }
  &__active {
    @apply border-[2px] border-green-600;
  }
}
</style>
