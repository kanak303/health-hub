# Doctor APIs - HealthHub

This document provides comprehensive information about the Doctor-related APIs in the HealthHub system.

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access Swagger Documentation:**
   Open your browser and navigate to: `http://localhost:3000/api-docs`

3. **Base API URL:**
   ```
   http://localhost:3000/api/doctors
   ```

## 📋 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/doctors` | Create a new doctor profile |
| GET | `/api/doctors` | Get all doctors (with optional filters) |
| GET | `/api/doctors/{id}` | Get a specific doctor by ID |
| PUT | `/api/doctors/{id}` | Update doctor profile |
| DELETE | `/api/doctors/{id}` | Deactivate doctor profile |

## 🔧 Features

### ✅ Comprehensive Swagger Documentation
- **Interactive API Testing**: Test all endpoints directly from the Swagger UI
- **Request/Response Examples**: Clear examples for all API calls
- **Schema Validation**: Detailed request and response schemas
- **Error Handling**: Comprehensive error response documentation

### ✅ Data Validation
- **Zod Schema Validation**: Robust input validation using Zod
- **Type Safety**: Full TypeScript support
- **Error Messages**: Clear validation error messages

### ✅ Advanced Features
- **Filtering**: Filter doctors by specialty and active status
- **Sorting**: Results sorted by rating and total reviews
- **Soft Delete**: Deactivation instead of permanent deletion
- **UUID Support**: Secure UUID-based identifiers

## 🏥 Doctor Profile Schema

```typescript
{
  id: string (UUID)
  userId: string (UUID) - Reference to User table
  name: string
  specialty: string
  experience: number (years)
  qualification: string
  licenseNumber: string (unique)
  phone: string
  consultationFee: number
  availability: object (JSON)
  bio?: string (optional)
  profileImage?: string (optional URL)
  isActive: boolean (default: true)
  rating?: number (0.0-5.0)
  totalReviews?: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🔍 API Usage Examples

### Create Doctor Profile
```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "name": "Dr. Sarah Johnson",
    "specialty": "Dermatology",
    "experience": 8,
    "qualification": "MBBS, MD Dermatology",
    "licenseNumber": "DRM789012",
    "phone": "+1987654321",
    "consultationFee": 120.00,
    "availability": {
      "monday": {"start": "10:00", "end": "16:00"},
      "wednesday": {"start": "10:00", "end": "16:00"},
      "friday": {"start": "10:00", "end": "16:00"}
    },
    "bio": "Specialist in skin conditions and cosmetic dermatology"
  }'
```

### Get Doctors with Filters
```bash
# Get all cardiologists
curl "http://localhost:3000/api/doctors?specialty=Cardiology"

# Get all active doctors
curl "http://localhost:3000/api/doctors?isActive=true"

# Get inactive doctors
curl "http://localhost:3000/api/doctors?isActive=false"
```

## 🛡️ Validation Rules

### Required Fields (Create)
- `userId` - Must be valid UUID
- `name` - Minimum 2 characters
- `specialty` - Minimum 2 characters
- `experience` - Must be 0 or greater
- `qualification` - Minimum 2 characters
- `licenseNumber` - Minimum 5 characters, must be unique
- `phone` - Must match phone number format
- `consultationFee` - Must be 0 or greater
- `availability` - Must be valid JSON object

### Optional Fields
- `bio` - Any string
- `profileImage` - Must be valid URL

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "doctor": {
      // Doctor object
    }
  }
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

## 🔒 Security Features

- **Input Validation**: All inputs validated using Zod schemas
- **SQL Injection Protection**: Using Sequelize ORM
- **UUID Usage**: Secure identifiers
- **Soft Delete**: Data preservation with deactivation

## 🧪 Testing

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Expand the "Doctors" section
3. Click "Try it out" on any endpoint
4. Fill in the required parameters
5. Click "Execute" to test

### Using Postman
Import the API collection using the OpenAPI specification available at:
`http://localhost:3000/api-docs/swagger.json`

## 🚨 Common Error Scenarios

| Status Code | Scenario | Solution |
|-------------|----------|----------|
| 400 | User doesn't have doctor role | Ensure user has "doctor" role |
| 404 | User not found | Verify userId exists |
| 409 | Doctor profile already exists | Use update endpoint instead |
| 422 | Validation errors | Check request body format |
| 500 | Server error | Check server logs |

## 📈 Performance Considerations

- **Database Indexing**: Indexes on frequently queried fields
- **Pagination**: Consider implementing pagination for large datasets
- **Caching**: Redis caching for frequently accessed data
- **Query Optimization**: Efficient database queries with proper joins

## 🔄 Future Enhancements

- [ ] Pagination support for doctor listings
- [ ] Advanced search with multiple filters
- [ ] Doctor availability calendar integration
- [ ] Review and rating system
- [ ] Image upload for profile pictures
- [ ] Bulk operations support

## 📞 Support

For API support and questions:
- Check the Swagger documentation at `/api-docs`
- Review the test examples in `src/docs/doctor-api-examples.md`
- Examine the validation schemas in `src/modules/doctors/doctorValidation.ts`