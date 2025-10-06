# Clinic APIs - HealthHub

This document provides comprehensive information about the Clinic-related APIs in the HealthHub system for managing healthcare facilities and their associated doctors.

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access Swagger Documentation:**
   Open your browser and navigate to: `http://localhost:3000/api-docs`

3. **Base API URL:**
   ```
   http://localhost:3000/api/clinics
   ```

##API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clinics` | Create a new clinic |
| GET | `/api/clinics` | Get all clinics |
| GET | `/api/clinics/{id}` | Get specific clinic by ID |
| PATCH | `/api/clinics/{id}` | Update clinic information |
| DELETE | `/api/clinics/{id}` | Delete clinic (soft delete) |

## 🔧 Features

### ✅ Comprehensive Swagger Documentation
- **Interactive API Testing**: Test all endpoints directly from Swagger UI
- **Request/Response Examples**: Clear examples for all API calls
- **Schema Validation**: Detailed request and response schemas
- **Error Handling**: Comprehensive error response documentation

### ✅ Advanced Clinic Management
- **Zod Schema Validation**: Robust input validation
- **Unique Slug System**: SEO-friendly clinic identifiers
- **Soft Delete**: Data preservation with paranoid deletion
- **Flexible Updates**: Partial update support

### ✅ Data Integrity
- **Unique Constraints**: Prevents duplicate slugs
- **Input Validation**: Comprehensive field validation
- **Error Handling**: Graceful error responses
- **Audit Trail**: Timestamps for all operations

## 🏥 Clinic Schema

```typescript
{
  id: string (UUID)
  hospitalName: string (required, min 2 chars)
  doctorName: string (required, min 2 chars)
  slug: string (required, unique, lowercase-hyphenated)
  address?: string (optional)
  phone?: string (optional)
  deletedAt?: DateTime (soft delete timestamp)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🔍 API Usage Examples

### Create Clinic
```bash
curl -X POST http://localhost:3000/api/clinics \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalName": "Metro Medical Center",
    "doctorName": "Dr. Sarah Johnson",
    "slug": "metro-medical-center",
    "address": "789 Health Avenue, Medical District",
    "phone": "+1987654321"
  }'
```

### Get All Clinics
```bash
curl -X GET http://localhost:3000/api/clinics
```

### Update Clinic
```bash
curl -X PATCH http://localhost:3000/api/clinics/clinic-uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalName": "Updated Medical Center",
    "address": "New Address, Updated Location"
  }'
```

## 🛡️ Validation & Security

### Required Fields (Create)
- `hospitalName` - Minimum 2 characters
- `doctorName` - Minimum 2 characters
- `slug` - Must match pattern `^[a-z0-9-]+$`

### Optional Fields
- `address` - Any string value
- `phone` - Any string value

### Unique Constraints
- `slug` - Must be unique across all clinics

### Slug Format Rules
- **Allowed**: lowercase letters (a-z), numbers (0-9), hyphens (-)
- **Not Allowed**: uppercase letters, spaces, special characters
- **Examples**: `city-hospital`, `metro-clinic-2024`, `downtown-medical`

## 📊 Response Format

### Success Response
```json
{
  "clinic": {
    "id": "uuid",
    "hospitalName": "Hospital Name",
    "doctorName": "Dr. Name",
    "slug": "hospital-slug",
    "address": "Full Address",
    "phone": "+1234567890",
    "deletedAt": null,
    "createdAt": "2024-01-27T10:00:00.000Z",
    "updatedAt": "2024-01-27T10:00:00.000Z"
  }
}
```

### List Response
```json
{
  "clinics": [
    {
      "id": "uuid",
      "hospitalName": "Hospital Name",
      "doctorName": "Dr. Name"
    }
  ]
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

## 🔒 Data Management

### Soft Delete System
- **Paranoid Deletion**: Records are not permanently deleted
- **deletedAt Timestamp**: Marks when record was deleted
- **Query Exclusion**: Deleted records excluded from normal queries
- **Data Recovery**: Deleted records can be restored if needed

### Update Operations
- **Partial Updates**: Only specified fields are updated
- **Validation**: All updates go through schema validation
- **Timestamp Updates**: `updatedAt` automatically updated
- **Unique Constraints**: Slug uniqueness enforced on updates

## 🧪 Testing

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Expand the "Clinics" section
3. Click "Try it out" on any endpoint
4. Fill in the required parameters
5. Click "Execute" to test

### Using Postman
Import the API collection using the OpenAPI specification available at:
`http://localhost:3000/api-docs/swagger.json`

## 🚨 Common Error Scenarios

| Status Code | Scenario | Solution |
|-------------|----------|----------|
| 400 | Missing required fields | Include hospitalName, doctorName, slug |
| 400 | Invalid slug format | Use only lowercase, numbers, hyphens |
| 400 | Slug already exists | Choose a unique slug |
| 404 | Clinic not found | Verify clinic ID exists |
| 500 | Server error | Check server logs |

## 📈 Performance Considerations

- **Database Indexing**: Unique index on slug field
- **Soft Delete Queries**: Automatic exclusion of deleted records
- **Validation**: Client-side and server-side validation
- **UUID Primary Keys**: Secure and scalable identifiers

## 🔄 Workflow Examples

### Creating a New Clinic
1. **Prepare Data**: Gather hospital name, doctor name, create unique slug
2. **Validate Slug**: Ensure slug follows format rules and is unique
3. **Create Clinic**: POST request with all required fields
4. **Verify Creation**: GET request to confirm clinic was created

### Updating Clinic Information
1. **Identify Clinic**: Use clinic ID from previous queries
2. **Prepare Updates**: Only include fields that need updating
3. **Update Clinic**: PATCH request with partial data
4. **Verify Updates**: GET request to confirm changes

### Managing Clinic Lifecycle
1. **Active State**: Clinic available in all queries
2. **Soft Delete**: DELETE request sets deletedAt timestamp
3. **Hidden State**: Clinic excluded from normal queries
4. **Recovery**: Can be restored by clearing deletedAt (manual process)

## 🔄 Future Enhancements

- [ ] Clinic search and filtering capabilities
- [ ] Clinic categories and specializations
- [ ] Operating hours management
- [ ] Clinic image and media support
- [ ] Integration with doctor profiles
- [ ] Clinic rating and review system
- [ ] Bulk operations support
- [ ] Advanced analytics and reporting

## 📞 Support

For API support and questions:
- Check the Swagger documentation at `/api-docs`
- Review the test examples in `src/docs/clinic-api-examples.md`
- Examine the clinic model in `src/modules/clinic/clinicModels.ts`
- Check validation schemas in `src/controller/clinicController.ts`