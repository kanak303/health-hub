import { Request, Response } from 'express';

export const mockPayment = async (req: Request, res: Response) => {
  try {
    const { amount, userId, bookingId, paymentMethod } = req.body;

    // Validate required fields
    if (!amount || !userId || !bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, userId, bookingId, paymentMethod'
      });
    }

    //  processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful payment response
    const transactionId = `mock_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      transactionId,
      amount,
      userId,
      bookingId,
      paymentMethod,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

export const mockRefund = async (req: Request, res: Response) => {
  try {
    const { transactionId, amount, reason } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: transactionId, amount'
      });
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const refundId = `mock_ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refundId,
      transactionId,
      amount,
      reason: reason || 'Refund requested',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
};