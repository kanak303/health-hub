import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthHub API',
      version: '1.0.0',
      description: 'A comprehensive healthcare management system API',
    },
    tags: [
      {
        name: 'Doctors',
        description: 'Doctor profile management endpoints'
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Bookings',
        description: 'Appointment booking management endpoints'
      },
      {
        name: 'Slots',
        description: 'Doctor availability slot management endpoints'
      },
      {
        name: 'Clinics',
        description: 'Clinic management endpoints'
      }
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'doctor', 'patient', 'clinic_admin'] },
            isVerified: { type: 'boolean' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        Doctor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Dr. John Smith' },
            specialty: { type: 'string', example: 'Cardiology' },
            experience: { type: 'integer', example: 10 },
            qualification: { type: 'string', example: 'MBBS, MD Cardiology' },
            licenseNumber: { type: 'string', example: 'MED123456' },
            phone: { type: 'string', example: '+1234567890' },
            consultationFee: { type: 'number', example: 150.00 },
            availability: {
              type: 'object',
              example: {
                monday: { start: '09:00', end: '17:00' },
                tuesday: { start: '09:00', end: '17:00' }
              }
            },
            bio: { type: 'string', example: 'Experienced cardiologist with 10+ years of practice' },
            profileImage: { type: 'string', example: 'https://example.com/profile.jpg' },
            isActive: { type: 'boolean', example: true },
            rating: { type: 'number', example: 4.5 },
            totalReviews: { type: 'integer', example: 120 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateDoctorRequest: {
          type: 'object',
          required: ['userId', 'name', 'specialty', 'experience', 'qualification', 'licenseNumber', 'phone', 'consultationFee', 'availability'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Dr. John Smith' },
            specialty: { type: 'string', example: 'Cardiology' },
            experience: { type: 'integer', minimum: 0, example: 10 },
            qualification: { type: 'string', example: 'MBBS, MD Cardiology' },
            licenseNumber: { type: 'string', example: 'MED123456' },
            phone: { type: 'string', example: '+1234567890' },
            consultationFee: { type: 'number', minimum: 0, example: 150.00 },
            availability: {
              type: 'object',
              example: {
                monday: { start: '09:00', end: '17:00' },
                tuesday: { start: '09:00', end: '17:00' }
              }
            },
            bio: { type: 'string', example: 'Experienced cardiologist with 10+ years of practice' },
            profileImage: { type: 'string', format: 'uri', example: 'https://example.com/profile.jpg' }
          }
        },
        UpdateDoctorRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Dr. John Smith' },
            specialty: { type: 'string', example: 'Cardiology' },
            experience: { type: 'integer', minimum: 0, example: 10 },
            qualification: { type: 'string', example: 'MBBS, MD Cardiology' },
            licenseNumber: { type: 'string', example: 'MED123456' },
            phone: { type: 'string', example: '+1234567890' },
            consultationFee: { type: 'number', minimum: 0, example: 150.00 },
            availability: {
              type: 'object',
              example: {
                monday: { start: '09:00', end: '17:00' },
                tuesday: { start: '09:00', end: '17:00' }
              }
            },
            bio: { type: 'string', example: 'Experienced cardiologist with 10+ years of practice' },
            profileImage: { type: 'string', format: 'uri', example: 'https://example.com/profile.jpg' },
            isActive: { type: 'boolean', example: true }
          }
        },
        DoctorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                doctor: { $ref: '#/components/schemas/Doctor' }
              }
            }
          }
        },
        DoctorsListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                doctors: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Doctor' }
                }
              }
            }
          }
        },
        Slot: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            doctorId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date', example: '2024-01-27' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '09:30' },
            status: { type: 'string', enum: ['available', 'booked', 'cancelled'], example: 'available' },
            patientId: { type: 'string', format: 'uuid', nullable: true }
          }
        },
        CreateSlotsRequest: {
          type: 'object',
          required: ['doctorId', 'date', 'startTime', 'endTime', 'slotDuration'],
          properties: {
            doctorId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date', example: '2024-01-27' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '17:00' },
            slotDuration: { type: 'integer', minimum: 1, example: 30, description: 'Duration in minutes' }
          }
        },
        BookSlotRequest: {
          type: 'object',
          required: ['slotId', 'patientId'],
          properties: {
            slotId: { type: 'string', format: 'uuid' },
            patientId: { type: 'string', format: 'uuid' }
          }
        },
        CancelSlotRequest: {
          type: 'object',
          required: ['slotId', 'patientId'],
          properties: {
            slotId: { type: 'string', format: 'uuid' },
            patientId: { type: 'string', format: 'uuid' }
          }
        },
        UpdateSlotRequest: {
          type: 'object',
          properties: {
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '09:30' },
            status: { type: 'string', enum: ['available', 'booked', 'cancelled'] }
          }
        },
        SlotsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            filters: {
              type: 'object',
              properties: {
                doctorId: { type: 'string' },
                date: { type: 'string' }
              }
            },
            availableSlots: {
              type: 'array',
              items: { $ref: '#/components/schemas/Slot' }
            },
            total: { type: 'integer', example: 16 }
          }
        },
        SlotResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            slot: { $ref: '#/components/schemas/Slot' }
          }
        },
        CreateSlotsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Slots created successfully' },
            slots: {
              type: 'array',
              items: { $ref: '#/components/schemas/Slot' }
            },
            totalSlots: { type: 'integer', example: 16 }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            doctorId: { type: 'string', format: 'uuid' },
            slotId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'], example: 'confirmed' },
            bookingDate: { type: 'string', format: 'date-time' },
            notes: { type: 'string', example: 'Follow-up appointment for chest pain' },
            paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], example: 'paid' },
            transactionId: { type: 'string', example: 'txn_1234567890' },
            amount: { type: 'number', example: 150.00 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateBookingRequest: {
          type: 'object',
          required: ['userId', 'doctorId', 'slotId', 'bookingDate', 'amount', 'paymentMethod'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
            doctorId: { type: 'string', format: 'uuid' },
            slotId: { type: 'string', format: 'uuid' },
            bookingDate: { type: 'string', format: 'date-time' },
            notes: { type: 'string', example: 'Follow-up appointment for chest pain' },
            amount: { type: 'number', minimum: 0, example: 150.00 },
            paymentMethod: { type: 'string', example: 'credit_card' }
          }
        },
        UpdateBookingRequest: {
          type: 'object',
          properties: {
            bookingDate: { type: 'string', format: 'date-time' },
            notes: { type: 'string', example: 'Updated appointment notes' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] }
          }
        },
        BookingResponse: {
          type: 'object',
          properties: {
            booking: { $ref: '#/components/schemas/Booking' },
            payment: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                transactionId: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        },
        BookingsListResponse: {
          type: 'object',
          properties: {
            bookings: {
              type: 'array',
              items: { $ref: '#/components/schemas/Booking' }
            }
          }
        },
        BookingActionResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            booking: { $ref: '#/components/schemas/Booking' },
            refund: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                refundId: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        },
        Clinic: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            hospitalName: { type: 'string', example: 'City General Hospital' },
            doctorName: { type: 'string', example: 'Dr. John Smith' },
            slug: { type: 'string', example: 'city-general-hospital' },
            address: { type: 'string', example: '123 Main St, City, State 12345' },
            phone: { type: 'string', example: '+1234567890' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateClinicRequest: {
          type: 'object',
          required: ['hospitalName', 'doctorName', 'slug'],
          properties: {
            hospitalName: { type: 'string', minLength: 2, example: 'City General Hospital' },
            doctorName: { type: 'string', minLength: 2, example: 'Dr. John Smith' },
            slug: { type: 'string', pattern: '^[a-z0-9-]+$', example: 'city-general-hospital' },
            address: { type: 'string', example: '123 Main St, City, State 12345' },
            phone: { type: 'string', example: '+1234567890' }
          }
        },
        UpdateClinicRequest: {
          type: 'object',
          properties: {
            hospitalName: { type: 'string', minLength: 2, example: 'Updated Hospital Name' },
            doctorName: { type: 'string', minLength: 2, example: 'Dr. Jane Doe' },
            slug: { type: 'string', pattern: '^[a-z0-9-]+$', example: 'updated-hospital-name' },
            address: { type: 'string', example: '456 Updated St, City, State 12345' },
            phone: { type: 'string', example: '+0987654321' }
          }
        },
        ClinicResponse: {
          type: 'object',
          properties: {
            clinic: { $ref: '#/components/schemas/Clinic' }
          }
        },
        ClinicsListResponse: {
          type: 'object',
          properties: {
            clinics: {
              type: 'array',
              items: { $ref: '#/components/schemas/Clinic' }
            }
          }
        },
        ClinicDeleteResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Clinic successfully deleted' }
          }
        },
      },
    },
  },
  apis: ['./src/route/*.ts', './src/controller/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };