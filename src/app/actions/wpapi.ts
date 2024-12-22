import axios from "axios";

// Tạo bài viết mới
export async function createWordpress(
  title: string,
  htmlContent: string,
  isCreatePost: boolean
) {
  const loginUrl =
    "https://crawl-demo.k-tech-services.com/wp-json/jwt-auth/v1/token";
  const pageEndPoint =
    "https://crawl-demo.k-tech-services.com/wp-json/wp/v2/pages";
  const postEndPoint =
    "https://crawl-demo.k-tech-services.com/wp-json/wp/v2/posts";

  const endpoint = isCreatePost ? postEndPoint : pageEndPoint;

  const loginResponse = await axios.post(loginUrl, {
    username: "admin",
    password: "@ktech@1903",
  });

  const token = loginResponse.data.token;
  console.log("Token nhận được:", token);

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
  }
}
