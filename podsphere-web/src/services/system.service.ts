import { api } from "../lib/api";
import { PaymentDto, NotificationDto, SubscriptionDto } from "../types/system";

export const systemService = {
  // --- Notifications ---
  // Lấy danh sách thông báo của người dùng
  getMyNotifications: async () => {
    const { data } = await api.get<NotificationDto[]>("/notifications");
    return data;
  },

  // Đánh dấu thông báo đã xem
  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },

  // --- Payments ---
  // Lấy lịch sử giao dịch (MoMo, VNPay...)
  getPaymentHistory: async () => {
    const { data } = await api.get<PaymentDto[]>("/payments/history");
    return data;
  },

  // --- Subscriptions ---
  // Kiểm tra tình trạng gói Premium hiện tại
  getSubscriptionStatus: async () => {
    const { data } = await api.get<SubscriptionDto>("/subscriptions/status");
    return data;
  }
};
