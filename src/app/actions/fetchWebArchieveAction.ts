"use server";

import { load } from "cheerio";

import {
  fetchWebArchiveData,
  WebArchiveData,
} from "@/utils/fetchWebArchieveData";
import { createWordpress } from "@/app/actions/wpapi";
import { CustomError } from "@/lib/exceptions";

export const fetchWebArchiveAction = async (
  formData: FormData
): Promise<WebArchiveData> => {
  const url = formData.get("url") as string;

  try {
    return await fetchWebArchiveData(url);
  } catch (error) {
    console.error("Error fetching Web Archive data:", error);
    throw new CustomError(
      `Error fetching Web Archive data: ${error}`,
      "Failed to fetch Web Archive data. Please try again later."
    );
  }
};

export const fetchArchivedPageData = async (
  origin: string,
  endtimestamp: string,
  isCreatePost: boolean,
  wpInfo: { wpUrl: string; username: string; password: string }
): Promise<string> => {
  try {
    // Construct the archive URL dynamically
    const archiveUrl = `https://web.archive.org/web/${endtimestamp}/${origin}`;
    console.log("Fetching URL:", archiveUrl);

    // Fetch data from the archive URL
    const response = await fetch(archiveUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new CustomError(
        `HTTP error! Status: ${response.status}`,
        "Failed to fetch archived page. Please try again later."
      );
    }

    // Extract and parse the HTML content
    const htmlContent = await response.text();
    const $ = load(htmlContent);

    // Select the content inside the element with ID "wrapper"
    const wrapperContent = isCreatePost
      ? $(".entry-content").html()
      : $(".page-inner").html();

    if (!wrapperContent) {
      throw new CustomError(
        `No content found with ID '${
          isCreatePost ? "entry-content" : "page-inner"
        }'.`,
        "Failed to extract content from the archived page."
      );
    }

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
      wpInfo,
      categories
    );

    return wrapperContent;
  } catch (error) {
    console.error("Error in fetchArchivedPageData:", error);
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(
        `Unexpected error: ${error}`,
        "An unexpected error occurred. Please try again later."
      );
    }
  }
};
