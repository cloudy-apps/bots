import { ref, unref } from "vue";

const env = ref({});

export const getEnv = (key: string) => String(unref(env)[key] || "");

export const setEnv = (value) => {
  env.value = value;
};
