import { ref } from "vue";
import { getEnv } from "./useEnv";

export const useBots = function () {
  const bots = ref([]);

  const create = async (name: string, header: string, model: string = '') => {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ name, header, model });

    await fetch(getEnv("BOT_API"), {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers,
      body,
    });

    await fetchAll();
  };

  const remove = async (name) => {
    await fetch(new URL(name, getEnv("BOT_API") + "/"), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });

    await fetchAll();
  };

  const fetchAll = async () => {
    const response = await fetch(getEnv("BOT_API"), {
      mode: "cors",
      credentials: "include",
    });

    if (response.status === 401) {
      location.href = getEnv("AUTH_API");
      return;
    }

    bots.value = await response.json();
  };

  return { create, remove, fetchAll, bots };
};
