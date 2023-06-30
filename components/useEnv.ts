import { ref, unref } from "vue";

export const useEnv = function () {
  const env = ref({});
  const ready = new Promise((resolve) => {
    fetch("/.env")
      .then((x) => x.json())
      .then((x) => {
        env.value = x;
        resolve(true);
      });
  });

  const getEnv = (key: string) => String(unref(env)[key] || "");

  return { getEnv, ready };
};
