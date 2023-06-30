import { ref, unref } from "vue";

const env = ref({});
const ready = new Promise((resolve) => {
  fetch("/.env")
    .then((x) => x.json())
    .then((x) => {
      env.value = x;
      resolve(true);
    });
});

export const useEnv = function () {
  const getEnv = (key: string) => String(unref(env)[key] || "");
  return { getEnv, ready };
};
