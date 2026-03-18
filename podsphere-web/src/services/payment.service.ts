import { api } from "../lib/api";

export const paymentService = {
  // Hàm này gọi đến PaymentsController.cs -> [HttpPost("create-checkout")]
  createCheckout: async () => {
    const { data } = await api.post<{ url: string }>("/payments/create-checkout");
    return data.url; // Trả về cái link của Stripe
  },
  
  // Lấy lịch sử nạp tiền nếu muốn hiện trong Profile
  getHistory: async () => {
    const { data } = await api.get("/payments/history");
    return data;
  }
};