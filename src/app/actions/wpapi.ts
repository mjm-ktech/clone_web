import WPAPI from "wpapi";

// Tạo bài viết mới
export async function createPost(title: string, htmlContent: string) {
  const wp = new WPAPI({
    endpoint: "https://crawl-demo.k-tech-services.com/wp-json",
    username: "admin",
    password: "@ktech@1903",
  });

  try {
    const profile = await wp.users().me();
    console.log("Credentials are valid:", profile);

    const post = await wp.posts().create({
      title,
      content: htmlContent,
      status: "publish", // 'draft' nếu chưa muốn công khai
    });

    console.log("Bài viết được tạo thành công:", post);
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
  }
}
