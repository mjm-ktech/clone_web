import { create } from "zustand";

type WpStore = {
  wpUrl: string;
  username: string;
  password: string;
  updateWpInfo: (wpUrl: string, username: string, password: string) => void;
};

export const useWpStore = create<WpStore>((set) => ({
  wpUrl: "https://crawl-demo.k-tech-services.com",
  username: "admin",
  password: "@ktech@1903",
  updateWpInfo: (wpUrl: string, username: string, password: string) =>
    set(() => ({
      wpUrl: wpUrl,
      username: username,
      password: password,
    })),
}));
