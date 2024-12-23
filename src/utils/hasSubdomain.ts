export function hasSubdomain(url: string) {
  // Tạo một đối tượng URL để phân tích
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname; // Lấy phần hostname

  // Chia hostname thành các phần bởi dấu chấm
  const parts = hostname.split(".");

  // Nếu hostname có nhiều hơn 2 phần, thì có subdomain (ví dụ: sub.example.com)
  return parts.length > 2;
}
