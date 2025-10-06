# Doctor API Testing Examples

## Base URL
```
http://localhost:3000/api/doctors
```

## 1. Create Doctor Profile

**POST** `/api/doctors`

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Dr. John Smith",
  "specialty": "Cardiology",
  "experience": 10,
  "qualification": "MBBS, MD Cardiology",
  "licenseNumber": "MED123456",
  "phone": "+1234567890",
  "consultationFee": 150.00,
  "availability": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" },
    "wednesday": { "start": "09:00", "end": "17:00" },
    "thursday": { "start": "09:00", "end": "17:00" },
    "friday": { "start": "09:00", "end": "17:00" }
  },
  "bio": "Experienced cardiologist with 10+ years of practice specializing in heart disease prevention and treatment.",
  "profileImage": "https://example.com/profile.jpg"
}
```

## 2. Get All Doctors

**GET** `/api/doctors`

Query Parameters:
- `specialty` (optional): Filter by specialty (e.g., "Cardiology")
- `isActive` (optional): Filter by active status (default: true)

Examples:
- `/api/doctors` - Get all active doctors
- `/api/doctors?specialty=Cardiology` - Get all cardiologists
- `/api/doctors?isActive=false` - Get inactive doctors

## 3. Get Doctor by ID

**GET** `/api/doctors/{id}`

Example: `/api/doctors/123e4567-e89b-12d3-a456-426614174000`

## 4. Update Doctor Profile

**PUT** `/api/doctors/{id}`

```json
{
  "name": "Dr. John Smith Jr.",
  "consultationFee": 175.00,
  "bio": "Updated bio with additional specializations",
  "availability": {
    "monday": { "start": "08:00", "end": "18:00" },
    "tuesday": { "start": "08:00", "end": "18:00" }
  }
}
```

## 5. Deactivate Doctor Profile

**DELETE** `/api/doctors/{id}`

This performs a soft delete by setting `isActive` to false.

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Doctor profile created successfully",
  "data": {
    "doctor": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Dr. John Smith",
      "specialty": "Cardiology",
      "experience": 10,
      "qualification": "MBBS, MD Cardiology",
      "licenseNumber": "MED123456",
      "phone": "+1234567890",
      "consultationFee": 150.00,
      "availability": {
        "monday": { "start": "09:00", "end": "17:00" }
      },
      "bio": "Experienced cardiologist...",
      "profileImage": "https://example.com/profile.jpg",
      "isActive": true,
      "rating": 0.0,
      "totalReviews": 0,
      "createdAt": "2024-01-27T10:00:00.000Z",
      "updatedAt": "2024-01-27T10:00:00.000Z"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User must have doctor role",
  "error": "Invalid user role"
}
```

## Testing with cURL

### Create Doctor
```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dr. John Smith",
    "specialty": "Cardiology",
    "experience": 10,
    "qualification": "MBBS, MD Cardiology",
    "licenseNumber": "MED123456",
    "phone": "+1234567890",
    "consultationFee": 150.00,
    "availability": {
      "monday": {"start": "09:00", "end": "17:00"}
    }
  }'
```

### Get All Doctors
```bash
curl -X GET http://localhost:3000/api/doctors
```

### Get Doctor by ID
```bash
curl -X GET http://localhost:3000/api/doctors/123e4567-e89b-12d3-a456-426614174000
```