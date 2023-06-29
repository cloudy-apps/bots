import { ref } from "vue";

export const useEnv = function () {
  const env = ref({});
  fetch("/.env")
    .then((x) => x.json)
    .then((x) => (env.value = x));

  return { env };
};
