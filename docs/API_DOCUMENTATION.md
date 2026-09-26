# Samaj Portal - REST API & Socket.IO Specification

**Base URL**: `http://localhost:5000/api/v1`  
**Authentication**: Bearer JWT (`Authorization: Bearer <access_token>`)

---

## 1. REST API Endpoints Overview

### 1.1 Authentication & Devices (`/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register new user with mobile, password & basic info | Public |
| POST | `/auth/login` | Login using mobile/email & password | Public |
| POST | `/auth/send-otp` | Request OTP for mobile verification or login | Public |
| POST | `/auth/verify-otp` | Verify OTP code & return token or reset ticket | Public |
| POST | `/auth/refresh-token` | Generate new access token using refresh token | Public |
| POST | `/auth/logout` | Revoke session & clear refresh token | Authenticated |
| GET | `/auth/devices` | List active logged-in devices | Authenticated |
| DELETE | `/auth/devices/:deviceId` | Terminate session on a specific remote device | Authenticated |

### 1.2 User Profile & Family (`/profiles`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/profiles/me` | Fetch authenticated user's profile and family details | Authenticated |
| PUT | `/profiles/me` | Update personal profile (bio, education, gotra, etc.) | Authenticated |
| POST | `/profiles/me/avatar` | Upload & update profile/cover photo | Authenticated |
| POST | `/profiles/family` | Add family member | Authenticated |
| PUT | `/profiles/family/:id` | Update family member record | Authenticated |
| DELETE | `/profiles/family/:id` | Delete family member record | Authenticated |

### 1.3 Member Directory (`/directory`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/directory` | Search members by name, gotra, city, occupation, blood group | Verified Member |
| GET | `/directory/:userId` | View public member card | Verified Member |
| GET | `/directory/stats` | Aggregated community statistics (members by city/state) | Verified Member |

### 1.4 Social Feed & Posts (`/posts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/posts` | Paginated feed (with Redis cache support) | Authenticated |
| POST | `/posts` | Create new post with text, image, video, poll | Authenticated |
| GET | `/posts/:id` | Get single post details with comment tree | Authenticated |
| DELETE | `/posts/:id` | Soft delete post | Author / Moderator |
| POST | `/posts/:id/like` | Toggle like on post | Authenticated |
| POST | `/posts/:id/share` | Track share count (WhatsApp/External) | Authenticated |
| POST | `/posts/:id/comments` | Add comment or nested reply | Authenticated |
| DELETE | `/posts/comments/:id`| Delete comment | Author / Moderator |

### 1.5 Groups & Group Chat (`/groups`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/groups` | List public & joined groups | Authenticated |
| POST | `/groups` | Create new group (committee, youth wing, city group) | Authenticated |
| POST | `/groups/:id/join` | Join public group or submit join request | Authenticated |
| GET | `/groups/:id/messages`| Fetch paginated group message history | Group Member |
| POST | `/groups/:id/messages`| Send message with file/audio attachment | Group Member |
| PUT | `/groups/:id/members/:userId/role` | Promote/demote group admin/moderator | Group Owner |

### 1.6 Matrimonial (Rishtey) (`/matrimonial`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/matrimonial/profiles` | Search prospective matches by age, gotra, city, etc. | Verified Member |
| POST | `/matrimonial/profile` | Create/update matrimonial biodata | Verified Member |
| POST | `/matrimonial/interests` | Express interest in candidate profile | Verified Member |
| PUT | `/matrimonial/interests/:id` | Accept / Reject interest | Recipient |
| POST | `/matrimonial/shortlist/:id` | Shortlist / Bookmark profile | Verified Member |
| POST | `/matrimonial/block/:id` | Block profile | Verified Member |

### 1.7 Memorials / Shok Samachar (`/memorials`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/memorials` | List memorials / obituaries | Authenticated |
| POST | `/memorials` | Submit memorial with photos & biography | Authenticated |
| POST | `/memorials/:id/tribute` | Post condolence / light virtual candle | Authenticated |

### 1.8 Blood Bank & Emergency SOS (`/blood-bank`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/blood-bank/donors` | Search available blood donors by blood group & city | Authenticated |
| POST | `/blood-bank/register-donor` | Register self as emergency donor | Authenticated |
| POST | `/blood-bank/sos-request` | Broadcast emergency blood requirement to city donors | Authenticated |

### 1.9 Events & Sammelans (`/events`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/events` | List upcoming and past samajik events | Authenticated |
| POST | `/events` | Create new event announcement | Admin / Organizer |
| POST | `/events/:id/rsvp` | RSVP registration (Going / Maybe) | Authenticated |

### 1.10 Donations & Sahyog Nidhi (`/donations`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/donations/campaigns` | Active donation drives (temple, scholarship, medical) | Authenticated |
| POST | `/donations` | Record donation & generate digital receipt | Authenticated |
| GET | `/donations/my` | View personal donation history and receipts | Authenticated |

---

## 2. Socket.IO Real-Time Architecture

**Namespaces**: `/chat`, `/notifications`

### 2.1 Chat Events (`/chat`)
- `client -> server`:
  - `join_group({ groupId })`
  - `leave_group({ groupId })`
  - `send_message({ groupId, messageText, mediaUrl, mediaType })`
  - `typing_start({ groupId })`
  - `typing_stop({ groupId })`
  - `mark_message_read({ messageId, groupId })`
- `server -> client`:
  - `new_message(messagePayload)`
  - `user_typing({ userId, userName, groupId })`
  - `message_read_receipt({ messageId, userId, readAt })`
  - `member_presence_update({ userId, status })`

### 2.2 Notification Events (`/notifications`)
- `server -> client`:
  - `notification_received(notificationObject)`
  - `blood_sos_alert(emergencyPayload)`

---

## 3. Role-Based Access Control (RBAC) Matrix

| Permission | Super Admin | Samaj Admin | Moderator | Verified Member | Guest / Pending |
|---|:---:|:---:|:---:|:---:|:---:|
| `users:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `members:verify` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `posts:create` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `posts:delete_any`| ✅ | ✅ | ✅ | ❌ | ❌ |
| `groups:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `matrimonial:view`| ✅ | ✅ | ✅ | ✅ | ❌ |
| `events:create` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `audit_logs:view`| ✅ | ❌ | ❌ | ❌ | ❌ |
