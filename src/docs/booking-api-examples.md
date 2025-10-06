# Booking API Testing Examples

## Base URL
```
http://localhost:3000/api/booking
```

## 1. Create Booking with Payment

**POST** `/api/booking`

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "doctorId": "456e7890-e89b-12d3-a456-426614174001",
  "slotId": "789e0123-e89b-12d3-a456-426614174002",
  "bookingDate": "2024-01-27T09:00:00.000Z",
  "notes": "Follow-up appointment for chest pain evaluation",
  "amount": 150.00,
  "paymentMethod": "credit_card"
}
```

## 2. Get All Bookings

**GET** `/api/booking`

Returns all bookings in the system.

## 3. Get Booking by ID

**GET** `/api/booking/{id}`

Example: `/api/booking/123e4567-e89b-12d3-a456-426614174000`

## 4. Confirm Booking

**PATCH** `/api/booking/{id}/confirm`

Confirms a pending booking (no request body required).

## 5. Update Booking

**PATCH** `/api/booking/{id}`

```json
{
  "bookingDate": "2024-01-27T10:00:00.000Z",
  "notes": "Updated appointment notes - patient requested time change",
  "status": "confirmed"
}
```

## 6. Cancel Booking

**PATCH** `/api/booking/{id}/cancel`

Cancels booking and processes refund if applicable (no request body required).

## Response Examples

### Create Booking Success Response
```json
{
  "booking": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "456e7890-e89b-12d3-a456-426614174001",
    "doctorId": "789e0123-e89b-12d3-a456-426614174002",
    "slotId": "abc1234d-e89b-12d3-a456-426614174003",
    "status": "confirmed",
    "bookingDate": "2024-01-27T09:00:00.000Z",
    "notes": "Follow-up appointment for chest pain evaluation",
    "paymentStatus": "paid",
    "transactionId": "txn_1234567890",
    "amount": 150.00,
    "createdAt": "2024-01-27T08:00:00.000Z",
    "updatedAt": "2024-01-27T08:00:00.000Z"
  },
  "payment": {
    "success": true,
    "transactionId": "txn_1234567890",
    "message": "Payment processed successfully"
  }
}
```

### Get All Bookings Response
```json
{
  "bookings": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "456e7890-e89b-12d3-a456-426614174001",
      "doctorId": "789e0123-e89b-12d3-a456-426614174002",
      "slotId": "abc1234d-e89b-12d3-a456-426614174003",
      "status": "confirmed",
      "bookingDate": "2024-01-27T09:00:00.000Z",
      "notes": "Follow-up appointment",
      "paymentStatus": "paid",
      "transactionId": "txn_1234567890",
      "amount": 150.00,
      "createdAt": "2024-01-27T08:00:00.000Z",
      "updatedAt": "2024-01-27T08:00:00.000Z"
    }
  ]
}
```

### Cancel Booking with Refund Response
```json
{
  "message": "Booking cancelled and refund processed successfully",
  "booking": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "cancelled",
    "paymentStatus": "refunded",
    "updatedAt": "2024-01-27T10:00:00.000Z"
  },
  "refund": {
    "success": true,
    "refundId": "ref_0987654321",
    "message": "Refund processed successfully"
  }
}
```

### Slot Hold Conflict Response
```json
{
  "error": "This slot is temporarily held by another user.",
  "message": "Please try again in 5 minute(s).",
  "availableAt": "2024-01-27T09:05:00.000Z"
}
```

## Testing with cURL

### Create Booking
```bash
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "doctorId": "456e7890-e89b-12d3-a456-426614174001",
    "slotId": "789e0123-e89b-12d3-a456-426614174002",
    "bookingDate": "2024-01-27T09:00:00.000Z",
    "notes": "Follow-up appointment",
    "amount": 150.00,
    "paymentMethod": "credit_card"
  }'
```

### Get All Bookings
```bash
curl -X GET http://localhost:3000/api/booking
```

### Get Booking by ID
```bash
curl -X GET http://localhost:3000/api/booking/123e4567-e89b-12d3-a456-426614174000
```

### Confirm Booking
```bash
curl -X PATCH http://localhost:3000/api/booking/123e4567-e89b-12d3-a456-426614174000/confirm
```

### Update Booking
```bash
curl -X PATCH http://localhost:3000/api/booking/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated appointment notes",
    "status": "confirmed"
  }'
```

### Cancel Booking
```bash
curl -X PATCH http://localhost:3000/api/booking/123e4567-e89b-12d3-a456-426614174000/cancel
```

## Booking Status Values
- `pending` - Booking created but not yet confirmed
- `confirmed` - Booking confirmed and active
- `cancelled` - Booking cancelled
- `completed` - Appointment completed

## Payment Status Values
- `pending` - Payment not yet processed
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

## Common Error Scenarios
- **400**: Slot already booked, payment failed, booking already cancelled/completed
- **404**: Booking not found
- **409**: Slot temporarily held by another user
- **500**: Server error, payment processing error

## Business Rules
1. **Slot Availability**: Cannot book already booked slots
2. **Slot Holds**: Temporary holds prevent double booking
3. **Payment Integration**: Booking creation includes payment processing
4. **Refund Processing**: Cancellations trigger automatic refunds
5. **Status Validation**: Cannot cancel completed bookings