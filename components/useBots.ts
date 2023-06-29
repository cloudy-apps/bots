import { ref, unref } from "vue";

export const useBots = function () {
  const { env } = useEnv();
  const bots = ref([]);

  const create = (name: string, header: string) => {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({ name, header });

    fetch(unref(env).APP_BOT_API, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers,
      body,
    });
  };

  const remove = (name) => {
    return fetch(new URL(name, env.APP_BOT_API + "/"), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });
  };

  const fetchAll = () => {
    return fetch(unref(env).APP_BOT_API, {
      mode: "cors",
      credentials: "include",
    })
      .then((x) => x.json())
      .then((x) => (bots.value = x));
  };

  return { create, remove, fetchAll, bots };
};

export const useEnv = function () {
  const env = ref({});
  fetch("/.env")
    .then((x) => x.json)
    .then((x) => (env.value = x));

  return { env };
};
