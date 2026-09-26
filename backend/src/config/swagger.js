const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Samaj Portal - Enterprise REST API Gateway',
    version: '1.0.0',
    description: 'Comprehensive, production-ready community management API for Samaj Portal with JWT authentication, multi-device sessions, member directory, matrimonial, and blood bank SOS.',
    contact: {
      name: 'Samaj Portal Development Team',
      email: 'support@samajportal.org',
    },
  },
  servers: [
    {
      url: 'https://samaj-portal-api.onrender.com/api/v1',
      description: 'Production Cloud Server (Render)',
    },
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer Access Token generated from /auth/login or /auth/verify-otp',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User registration, OTP login, JWT refresh & device management' },
    { name: 'User Profile & Family', description: 'Personal KYC, Gotra, Family tree & Firebase photo uploads' },
    { name: 'Member Directory', description: 'Directory search and city/gotra/blood group filters' },
    { name: 'Social Feed & Posts', description: 'Posts, media, atomic likes, comments, and WhatsApp share tracking' },
    { name: 'Matrimonial (Rishtey)', description: 'Candidate biodata, gotra-aware match search, and interest proposals' },
    { name: 'Blood Bank & Emergency SOS', description: 'Emergency blood donor directory & hospital SOS broadcast alerts' },
    { name: 'Events & Sammelan', description: 'Community festival and sammelan announcements with RSVP' },
    { name: 'Groups & Chat', description: 'Public/private groups and group chat messaging' },
    { name: 'Admin & Audit Logs', description: 'Admin KPI dashboard, member KYC approvals, and security audit trail' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new member',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mobileNumber', 'password', 'firstName', 'lastName', 'gender', 'city', 'state'],
                properties: {
                  mobileNumber: { type: 'string', example: '9876543210' },
                  password: { type: 'string', example: 'Password@123' },
                  firstName: { type: 'string', example: 'Sunil' },
                  lastName: { type: 'string', example: 'Kewat' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
                  city: { type: 'string', example: 'Indore' },
                  state: { type: 'string', example: 'Madhya Pradesh' },
                  samajGotra: { type: 'string', example: 'कश्यप' },
                  occupation: { type: 'string', example: 'Software Architect' },
                  bloodGroup: { type: 'string', example: 'O_POSITIVE' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Member registered successfully' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login with Mobile/Email & Password',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password'],
                properties: {
                  identifier: { type: 'string', example: '9876543210' },
                  password: { type: 'string', example: 'Password@123' },
                  deviceType: { type: 'string', enum: ['WEB', 'ANDROID', 'IOS'], default: 'WEB' },
                  fcmToken: { type: 'string', example: 'fcm_device_token_xyz' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful with JWT access and refresh tokens' } },
      },
    },
    '/auth/send-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Send 6-digit OTP to mobile or email',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier'],
                properties: {
                  identifier: { type: 'string', example: '9876543210' },
                  purpose: { type: 'string', enum: ['LOGIN', 'REGISTRATION', 'FORGOT_PASSWORD'], default: 'LOGIN' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OTP dispatched' } },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify OTP code and authenticate',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'otpCode'],
                properties: {
                  identifier: { type: 'string', example: '9876543210' },
                  otpCode: { type: 'string', example: '294311' },
                  purpose: { type: 'string', default: 'LOGIN' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OTP verified' } },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Rotate refresh token and issue new access token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'New token pair generated' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user info and roles',
        responses: { 200: { description: 'User data' } },
      },
    },
    '/auth/devices': {
      get: {
        tags: ['Authentication'],
        summary: 'List active logged-in devices',
        responses: { 200: { description: 'List of devices' } },
      },
    },
    '/profiles/me': {
      get: {
        tags: ['User Profile & Family'],
        summary: 'Get full profile and family details',
        responses: { 200: { description: 'Profile details' } },
      },
      put: {
        tags: ['User Profile & Family'],
        summary: 'Update personal profile details',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  bio: { type: 'string', example: 'Dedicated social worker & engineer' },
                  occupation: { type: 'string', example: 'Senior Software Architect' },
                  city: { type: 'string', example: 'Indore' },
                  nativeVillage: { type: 'string', example: 'महेश्वर' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/profiles/family': {
      post: {
        tags: ['User Profile & Family'],
        summary: 'Add family member record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'relationship', 'gender'],
                properties: {
                  fullName: { type: 'string', example: 'Ramprasad Kewat' },
                  relationship: { type: 'string', example: 'Father' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                  age: { type: 'integer', example: 62 },
                  occupation: { type: 'string', example: 'Social Worker' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Family member added' } },
      },
    },
    '/directory': {
      get: {
        tags: ['Member Directory'],
        summary: 'Search members with filters',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by Name, Gotra or Village' },
          { name: 'city', in: 'query', schema: { type: 'string' }, description: 'Filter by City (e.g. Indore, Bhopal)' },
          { name: 'bloodGroup', in: 'query', schema: { type: 'string' }, description: 'Filter by Blood Group' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Paginated members directory' } },
      },
    },
    '/directory/stats': {
      get: {
        tags: ['Member Directory'],
        summary: 'Get community directory metrics',
        responses: { 200: { description: 'Community stats' } },
      },
    },
    '/posts': {
      get: {
        tags: ['Social Feed & Posts'],
        summary: 'Get paginated social feed',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
        ],
        responses: { 200: { description: 'Feed list' } },
      },
      post: {
        tags: ['Social Feed & Posts'],
        summary: 'Create community post',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string', example: 'जय समाज! आगामी सम्मेलन की रूपरेखा तैयार है।' },
                  isPinned: { type: 'boolean', default: false },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Post created' } },
      },
    },
    '/posts/{id}/like': {
      post: {
        tags: ['Social Feed & Posts'],
        summary: 'Toggle atomic like on post',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Like toggled' } },
      },
    },
    '/posts/{id}/comments': {
      post: {
        tags: ['Social Feed & Posts'],
        summary: 'Add comment or nested reply to post',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', example: 'हार्दिक शुभकामनाएं!' },
                  parentId: { type: 'string', description: 'Parent comment ID for nested reply' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Comment added' } },
      },
    },
    '/matrimonial/profile': {
      post: {
        tags: ['Matrimonial (Rishtey)'],
        summary: 'Create or update matrimonial biodata',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['gender', 'dob', 'gotraSelf', 'highestDegree'],
                properties: {
                  gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                  dob: { type: 'string', example: '1998-07-20' },
                  heightCm: { type: 'integer', example: 175 },
                  maritalStatus: { type: 'string', enum: ['NEVER_MARRIED', 'DIVORCED', 'WIDOWED'], default: 'NEVER_MARRIED' },
                  gotraSelf: { type: 'string', example: 'कश्यप' },
                  gotraMother: { type: 'string', example: 'भारद्वाज' },
                  highestDegree: { type: 'string', example: 'B.Tech / MBA' },
                  occupationTitle: { type: 'string', example: 'Project Manager' },
                  annualIncome: { type: 'string', example: '12-15 LPA' },
                  workCity: { type: 'string', example: 'Indore' },
                  aboutCandidate: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Matrimonial biodata saved' } },
      },
    },
    '/matrimonial/profiles': {
      get: {
        tags: ['Matrimonial (Rishtey)'],
        summary: 'Search prospective matrimonial profiles (with gotra-rule compatibility)',
        parameters: [
          { name: 'gender', in: 'query', schema: { type: 'string', enum: ['MALE', 'FEMALE'] } },
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'gotra', in: 'query', schema: { type: 'string' }, description: 'Excludes same gotra candidates' },
          { name: 'minAge', in: 'query', schema: { type: 'integer' } },
          { name: 'maxAge', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Matching candidates' } },
      },
    },
    '/matrimonial/interests': {
      post: {
        tags: ['Matrimonial (Rishtey)'],
        summary: 'Send interest proposal to candidate',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['receiverId'],
                properties: {
                  receiverId: { type: 'string' },
                  message: { type: 'string', example: 'हमें आपका बायोडाटा पसंद आया, संपर्क करें।' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Interest proposal sent' } },
      },
    },
    '/blood-bank/donors': {
      get: {
        tags: ['Blood Bank & Emergency SOS'],
        summary: 'Search available blood donors',
        parameters: [
          { name: 'bloodGroup', in: 'query', schema: { type: 'string' }, description: 'e.g. O_POSITIVE, B_POSITIVE' },
          { name: 'city', in: 'query', schema: { type: 'string' }, description: 'e.g. Indore, Bhopal' },
        ],
        responses: { 200: { description: 'Available donors list' } },
      },
    },
    '/blood-bank/register-donor': {
      post: {
        tags: ['Blood Bank & Emergency SOS'],
        summary: 'Register self as active blood donor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['bloodGroup', 'city', 'state'],
                properties: {
                  bloodGroup: { type: 'string', example: 'O_POSITIVE' },
                  city: { type: 'string', example: 'Indore' },
                  state: { type: 'string', example: 'Madhya Pradesh' },
                  isAvailable: { type: 'boolean', default: true },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Donor registered' } },
      },
    },
    '/blood-bank/sos-request': {
      post: {
        tags: ['Blood Bank & Emergency SOS'],
        summary: 'Broadcast emergency blood SOS alert to city donors via FCM',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientName', 'hospitalName', 'hospitalCity', 'bloodGroup', 'contactNumber'],
                properties: {
                  patientName: { type: 'string', example: 'रवि केवट' },
                  hospitalName: { type: 'string', example: 'CHL Hospital' },
                  hospitalCity: { type: 'string', example: 'Indore' },
                  bloodGroup: { type: 'string', example: 'O_POSITIVE' },
                  unitsNeeded: { type: 'integer', default: 2 },
                  contactNumber: { type: 'string', example: '9876543210' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Emergency SOS dispatched' } },
      },
    },
    '/events': {
      get: {
        tags: ['Events & Sammelan'],
        summary: 'List upcoming community events',
        responses: { 200: { description: 'Events list' } },
      },
      post: {
        tags: ['Events & Sammelan'],
        summary: 'Create event announcement',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'venueCity', 'startDateTime'],
                properties: {
                  title: { type: 'string', example: 'वार्षिक परिचय सम्मेलन 2026' },
                  venueCity: { type: 'string', example: 'Indore' },
                  startDateTime: { type: 'string', example: '2026-11-15T10:00:00Z' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Event created' } },
      },
    },
    '/events/{id}/rsvp': {
      post: {
        tags: ['Events & Sammelan'],
        summary: 'Record RSVP (Going / Maybe)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rsvp: { type: 'string', enum: ['GOING', 'MAYBE', 'CANT_GO'], default: 'GOING' },
                  guestCount: { type: 'integer', default: 1 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'RSVP saved' } },
      },
    },
    '/groups': {
      get: {
        tags: ['Groups & Chat'],
        summary: 'List community groups',
        responses: { 200: { description: 'Groups list' } },
      },
      post: {
        tags: ['Groups & Chat'],
        summary: 'Create new group',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'भोपाल समाज बंधु' },
                  description: { type: 'string' },
                  groupType: { type: 'string', enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Group created' } },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin & Audit Logs'],
        summary: 'Get admin KPI statistics',
        responses: { 200: { description: 'Dashboard stats' } },
      },
    },
    '/admin/audit-logs': {
      get: {
        tags: ['Admin & Audit Logs'],
        summary: 'Get security audit logs trail',
        responses: { 200: { description: 'Audit trail' } },
      },
    },
  },
};

module.exports = { swaggerUi, swaggerDocument };
