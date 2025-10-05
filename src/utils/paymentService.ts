// Mock Payment Service
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  userId: string;
  bookingId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  amount?: number;
}

export const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock payment logic - 90% success rate
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: "Payment processed successfully",
      amount: paymentData.amount
    };
  } else {
    return {
      success: false,
      message: "Payment failed. Please try again."
    };
  }
};

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

export const processRefund = async (refundData: RefundRequest): Promise<PaymentResponse> => {
  // Simulate refund processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock refund logic - 95% success rate
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: "Refund processed successfully",
      amount: refundData.amount
    };
  } else {
    return {
      success: false,
      message: "Refund failed. Please contact support."
    };
  }
};