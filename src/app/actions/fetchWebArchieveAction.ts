"use server";

import {
  fetchWebArchiveData,
  WebArchiveData,
} from "@/utils/fetchWebArchieveData";

export async function fetchWebArchiveAction(
  formData: FormData
): Promise<WebArchiveData> {
  const url = formData.get("url") as string;

  try {
    return await fetchWebArchiveData(url);
  } catch (error) {
    console.error("Error fetching Web Archive data:", error);
    throw error;
  }
}

export async function fetchArchivedPageData(
  origin: string,
  endtimestamp: string
): Promise<string> {
  try {
    // Construct the archive URL dynamically
    const archiveUrl = `https://web.archive.org/web/${endtimestamp}/${origin}`;

    console.log("Fetching URL:", archiveUrl);

    // Fetch data from the archive URL
    const response = await fetch(archiveUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Extract and return the HTML content of the archived page
    const htmlContent = await response.text();
    console.log(htmlContent)
    return htmlContent;
  } catch (error) {
    console.error("Error fetching archived page data:", error);
    throw error;
  }
}
