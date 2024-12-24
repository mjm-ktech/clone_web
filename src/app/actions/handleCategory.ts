import { CustomError } from "@/lib/exceptions";
import axios from "axios";

// Hàm xử lý danh mục: kiểm tra và tạo danh mục nếu chưa tồn tại
export async function handleCategory(
  categoryName: string,
  taxonomyDescription: string,
  token: string,
  categoryEndPoint: string
): Promise<number> {
  try {
    // Kiểm tra xem danh mục đã tồn tại chưa
    const existingCategory = await axios.get(categoryEndPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: categoryName,
      },
    });

    if (existingCategory.data.length > 0) {
      // Danh mục đã tồn tại, trả về ID
      return existingCategory.data[0].id;
    } else {
      // Tạo mới danh mục với mô tả
      const newCategory = await axios.post(
        categoryEndPoint,
        {
          name: categoryName,
          description: taxonomyDescription, // Mô tả danh mục
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return newCategory.data.id;
    }
  } catch (error) {
    console.error(`Lỗi xử lý danh mục "${categoryName}":`, error);
    throw new CustomError(
      `Lỗi xử lý danh mục "${categoryName}"`,
      `Lỗi xử lý danh mục "${categoryName}"`
    );
  }
}
