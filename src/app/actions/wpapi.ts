import { convertTitleToSlug } from "@/utils/convertTitleToSlug";
import axios from "axios";

// Tạo bài viết mới
export async function createWordpress(
  title: string,
  htmlContent: string,
  isCreatePost: boolean,
  wpInfo: { wpUrl: string; username: string; password: string },
  categories?: string[]
) {
  const { wpUrl, username: wpUsername, password: wpPassword } = wpInfo;

  if (!wpUrl) {
    throw new Error("Vui lòng nhập URL trên trang web");
  }

  // Kiểm tra cấu trúc URL
  const wpUrlPattern = /^https?:\/\/[^/]+\/?$/;
  if (!wpUrlPattern.test(wpUrl)) {
    throw new Error(
      "URL không hợp lệ. Vui lòng nhập URL có dạng https://your-url.com"
    );
  }

  const loginUrl = `${wpUrl}/wp-json/jwt-auth/v1/token`;
  const pageEndPoint = `${wpUrl}/wp-json/wp/v2/pages`;
  const postEndPoint = `${wpUrl}/wp-json/wp/v2/posts`;
  const categoryEndPoint = `${wpUrl}/wp-json/wp/v2/categories`;

  const endpoint = isCreatePost ? postEndPoint : pageEndPoint;

  const loginResponse = await axios
    .post(loginUrl, {
      username: wpUsername,
      password: wpPassword,
    })
    .catch(() => {
      throw new Error(`Login failed`);
    });

  const token = loginResponse.data.token;
  console.log("Token nhận được:", token);

  const categoryIds: number[] = [];
  if (categories) {
    for (const categoryName of categories) {
      try {
        // Kiểm tra xem category đã tồn tại chưa
        const existingCategory = await axios.get(categoryEndPoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: categoryName,
          },
        });

        if (existingCategory.data.length > 0) {
          // Danh mục đã tồn tại, thêm ID vào danh sách
          categoryIds.push(existingCategory.data[0].id);
        } else {
          // Danh mục chưa tồn tại, tạo mới
          const newCategory = await axios.post(
            categoryEndPoint,
            { name: categoryName },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          categoryIds.push(newCategory.data.id);
        }
      } catch (error) {
        console.error(`Lỗi xử lý danh mục "${categoryName}":`, error);
        throw new Error(`Lỗi xử lý danh mục "${categoryName}"`);
      }
    }
  }

  console.log("Category IDs:", categoryIds);

  try {
    await axios.post(
      endpoint,
      {
        title: {
          rendered: title,
          raw: title,
        },
        content: htmlContent,
        status: "publish", // 'draft' nếu chưa muốn công khai
        categories: categoryIds,
        slug: convertTitleToSlug(title),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Bài viết được tạo thành công:");
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
    throw new Error("Lỗi khi tạo bài viết");
  }
}
