import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const authState = atom({
  key: "authState",
  default: {
    id: null,
    isLoggedIn: false,
    token: null,
  },
  effects_UNSTABLE: [persistAtom],
});
