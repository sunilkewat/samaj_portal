# Samaj Portal - Enterprise Community Management Platform

A modern, production-grade Community Management Platform designed for Indian communities (Samaj). Built with high performance, scalability, and security to serve 100,000+ members.

## 🚀 Technology Stack

- **Backend**: Node.js, Express.js, PostgreSQL (Render), Prisma ORM, Socket.IO, Redis, JWT
- **Frontend**: React.js, Material UI, Redux Toolkit, Vite
- **Mobile**: React Native, React Navigation, Firebase Push Notifications (FCM)
- **Database & Storage**: PostgreSQL 16, Redis Cache, AWS S3 / Cloud Storage

## 🌟 Core Modules

1. **Authentication & Multi-Device Sessions**: Mobile OTP, JWT access/refresh tokens.
2. **Member Directory & KYC**: Search by city, gotra, blood group, occupation + admin verification badge.
3. **Social Community Feed**: Pinned posts, image/video attachments, nested comments, likes, WhatsApp shares.
4. **Groups & Real-time Chat**: Public/Private groups, Socket.IO real-time messaging, typing indicators, read receipts.
5. **Matrimonial (Rishtey)**: Advanced match filters, photo blur privacy, Kundli attachment, interest workflows.
6. **Memorial (Shok Samachar)**: Obituaries, biography, tribute messages, virtual candle lighting.
7. **Blood Donation & SOS**: Real-time emergency donor search & hospital SOS alerts.
8. **Donations & Sahyog Nidhi**: Community fundraising campaigns with automated digital receipts.
9. **Events & Sammelans**: RSVP registration & reminders.
10. **Role-Based Access Control (RBAC)**: Super Admin, Samaj Admin, Moderator, Verified Member.

## 📁 Repository Structure

```
├── backend/          # Node.js + Express + Prisma + Socket.IO server
├── frontend/         # React.js + Material UI web client
├── mobile_app/       # React Native mobile application
├── docs/             # API specifications & architecture diagrams
├── ARCHITECTURE.md   # Detailed architectural blueprint
└── docker-compose.yml# Local Postgres & Redis orchestration
```

## 🛠️ Getting Started

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Server runs on `http://localhost:5000` with API health check at `http://localhost:5000/health`.
