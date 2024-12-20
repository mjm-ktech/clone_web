"use server";

import { fetchUrl, UrlData } from "@/utils/fetchUrl";

export async function fetchUrlAction(formData: FormData): Promise<UrlData> {
  const url = formData.get("url") as string;

  try {
    return await fetchUrl(url);
  } catch (error) {
    console.error("Error fetching URL:", error);
    throw error;
  }
}
