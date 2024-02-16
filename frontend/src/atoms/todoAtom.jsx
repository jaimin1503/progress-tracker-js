import { atom } from "recoil";

export const isOpenState = atom({
  key: "showComponent",
  default: null,
});

export const goalsState = atom({
  key: "goalsState",
  default: [{}],
});
