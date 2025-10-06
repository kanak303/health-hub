# Booking APIs - HealthHub

This document provides comprehensive information about the Booking-related APIs in the HealthHub system for managing appointment bookings with integrated payment processing.

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access Swagger Documentation:**
   Open your browser and navigate to: `http://localhost:3000/api-docs`

3. **Base API URL:**
   ```
   http://localhost:3000/api/booking
   ```

## 📋 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/booking` | Create booking with payment processing |
| GET | `/api/booking` | Get all bookings |
| GET | `/api/booking/{id}` | Get specific booking by ID |
| PATCH | `/api/booking/{id}/confirm` | Confirm a pending booking |
| PATCH | `/api/booking/{id}` | Update booking details |
| PATCH | `/api/booking/{id}/cancel` | Cancel booking with refund |

## 🔧 Features

### ✅ Comprehensive Swagger Documentation
- **Interactive API Testing**: Test all endpoints directly from Swagger UI
- **Request/Response Examples**: Clear examples for all API calls
- **Schema Validation**: Detailed request and response schemas
- **Error Handling**: Comprehensive error response documentation

### ✅ Advanced Booking Management
- **Integrated Payment Processing**: Automatic payment handling during booking
- **Slot Hold Prevention**: Prevents double booking with temporary holds
- **Refund Processing**: Automatic refunds on cancellation
- **Status Tracking**: Complete booking lifecycle management

### ✅ Business Logic
- **Conflict Resolution**: Handles slot availability conflicts
- **Payment Validation**: Ensures payment before confirmation
- **Authorization**: Secure booking operations
- **Audit Trail**: Complete booking history tracking

## 🏥 Booking Schema

```typescript
{
  id: string (UUID)
  userId: string (UUID) - Reference to User/Patient
  doctorId: string (UUID) - Reference to Doctor
  slotId: string (UUID) - Reference to Slot
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  bookingDate: DateTime
  notes?: string (optional)
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  transactionId?: string (optional)
  amount: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🔍 API Usage Examples

### Create Booking with Payment
```bash
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "patient-uuid-here",
    "doctorId": "doctor-uuid-here",
    "slotId": "slot-uuid-here",
    "bookingDate": "2024-01-27T09:00:00.000Z",
    "notes": "Follow-up consultation",
    "amount": 150.00,
    "paymentMethod": "credit_card"
  }'
```

### Get All Bookings
```bash
curl -X GET http://localhost:3000/api/booking
```

### Cancel Booking with Refund
```bash
curl -X PATCH http://localhost:3000/api/booking/booking-uuid-here/cancel
```

## 🛡️ Validation & Security

### Required Fields (Create Booking)
- `userId` - Must be valid UUID
- `doctorId` - Must be valid UUID
- `slotId` - Must be valid UUID
- `bookingDate` - Must be valid DateTime
- `amount` - Must be positive number
- `paymentMethod` - Payment method identifier

### Business Rules
- **Slot Availability**: Cannot book already booked slots
- **Slot Holds**: Temporary holds prevent concurrent booking attempts
- **Payment Required**: Booking requires successful payment processing
- **Refund Policy**: Automatic refunds for cancelled bookings
- **Status Validation**: Cannot cancel completed appointments

## 📊 Response Format

### Success Response (Create)
```json
{
  "booking": {
    "id": "uuid",
    "status": "confirmed",
    "paymentStatus": "paid",
    "transactionId": "txn_123"
  },
  "payment": {
    "success": true,
    "transactionId": "txn_123",
    "message": "Payment processed successfully"
  }
}
```

### List Response
```json
{
  "bookings": [
    {
      "id": "uuid",
      "status": "confirmed",
      "amount": 150.00
    }
  ]
}
```

### Error Response
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## 🔒 Status Management

### Booking Status Flow
```
pending → confirmed → completed
    ↓         ↓
cancelled ← cancelled
```

### Payment Status Flow
```
pending → paid → refunded
    ↓
  failed
```

## 🧪 Testing

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Expand the "Bookings" section
3. Click "Try it out" on any endpoint
4. Fill in the required parameters
5. Click "Execute" to test

### Using Postman
Import the API collection using the OpenAPI specification available at:
`http://localhost:3000/api-docs/swagger.json`

## 🚨 Common Error Scenarios

| Status Code | Scenario | Solution |
|-------------|----------|----------|
| 400 | Slot already booked | Choose different slot |
| 400 | Payment failed | Check payment details |
| 400 | Booking already cancelled | Cannot perform action |
| 404 | Booking not found | Verify booking ID |
| 409 | Slot temporarily held | Wait and retry |
| 500 | Payment processing error | Check payment service |

## 💳 Payment Integration

### Payment Processing
- **Automatic Processing**: Payment processed during booking creation
- **Transaction Tracking**: All payments tracked with transaction IDs
- **Refund Handling**: Automatic refunds on cancellation
- **Payment Methods**: Support for multiple payment methods

### Payment Status Tracking
- **Real-time Updates**: Payment status updated in real-time
- **Failure Handling**: Graceful handling of payment failures
- **Refund Processing**: Automated refund workflows

## 🔄 Workflow Examples

### Complete Booking Process
1. **Create Booking**: POST `/api/booking` with payment details
2. **Payment Processing**: Automatic payment validation and processing
3. **Confirmation**: Booking status updated to 'confirmed' on successful payment
4. **Notification**: System can trigger notifications (implementation dependent)

### Cancellation Process
1. **Cancel Request**: PATCH `/api/booking/{id}/cancel`
2. **Refund Processing**: Automatic refund if payment was made
3. **Status Update**: Booking marked as 'cancelled'
4. **Slot Release**: Slot becomes available again

## 📈 Performance Considerations

- **Slot Hold Mechanism**: Prevents race conditions during booking
- **Payment Processing**: Asynchronous payment handling where possible
- **Database Transactions**: Ensures data consistency
- **Error Recovery**: Graceful handling of payment failures

## 🔄 Future Enhancements

- [ ] Booking modification (reschedule appointments)
- [ ] Bulk booking operations
- [ ] Recurring appointment booking
- [ ] Payment plan support
- [ ] Integration with calendar systems
- [ ] Automated reminder notifications
- [ ] Booking analytics and reporting

## 📞 Support

For API support and questions:
- Check the Swagger documentation at `/api-docs`
- Review the test examples in `src/docs/booking-api-examples.md`
- Examine the booking model in `src/modules/bookings/bookingModel.ts`
- Check payment service integration in `src/utils/paymentService.ts`