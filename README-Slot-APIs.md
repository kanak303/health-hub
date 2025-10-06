# Slot APIs - HealthHub

This document provides comprehensive information about the Slot-related APIs in the HealthHub system for managing doctor availability and appointment booking.

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access Swagger Documentation:**
   Open your browser and navigate to: `http://localhost:3000/api-docs`

3. **Base API URL:**
   ```
   http://localhost:3000/api/slots
   ```

## 📋 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/slots/create` | Create multiple time slots for a doctor |
| GET | `/api/slots` | Get available slots (with optional filters) |
| POST | `/api/slots/book` | Book an available slot |
| PUT | `/api/slots/update/{slotId}` | Update slot details |
| POST | `/api/slots/cancel` | Cancel a booked slot |

## 🔧 Features

### ✅ Comprehensive Swagger Documentation
- **Interactive API Testing**: Test all endpoints directly from Swagger UI
- **Request/Response Examples**: Clear examples for all API calls
- **Schema Validation**: Detailed request and response schemas
- **Error Handling**: Comprehensive error response documentation

### ✅ Advanced Slot Management
- **Bulk Slot Creation**: Generate multiple slots with configurable duration
- **Flexible Filtering**: Filter by doctor ID and date
- **Status Management**: Track slot availability (available/booked/cancelled)
- **Conflict Prevention**: Prevent overlapping slot creation

### ✅ Booking System
- **Secure Booking**: Patient-based slot booking
- **Authorization**: Only authorized patients can cancel their bookings
- **Status Tracking**: Real-time slot status updates

## 🕐 Slot Schema

```typescript
{
  id: string (UUID)
  doctorId: string (UUID) - Reference to Doctor
  date: string (YYYY-MM-DD format)
  startTime: string (HH:MM format)
  endTime: string (HH:MM format)
  status: 'available' | 'booked' | 'cancelled'
  patientId?: string (UUID, nullable)
}
```

## 🔍 API Usage Examples

### Create Time Slots
```bash
curl -X POST http://localhost:3000/api/slots/create \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "doctor-uuid-here",
    "date": "2024-01-27",
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 30
  }'
```

This creates 16 slots of 30 minutes each from 9:00 AM to 5:00 PM.

### Get Available Slots with Filters
```bash
# Get all available slots
curl "http://localhost:3000/api/slots"

# Get slots for specific doctor
curl "http://localhost:3000/api/slots?doctorId=doctor-uuid"

# Get slots for specific date
curl "http://localhost:3000/api/slots?date=2024-01-27"

# Combined filters
curl "http://localhost:3000/api/slots?doctorId=doctor-uuid&date=2024-01-27"
```

### Book a Slot
```bash
curl -X POST http://localhost:3000/api/slots/book \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot-uuid-here",
    "patientId": "patient-uuid-here"
  }'
```

## 🛡️ Validation & Security

### Required Fields (Create Slots)
- `doctorId` - Must be valid UUID
- `date` - Must be valid date (YYYY-MM-DD)
- `startTime` - Must be valid time (HH:MM)
- `endTime` - Must be valid time (HH:MM)
- `slotDuration` - Must be positive integer (minutes)

### Business Rules
- **No Overlapping Slots**: Prevents creating slots that overlap with existing ones
- **Authorization**: Only the patient who booked can cancel a slot
- **Status Validation**: Slots can only be booked if status is 'available'
- **Time Validation**: End time must be after start time

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "slot": {
    // Slot object
  }
}
```

### List Response
```json
{
  "success": true,
  "filters": {
    "doctorId": "uuid",
    "date": "2024-01-27"
  },
  "availableSlots": [
    // Array of slot objects
  ],
  "total": 16
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔒 Status Management

### Slot Status Flow
```
available → booked → cancelled
    ↑         ↓
    └─────────┘
```

- **available**: Slot is open for booking
- **booked**: Slot has been reserved by a patient
- **cancelled**: Slot was cancelled and becomes available again

## 🧪 Testing

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Expand the "Slots" section
3. Click "Try it out" on any endpoint
4. Fill in the required parameters
5. Click "Execute" to test

### Using Postman
Import the API collection using the OpenAPI specification available at:
`http://localhost:3000/api-docs/swagger.json`

## 🚨 Common Error Scenarios

| Status Code | Scenario | Solution |
|-------------|----------|----------|
| 400 | Missing required fields | Check request body format |
| 400 | Slots already exist | Use different time range or date |
| 400 | Slot already booked | Choose different slot |
| 403 | Not authorized to cancel | Verify patient ID matches booking |
| 404 | Slot not found | Verify slot ID exists |
| 500 | Server error | Check server logs |

## 📈 Performance Considerations

- **Bulk Operations**: Create multiple slots in single request
- **Efficient Filtering**: Database-level filtering for better performance
- **Indexing**: Proper database indexes on frequently queried fields
- **Conflict Resolution**: Prevents race conditions in booking

## 🔄 Workflow Examples

### Doctor Setting Up Availability
1. **Create Slots**: POST `/api/slots/create` with date range and duration
2. **Verify Creation**: GET `/api/slots?doctorId={id}&date={date}`

### Patient Booking Appointment
1. **Find Available Slots**: GET `/api/slots?doctorId={id}&date={date}`
2. **Book Slot**: POST `/api/slots/book` with slot and patient ID
3. **Confirm Booking**: Slot status changes to 'booked'

### Cancellation Process
1. **Cancel Booking**: POST `/api/slots/cancel` with slot and patient ID
2. **Verify Cancellation**: Slot status changes back to 'available'

## 🔄 Future Enhancements

- [ ] Recurring slot creation (weekly/monthly patterns)
- [ ] Slot templates for common schedules
- [ ] Bulk booking operations
- [ ] Waiting list functionality
- [ ] Automatic slot cleanup for past dates
- [ ] Integration with calendar systems

## 📞 Support

For API support and questions:
- Check the Swagger documentation at `/api-docs`
- Review the test examples in `src/docs/slot-api-examples.md`
- Examine the slot model in `src/modules/slots/slotModel.ts`