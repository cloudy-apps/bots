<template>
  <div class="container mx-auto px-4">
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
        class="flex border border-gray-300 round bg-white shadow p-3 rounded-md h-30"
        v-for="bot in list"
        :key="bot.name"
      >
        <h2 class="text-md font-bold">{{ bot.name }}</h2>
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
            @keypress.enter.prevent="addBot()"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, unref } from "vue";

const useEnv = function () {
  const env = ref({});
  fetch("/.env")
    .then((x) => x.json)
    .then((x) => (env.value = x));

  return { env };
};

const useBots = function () {
  const env = useEnv();
  const bots = ref([]);

  const create = (name, header) => {
    const headers = { "content-type": "application/json" };
    const body = { name, header };

    fetch(env.APP_BOT_API, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers,
      body,
    });
  };

  const fetchAll = () => {
    fetch(env.APP_BOT_API, {
      mode: "cors",
      credentials: "include",
    })
      .then((x) => x.json())
      .then((x) => (bots.value = x));
  };

  return { create, fetchAll, bots };
};

const { bots, create, fetchAll } = useBots();
const search = ref("");
const newBot = ref("");

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
  if (!name) return;

  await create(name, name);
  await fetchAll();

  newBot.value = "";
}

onMounted(fetchAll);
</script>
