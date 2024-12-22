"use server";

import { load } from "cheerio";

import {
  fetchWebArchiveData,
  WebArchiveData,
} from "@/utils/fetchWebArchieveData";
import { createWordpress } from "@/app/actions/wpapi";

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
  endtimestamp: string,
  isCreatePost: boolean,
  wpUrl: string
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

    // Extract and parse the HTML content
    const htmlContent = await response.text();
    const $ = load(htmlContent);

    // Select the content inside the element with ID "wrapper"
    const wrapperContent = $("#wrapper").html();

    if (!wrapperContent) {
      throw new Error("No content found with ID 'wrapper'.");
    }

    // console.log("Extracted content:", wrapperContent);

    // Extract category information from the class "entry-category"
    const categoryElements = $(".entry-category");
    const categories: string[] = [];

    categoryElements.each((_, element) => {
      const category = $(element).text().trim();
      if (category) {
        categories.push(category);
      }
    });

    const slug: string = origin.split("/").filter(Boolean).pop() ?? "";

    // Replace hyphens (-) with spaces
    const formattedText = slug.replace(/-/g, " ");
    // Optionally post to WordPress
    await createWordpress(
      formattedText,
      wrapperContent,
      isCreatePost,
      wpUrl,
      categories
    );

    return wrapperContent;
  } catch (error) {
    console.error("Error fetching archived page data:", error);
    throw error;
  }
}
