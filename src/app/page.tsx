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
import { FaExternalLinkAlt } from "react-icons/fa";
// import Link from "next/link";
import { hasSubdomain } from "@/utils/hasSubdomain";

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

      const url = formData.get("url") as string;

      if (hasSubdomain(url)) {
        toast.error(
          "Vui lòng nhập URL không có subdomain (chỉ bao gồm tên miền chính, ví dụ: example.com)."
        );
        return;
      }

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
      {/* <div className="flex items-center justify-between"> */}
      <h1 className="text-3xl font-bold mb-4">Web Archive Data Fetcher</h1>
      {/* <Link
          href={"/guide"}
          className="text-blue-500 font-bold"
          target="_blank"
        >
          Hướng dẫn sử dụng
        </Link> */}
      {/* </div> */}
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
      <div className="flex items-center gap-[20px]">
        <label htmlFor="url">Config URL trang wordpress:</label>
        <p className="text-red-500 text-[20px] flex items-center gap-[5px]">
          Vui lòng cài đặt extension{" "}
          <b>
            <a
              href="https://vi.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/"
              target="_blank"
              className="flex items-center gap-[5px] hover:underline"
            >
              JWT Authentication for WP REST API <FaExternalLinkAlt size={14} />
            </a>
          </b>
          trước khi sử dụng.
        </p>
      </div>

      <form onSubmit={handleSaveWpUrl} className="mb-4 flex flex-col gap-2">
        <Input
          type="wpUrl"
          name="wpUrl"
          defaultValue={wpdata.wpUrl}
          // onChange={(e) => setWpUrl(e.target.value)}
          placeholder="Enter wordpress URL (e.g., https://crawl-wordpress-url.com)"
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
