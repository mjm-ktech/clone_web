"use server";

import { handleCategory } from "@/app/actions/handleCategory";
import { CustomError } from "@/lib/exceptions";
import axios from "axios";
import { load } from "cheerio";

export async function fetchArchivedPageCateData(
  origin: string,
  endtimestamp: string,
  wpInfo: { wpUrl: string; username: string; password: string }
) {
  try {
    const archiveUrl = `https://web.archive.org/web/${endtimestamp}/${origin}`;
    console.log("Fetching URL:", archiveUrl);

    const response = await fetch(archiveUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const htmlContent = await response.text();
    const $ = load(htmlContent);

    const taxonomyDescription = $(".taxonomy-description").text().trim();

    if (!taxonomyDescription) {
      throw new CustomError(
        "Taxonomy description in class '.taxonomy-description' not found",
        "Taxonomy description in class '.taxonomy-description' not found"
      );
    }

    const loginUrl =
      "https://crawl-demo.k-tech-services.com/wp-json/jwt-auth/v1/token";
    const categoryEndPoint =
      "https://crawl-demo.k-tech-services.com/wp-json/wp/v2/categories";

    // Đăng nhập để lấy token
    const loginResponse = await axios
      .post(loginUrl, {
        username: wpInfo.username,
        password: wpInfo.password,
      })
      .catch(() => {
        throw new Error(`Login failed`);
      });

    const token = loginResponse.data.token;
    console.log("Token nhận được:", token);

    const slug: string = origin.split("/").filter(Boolean).pop() ?? "";
    const formattedText = slug.replace(/-/g, " ");

    await handleCategory(
      formattedText,
      taxonomyDescription,
      token,
      categoryEndPoint
    );
  } catch (error) {
    console.error("Error fetching archived page data:", error);
    throw error;
  }
}
