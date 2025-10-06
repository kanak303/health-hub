# Clinic API Testing Examples

## Base URL
```
http://localhost:3000/api/clinics
```

## 1. Create Clinic

**POST** `/api/clinics`

```json
{
  "hospitalName": "City General Hospital",
  "doctorName": "Dr. John Smith",
  "slug": "city-general-hospital",
  "address": "123 Main Street, Downtown, City, State 12345",
  "phone": "+1234567890"
}
```

## 2. Get All Clinics

**GET** `/api/clinics`

Returns all clinics in the system.

## 3. Get Clinic by ID

**GET** `/api/clinics/{id}`

Example: `/api/clinics/123e4567-e89b-12d3-a456-426614174000`

## 4. Update Clinic

**PATCH** `/api/clinics/{id}`

```json
{
  "hospitalName": "Updated Hospital Name",
  "doctorName": "Dr. Jane Doe",
  "address": "456 Updated Street, New Location, City, State 54321",
  "phone": "+0987654321"
}
```

## 5. Delete Clinic

**DELETE** `/api/clinics/{id}`

Performs a soft delete (sets deletedAt timestamp).

## Response Examples

### Create Clinic Success Response
```json
{
  "clinic": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "hospitalName": "City General Hospital",
    "doctorName": "Dr. John Smith",
    "slug": "city-general-hospital",
    "address": "123 Main Street, Downtown, City, State 12345",
    "phone": "+1234567890",
    "deletedAt": null,
    "createdAt": "2024-01-27T10:00:00.000Z",
    "updatedAt": "2024-01-27T10:00:00.000Z"
  }
}
```

### Get All Clinics Response
```json
{
  "clinics": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "hospitalName": "City General Hospital",
      "doctorName": "Dr. John Smith",
      "slug": "city-general-hospital",
      "address": "123 Main Street, Downtown, City, State 12345",
      "phone": "+1234567890",
      "deletedAt": null,
      "createdAt": "2024-01-27T10:00:00.000Z",
      "updatedAt": "2024-01-27T10:00:00.000Z"
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "hospitalName": "Metro Medical Center",
      "doctorName": "Dr. Sarah Johnson",
      "slug": "metro-medical-center",
      "address": "789 Health Avenue, Medical District, City, State 67890",
      "phone": "+1987654321",
      "deletedAt": null,
      "createdAt": "2024-01-27T11:00:00.000Z",
      "updatedAt": "2024-01-27T11:00:00.000Z"
    }
  ]
}
```

### Update Clinic Response
```json
{
  "clinic": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "hospitalName": "Updated Hospital Name",
    "doctorName": "Dr. Jane Doe",
    "slug": "city-general-hospital",
    "address": "456 Updated Street, New Location, City, State 54321",
    "phone": "+0987654321",
    "deletedAt": null,
    "createdAt": "2024-01-27T10:00:00.000Z",
    "updatedAt": "2024-01-27T12:00:00.000Z"
  }
}
```

### Delete Clinic Response
```json
{
  "message": "Clinic successfully deleted"
}
```

### Error Response (Slug Already Exists)
```json
{
  "error": "Slug already exists"
}
```

## Testing with cURL

### Create Clinic
```bash
curl -X POST http://localhost:3000/api/clinics \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalName": "City General Hospital",
    "doctorName": "Dr. John Smith",
    "slug": "city-general-hospital",
    "address": "123 Main Street, Downtown, City, State 12345",
    "phone": "+1234567890"
  }'
```

### Get All Clinics
```bash
curl -X GET http://localhost:3000/api/clinics
```

### Get Clinic by ID
```bash
curl -X GET http://localhost:3000/api/clinics/123e4567-e89b-12d3-a456-426614174000
```

### Update Clinic
```bash
curl -X PATCH http://localhost:3000/api/clinics/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalName": "Updated Hospital Name",
    "address": "456 Updated Street, New Location, City, State 54321"
  }'
```

### Delete Clinic
```bash
curl -X DELETE http://localhost:3000/api/clinics/123e4567-e89b-12d3-a456-426614174000
```

## Validation Rules

### Required Fields (Create)
- `hospitalName` - Minimum 2 characters
- `doctorName` - Minimum 2 characters  
- `slug` - Must match pattern `^[a-z0-9-]+$` (lowercase letters, numbers, hyphens only)

### Optional Fields
- `address` - Any string
- `phone` - Any string

### Unique Constraints
- `slug` - Must be unique across all clinics

## Common Error Scenarios
- **400**: Validation errors (missing required fields, invalid slug format)
- **400**: Slug already exists (unique constraint violation)
- **404**: Clinic not found (for get, update, delete operations)
- **500**: Server error

## Slug Format Rules
- Only lowercase letters (a-z)
- Numbers (0-9)
- Hyphens (-) for word separation
- No spaces, special characters, or uppercase letters
- Examples: `city-hospital`, `metro-clinic-2024`, `downtown-medical`

## Soft Delete Behavior
- Delete operation sets `deletedAt` timestamp instead of removing record
- Deleted clinics are excluded from normal queries
- Data is preserved for audit and recovery purposes