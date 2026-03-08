// PaymentDto.cs
export interface PaymentDto {
    id: string;
    amount: number;
    provider: string;
    status: string;
    transactionId: string;
    createdAt: string;
}

// NotificationDto.cs
export interface NotificationDto {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
}

// SubscriptionDto.cs
export interface SubscriptionDto {
    id: string;
    planType: string;
    startDate: string;
    endDate: string;
    status: string;
    userId: string;
    userUsername: string | null;
}