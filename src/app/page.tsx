"use client";

import { useState } from "react";
import { fetchWebArchiveAction } from "./actions/fetchWebArchieveAction";
import {
  WebArchiveData,
  GroupedWebArchiveData,
  groupDataByYear,
} from "@/utils/fetchWebArchieveData";
import { WebArchiveTable } from "@/components/WebArchiveTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [webArchiveData, setWebArchiveData] = useState<{
    rawData: WebArchiveData;
    groupedData: GroupedWebArchiveData;
  } | null>(null);
  const [url, setUrl] = useState("https://kulimamalawi.org/");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        groupedData: await groupDataByYear(data),
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

  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">Web Archive Data Fetcher</h1>
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
