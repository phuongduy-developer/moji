import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // phải có dòng này cookies mới gửi đc lên server
});

// gắn access token vào req header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  // Hàm .getState() là cách Zustand cho phép bạn truy cập trực tiếp vào giá trị hiện tại của Store bằng Javascript thuần,
  // không phụ thuộc vào React.
  // Nó sẽ "vào thẳng" kho lưu trữ, lấy ra đúng giá trị accessToken ngay tại thời điểm API được gọi để gắn vào Header,
  // hoàn toàn hợp lệ và không vi phạm quy tắc nào của React.

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// tự động gọi refresh api khi access token hết hạn
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     // những api không cần check
//     if (
//       originalRequest.url.includes("/auth/signin") ||
//       originalRequest.url.includes("/auth/signup") ||
//       originalRequest.url.includes("/auth/refresh")
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retryCount = originalRequest._retryCount || 0;

//     if (error.response?.status === 403 && originalRequest._retryCount < 4) {
//       originalRequest._retryCount += 1;

//       try {
//         const res = await api.post("/auth/refresh", { withCredentials: true });
//         const newAccessToken = res.data.accessToken;

//         useAuthStore.getState().setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         useAuthStore.getState().clearState();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default api;
