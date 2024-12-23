import { create } from "zustand";

type WpStore = {
  wpUrl: string;
  username: string;
  password: string;
  updateWpInfo: (wpUrl: string, username: string, password: string) => void;
};

export const useWpStore = create<WpStore>((set) => ({
  wpUrl: "",
  username: "",
  password: "",
  updateWpInfo: (wpUrl: string, username: string, password: string) =>
    set(() => ({
      wpUrl: wpUrl,
      username: username,
      password: password,
    })),
}));
