import { ref, unref } from "vue";
import { useEnv } from "./useEnv";

export const useBots = function () {
  const { env } = useEnv();
  const bots = ref([]);

  const create = async (name: string, header: string) => {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ name, header });

    await fetch(unref(env).BOT_API, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers,
      body,
    });

    await fetchAll();
  };

  const remove = async (name) => {
    await fetch(new URL(name, unref(env).BOT_API + "/"), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });
    await fetchAll();
  };

  const fetchAll = () => {
    return fetch(unref(env).BOT_API, {
      mode: "cors",
      credentials: "include",
    })
      .then((x) => x.json())
      .then((x) => (bots.value = x));
  };

  return { create, remove, fetchAll, bots };
};
