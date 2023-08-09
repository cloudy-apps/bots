<template>
  <div class="py-4">
    <div v-if="loading" class="absolute top-0 right-0 m-2">
      <span class="material-icons text-green-500 animate-spin">sync</span>
    </div>
    <div class="container mx-auto px-4">
      <div class="flex mb-4 rounded shadow">
        <input
          v-model="search"
          type="text"
          placeholder="Filter..."
          class="px-3 py-2 border rounded w-full flex-grow"
        />
        <button
          class="p-2 bg-gray-300 rounded-sm leading-4"
          @click="fetchAll()"
        >
          <span class="material-icons">refresh</span>
        </button>
      </div>
      <div
        v-if="!loading"
        class="grid justify-items-stretch gap-4 grid-cols-1 md:grid-cols-2 mb-4"
      >
        <div
          class="relative border border-gray-300 round bg-white shadow p-3 rounded-md overflow-y-auto h-30"
          v-for="bot in list"
          :key="bot.name"
        >
          <div class="absolute top-0 right-0 m-2">
            <button class="text-red-500" @click="removeBot(bot.name)">
              <span class="material-icons">delete</span>
            </button>
            <button class="text-blue-500" @click="editBot(bot)">
              <span class="material-icons">edit</span>
            </button>
          </div>
          <h2 class="text-md font-bold flex-grow">
            {{ bot.name }}
            <span class="inline-block p-1 ml-2 bg-gray-200">{{
              (bot.model || "").replace("gpt-", "")
            }}</span>
          </h2>
          <p>{{ bot.header }}</p>
        </div>
      </div>

      <div class="text-center" v-if="!editing">
        <button
          class="py-2 px-4 bg-blue-500 text-white rounded"
          @click="showForm()"
        >
          Add
        </button>
      </div>
      <form
        v-if="!loading && editing"
        class="flex flex-col border border-gray-300 round bg-white shadow p-3 rounded-md"
        @submit.prevent="saveBot()"
      >
        <label class="block mb-4">
          <span class="block uppercase text-xs font-medium text-gray-700">
            Name *:
          </span>
          <input
            type="text"
            v-model="newBot"
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </label>
        <label class="block mb-4">
          <span class="block uppercase text-xs font-medium text-gray-700">
            System instruction *:
          </span>
          <textarea
            type="text"
            v-model="newBotHeader"
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm h-40"
          ></textarea>
        </label>
        <label class="block mb-4">
          <span class="block uppercase text-xs font-medium text-gray-700">
            Model:
          </span>
          <input
            type="text"
            v-model="newBotModel"
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </label>
        <div class="text-right">
          <button
            class="py-2 px-4 bg-blue-500 text-white rounded"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, unref } from "vue";
import { useBots } from "./useBots";

const { bots, create, remove, fetchAll } = useBots();

const search = ref("");
const newBot = ref("");
const newBotHeader = ref("");
const newBotModel = ref("");
const loading = ref(true);
const editing = ref(false);

onMounted(async () => {
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

function showForm() {
  editing.value = true;
}

async function saveBot() {
  const name = newBot.value;
  const header = newBotHeader.value;
  const model = newBotModel.value;

  if (!name) {
    return;
  }

  loading.value = true;
  await create(name, header, model);
  loading.value = false;

  newBot.value = "";
  newBotHeader.value = "";
  newBotModel.value = "";
  editing.value = false;
}

async function removeBot(name) {
  if (confirm("Sure?")) {
    loading.value = true;
    await remove(name);
    loading.value = false;
  }
}

function editBot(bot) {
  editing.value = true;
  newBot.value = bot.name;
  newBotHeader.value = bot.header;
  newBotModel.value = bot.model;
}
</script>
