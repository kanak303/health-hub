# Slot API Testing Examples

## Base URL
```
http://localhost:3000/api/slots
```

## 1. Create Slots

**POST** `/api/slots/create`

```json
{
  "doctorId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-01-27",
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 30
}
```

This will create 16 slots (30-minute intervals from 9:00 AM to 5:00 PM).

## 2. Get Available Slots

**GET** `/api/slots`

Query Parameters:
- `doctorId` (optional): Filter by doctor ID
- `date` (optional): Filter by date (YYYY-MM-DD format)

Examples:
- `/api/slots` - Get all available slots
- `/api/slots?doctorId=123e4567-e89b-12d3-a456-426614174000` - Get slots for specific doctor
- `/api/slots?date=2024-01-27` - Get slots for specific date
- `/api/slots?doctorId=123e4567-e89b-12d3-a456-426614174000&date=2024-01-27` - Combined filters

## 3. Book a Slot

**POST** `/api/slots/book`

```json
{
  "slotId": "456e7890-e89b-12d3-a456-426614174001",
  "patientId": "789e0123-e89b-12d3-a456-426614174002"
}
```

## 4. Update Slot

**PUT** `/api/slots/update/{slotId}`

```json
{
  "startTime": "10:00",
  "endTime": "10:30",
  "status": "available"
}
```

## 5. Cancel Slot

**POST** `/api/slots/cancel`

```json
{
  "slotId": "456e7890-e89b-12d3-a456-426614174001",
  "patientId": "789e0123-e89b-12d3-a456-426614174002"
}
```

## Response Examples

### Create Slots Success Response
```json
{
  "success": true,
  "message": "Slots created successfully",
  "slots": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "doctorId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2024-01-27",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "available",
      "patientId": null
    }
  ],
  "totalSlots": 16
}
```

### Get Slots Success Response
```json
{
  "success": true,
  "filters": {
    "doctorId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-27"
  },
  "availableSlots": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "doctorId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2024-01-27",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "available",
      "patientId": null
    }
  ],
  "total": 16
}
```

### Book Slot Success Response
```json
{
  "success": true,
  "message": "Slot booked successfully",
  "slot": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "doctorId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-27",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "booked",
    "patientId": "789e0123-e89b-12d3-a456-426614174002"
  }
}
```

## Testing with cURL

### Create Slots
```bash
curl -X POST http://localhost:3000/api/slots/create \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-27",
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 30
  }'
```

### Get Available Slots
```bash
# Get all available slots
curl -X GET http://localhost:3000/api/slots

# Get slots for specific doctor
curl -X GET "http://localhost:3000/api/slots?doctorId=123e4567-e89b-12d3-a456-426614174000"

# Get slots for specific date
curl -X GET "http://localhost:3000/api/slots?date=2024-01-27"
```

### Book a Slot
```bash
curl -X POST http://localhost:3000/api/slots/book \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "456e7890-e89b-12d3-a456-426614174001",
    "patientId": "789e0123-e89b-12d3-a456-426614174002"
  }'
```

### Update Slot
```bash
curl -X PUT http://localhost:3000/api/slots/update/456e7890-e89b-12d3-a456-426614174001 \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "10:00",
    "endTime": "10:30"
  }'
```

### Cancel Slot
```bash
curl -X POST http://localhost:3000/api/slots/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "456e7890-e89b-12d3-a456-426614174001",
    "patientId": "789e0123-e89b-12d3-a456-426614174002"
  }'
```

## Slot Status Values
- `available` - Slot is open for booking
- `booked` - Slot has been booked by a patient
- `cancelled` - Slot was cancelled

## Common Error Scenarios
- **400**: Missing required fields, slots already exist, slot already booked
- **403**: Not authorized to cancel slot (wrong patient ID)
- **404**: Slot not found
- **500**: Server error