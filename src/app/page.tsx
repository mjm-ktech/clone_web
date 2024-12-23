"use client";

import { useState } from "react";
import { fetchWebArchiveAction } from "./actions/fetchWebArchieveAction";
import {
  WebArchiveData,
  GroupedWebArchiveData,
} from "@/utils/fetchWebArchieveData";
import { WebArchiveTable } from "@/components/WebArchiveTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useWpStore } from "@/store/wp";
import { groupDataByYear } from "@/utils/groupDataByYear";

export default function Home() {
  const [webArchiveData, setWebArchiveData] = useState<{
    rawData: WebArchiveData;
    groupedData: GroupedWebArchiveData;
  } | null>(null);
  const [url, setUrl] = useState("https://kulimamalawi.org/");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditWpUrl, setIsEditWpUrl] = useState(false);

  const updateWpInfo = useWpStore((state) => state.updateWpInfo);

  const wpdata = useWpStore((state) => state);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      const data = await fetchWebArchiveAction(formData);
      console.log(data);
      setWebArchiveData({
        rawData: data,
        groupedData: groupDataByYear(data),
      });
    } catch (err) {
      console.error("Error fetching Web Archive data:", err);
      setError(
        "Failed to fetch Web Archive data. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWpUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let wpUrl = formData.get("wpUrl") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!wpUrl || !username || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin trang wordpress");
      return;
    }

    // Kiểm tra cấu trúc URL
    const wpUrlPattern = /^https?:\/\/[^/]+\/?$/;
    if (!wpUrlPattern.test(wpUrl)) {
      toast.error(
        "URL không hợp lệ. Vui lòng nhập URL có dạng https://your-url.com"
      );
      return;
    }
    wpUrl = wpUrl.replace(/\/$/, "");

    updateWpInfo(wpUrl, username, password);

    setIsEditWpUrl(false);
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">Web Archive Data Fetcher</h1>
      <label htmlFor="url">URL trang web cần fetch:</label>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <Input
          type="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., https://sonatural.vn/)"
          required
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Fetching..." : "Fetch"}
        </Button>
      </form>
      <label htmlFor="url">Config URL trang wordpress:</label>
      <form onSubmit={handleSaveWpUrl} className="mb-4 flex flex-col gap-2">
        <Input
          type="wpUrl"
          name="wpUrl"
          defaultValue={wpdata.wpUrl}
          // onChange={(e) => setWpUrl(e.target.value)}
          placeholder="Enter wordpress URL (e.g., https://crawl-wordpress-url.com/wp-json)"
          required
          className="flex-grow"
          disabled={!isEditWpUrl}
        />
        <Input
          type="username"
          name="username"
          defaultValue={wpdata.username}
          // value={wpUrl}
          // onChange={(e) => setWpUrl(e.target.value)}
          placeholder="Enter wordpress username"
          required
          className="flex-grow"
          disabled={!isEditWpUrl}
        />
        <Input
          type="password"
          name="password"
          defaultValue={wpdata.password}
          // value={wpUrl}
          // onChange={(e) => setWpUrl(e.target.value)}
          placeholder="Enter wordpress password"
          required
          className="flex-grow"
          disabled={!isEditWpUrl}
        />
        <div
          onClick={() => setIsEditWpUrl(true)}
          className={`${
            isEditWpUrl && "hidden"
          } h-[2.5rem] px-[10px] bg-black text-white cursor-pointer rounded-sm leading-[2.5rem] text-center`}
        >
          Edit
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className={`${!isEditWpUrl && "hidden"}`}
        >
          Save
        </Button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {webArchiveData && (
        <WebArchiveTable
          rawData={webArchiveData.rawData}
          groupedData={webArchiveData.groupedData}
        />
      )}
    </main>
  );
}
