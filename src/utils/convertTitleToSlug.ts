function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD") // Chuẩn hóa chuỗi Unicode
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Chuyển ký tự "đ" thành "d"
    .replace(/Đ/g, "D") // Chuyển ký tự "Đ" thành "D"
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Loại bỏ ký tự không hợp lệ
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang lặp lại
    .toLowerCase() // Chuyển tất cả sang chữ thường
    .trim(); // Loại bỏ khoảng trắng thừa
}

export function convertTitleToSlug(title: string): string {
  return removeVietnameseTones(title);
}
