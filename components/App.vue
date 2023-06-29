<template>
  <div class="container mx-auto px-4 relative">
    <div
      v-if="loading"
      class="absolute t-0 r-0 bg-gray-200 py-1 px-2 border border-gray-400 rounded-lg"
    >
      <span class="material-icons text-sm text-green-500 animate-spin"
        >sync</span
      >
    </div>
    <div class="flex mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Filter..."
        class="px-3 py-2 border rounded w-full flex-grow"
      />
      <button class="p-2 bg-gray-300 rounded-sm leading-4" @click="fetchAll()">
        <span class="material-icons">refresh</span>
      </button>
    </div>
    <div class="grid justify-items-stretch gap-4 grid-cols-2 md:grid-cols-3">
      <div
        class="relative border border-gray-300 round bg-white shadow p-3 rounded-md"
        v-for="bot in list"
        :key="bot.name"
      >
        <button
          class="absolute t-0 r-0 m-2 text-red-300"
          @click="removeBot(bot.name)"
        >
          <span class="material-icons">delete</span>
        </button>
        <h2 class="text-md font-bold flex-grow">{{ bot.name }}</h2>
        <p>{{ bot.header }}</p>
      </div>
    </div>
    <div
      class="flex border border-gray-300 round bg-white shadow p-3 rounded-md h-30"
    >
      <label>
        <span class="block uppercase text-xs font-medium text-gray-700">
          Name:
        </span>
        <input
          type="text"
          v-model="newBot"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </label>
      <label>
        <span class="block uppercase text-xs font-medium text-gray-700">
          System instruction:
        </span>
        <textarea
          type="text"
          v-model="newBotHeader"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm h-30"
        ></textarea>
      </label>
      <div class="text-right">
        <button @click="addBot()"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, unref } from "vue";
import { useBots } from "./useBots";
import { useEnv } from "./useEnv";

const { bots, create, remove, fetchAll } = useBots();
const { ready } = useEnv();

const search = ref("");
const newBot = ref("");
const newBotHeader = ref("");
const loading = ref(true);

ready.then(async () => {
  await fetchAll();
  loading.value = false;
});

const list = computed(() => {
  const filter = unref(search);

  if (!filter) {
    return bots.value;
  }

  return bots.value.filter(
    (bot) => bot.name.includes(filter) || bot.header.includes(filter)
  );
});

async function addBot() {
  const name = newBot.value;
  const header = newBotHeader.value;

  if (!name) {
    return;
  }

  await create(name, header);
  await fetchAll();

  newBot.value = "";
}

async function removeBot(name) {
  if (confirm("Sure?")) {
    remove(name);
  }
}
</script>
