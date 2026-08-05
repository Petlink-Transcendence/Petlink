*This project has been created as part of the 42 curriculum by gde-la-r, icunha-t, jpedro-f, rjesus-d, ddo-carm.*

# PetLink — ft_transcendence

[![42 Project](https://img.shields.io/badge/42-ft__transcendence-blue)](https://42.fr)
[![Docker](https://img.shields.io/badge/docker-compose-blue)](docker-compose.yml)
[![Frontend](https://img.shields.io/badge/frontend-React--19-61dafb)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Django--REST-red)](backend/)

PetLink is a full-stack, real-time social platform engineered as part of the 42 **ft_transcendence** project. Designed to connect pet owners with pet caregivers and sitters, the platform provides interactive profiles, live chat messaging, follower connections, real-time notifications, multi-format media uploads, and granular Role-Based Access Control (RBAC)—all powered by a modern microservices architecture and a responsive React frontend.

---

## Table of Contents

- [Description](#description)
- [Modules & Point Calculation](#modules--point-calculation)
- [Team Information & Service Ownership](#team-information--service-ownership)
- [Project Management & Sprint Strategy](#project-management--sprint-strategy)
- [Technical Stack](#technical-stack)
- [Microservices Architecture](#microservices-architecture)
- [Database Schema](#database-schema)
- [Features List](#features-list)
- [Instructions & Setup](#instructions--setup)
- [Individual Contributions](#individual-contributions)
- [Resources & AI Usage](#resources--ai-usage)

---

## Description

### Overview
**PetLink** addresses the real-world challenge of connecting pet owners with trusted pet sitters and caregivers. The application features pet profile registration, caregiver availability scheduling, interactive user discovery, 1-on-1 WebSocket chat, booking management, and real-time push notifications.

### Key Highlights
- **Interactive Pet & Sitter Discovery:** Browse sitters, filter by availability, pricing, rating, and accepted pet types.
- **Real-Time WebSocket Communication:** Instant 1-on-1 chat messaging, typing indicators, and user online/offline status tracking.
- **Dual Authentication System:** Standard email/password JWT authentication paired with 42 Intranet OAuth 2.0 single sign-on.
- **Advanced Permissions (RBAC):** Distinct access levels for `Admin` and `User` roles across backend endpoints and frontend views.
- **Event-Driven Notifications:** Real-time push alerts for messages, connections, comments/likes on posts and booking lifecycle updates.
- **Secure Media Management:** Multi-format file uploads (avatars and pet photos) with client/server validation, preview, and storage cleanup.

---

## Modules & Point Calculation

Our team targeted **11 modules** totaling **19 points** (exceeding the mandatory 14-point threshold):

| Category | Module Name | Type | Points | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Web** | Use a framework for both frontend & backend (React + Django) | Major | **2** | Implemented |
| **Web** | Use an ORM for the database (Django ORM) | Minor | **1** | Implemented |
| **Web** | Implement real-time features using WebSockets | Major | **2** | In Progress |
| **Web** | Allow users to interact with other users (Chat, Profiles, Followers) | Major | **2** | In Progress |
| **Web** | Complete notification system for all CRUD actions | Minor | **1** | Implemented |
| **Web** | File upload and management system | Minor | **1** | Implemented |
| **Accessibility** | Support for additional browsers (Chrome, Firefox, Edge/Safari) | Minor | **1** | In Progress |
| **User Mgmt** | Standard user management & authentication | Major | **2** | Implemented |
| **User Mgmt** | Remote authentication with OAuth 2.0 (42 Intranet) | Minor | **1** | Implemented |
| **User Mgmt** | Advanced permissions system & roles (RBAC) | Major | **2** | Implemented |
| **DevOps** | Backend as microservices | Major | **2** | Implemented |
| **TOTAL** | **11 Modules Selected** | | **19 Points** | **In Progress** |

### Module Justifications & Implementation Details

1. **Framework for Both Frontend & Backend (Major - 2 pts)**
   - **Justification:** Essential for clear architectural separation of concerns, high developer productivity, and structured state management.
   - **Implementation:** Built using React 19 with Vite & TypeScript on the client side, and Django REST Framework (DRF) on the server side.

2. **Database ORM (Minor - 1 pt)**
   - **Justification:** Abstracts SQL query logic, prevents SQL injection vulnerabilities, and ensures cross-database migration safety.
   - **Implementation:** Built using Django ORM connected to PostgreSQL for model definition and relational mapping.

3. **Real-Time Features using WebSockets (Major - 2 pts)**
   - **Justification:** Provides instant bi-directional communication for chat and user online status tracking without inefficient polling.
   - **Implementation:** Developed using Django Channels, Daphne ASGI server, and Redis channel layer pub/sub queues.

4. **User Interaction System (Major - 2 pts)**
   - **Justification:** Core requirement enabling pet owners and sitters to connect, message, and form social relationships.
   - **Implementation:** Combines 1-on-1 WebSocket chat, public sitter/owner profile views, and follower connection models.

5. **Complete Notification System (Minor - 1 pt)**
   - **Justification:** Keeps users immediately informed of critical actions across all CRUD events (messages, follower requests, booking updates).
   - **Implementation:** Asynchronous notification worker in `realtime-service` triggered via internal REST signals and WebSocket pushes.

6. **File Upload and Management System (Minor - 1 pt)**
   - **Justification:** Allows pet owners and caregivers to personalize profiles and showcase pets visually with verified assets.
   - **Implementation:** Multi-format file processing (JPEG, PNG, WEBP), MIME validation using `Pillow`, upload preview UI, and file storage cleanup on deletion.

7. **Support for Additional Browsers (Minor - 1 pt)**
   - **Justification:** Ensures universal accessibility and consistent user experience across different browser engines.
   - **Implementation:** Tested and styled for layout consistency and WebSocket fallback handling across Google Chrome, Mozilla Firefox, and Edge/Safari.

8. **Standard User Management & Authentication (Major - 2 pts)**
   - **Justification:** Fundamental security core required for user identification, data isolation, and profile management.
   - **Implementation:** Email/password registration, salted PBKDF2 password hashing, JWT access/refresh token issuance (`simplejwt`), and profile updates.

9. **Remote Authentication with OAuth 2.0 (Minor - 1 pt)**
   - **Justification:** Simplifies onboarding by permitting 42 curriculum students to sign in using their existing single sign-on credentials.
   - **Implementation:** 42 Intranet OAuth 2.0 authorization code flow exchanging tokens and provisioning local JWT user sessions.

10. **Advanced Permissions System & Roles (Major - 2 pts)**
    - **Justification:** Protects administrative routes and enforces strict authorization boundaries based on user authority tiers.
    - **Implementation:** Role-Based Access Control (`Admin` and `User`), DRF permission classes (`IsAdmin`, `isUser`), and soft deletion manager (`ActiveUserManager` & `deleted_at`).

11. **Backend as Microservices (Major - 2 pts)**
    - **Justification:** Decouples REST API HTTP workload from persistent WebSocket connections, ensuring independent scaling and fault tolerance.
    - **Implementation:** Loosely-coupled containers orchestrated with Docker Compose (`core-service`, `realtime-service`, `postgres`, `redis`, `nginx`).

---

## Team Information & Service Ownership

The backend development was split into distinct microservices, while the frontend was engineered by Isabel and Daniela:

### Backend Development Team

| Person | 42 Login | Primary Role | Service Ownership | Django Apps / Scope | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gabriel La Rocque** *(Person A)* | `gde-la-r` | Technical Lead / DevOps | `core-service` & Infrastructure | `auth/`, `api/`, `nginx/`, `docker` | Auth system, JWT issuance, 42 OAuth 2.0, soft deletion system (`ActiveUserManager` & `deleted_at`), DRF custom permissions (`IsAdmin`, `IsModerator`, `IsOwnerOrAdmin`), microservices Docker Compose & Nginx HTTPS proxy. |
| **João Vieira** *(Person B)* | `jpedro-f` | Project Manager / Backend Dev | `core-service` | `accounts/`, `pets/`, `bookings/` | User profile endpoints, pet management, booking workflow, file upload validation, database seeding scripts. |
| **Ricardo Marques** *(Person C)* | `rjesus-d` | Product Owner / Backend Dev | `realtime-service` | `chat/`, `notifications/` | Django Channels & Daphne ASGI setup, Redis channel layer, WebSocket chat consumer, real-time push notifications, cross-browser compatibility testing. |

### Frontend Development Team

| Member | 42 Login | Primary Role | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Isabel Tootill** | `icunha-t` | Project Manager / Frontend Lead | React SPA architecture, client-side routing (React Router v7), real-time WebSocket state integration in React, cross-browser layout QA. |
| **Daniela Santos** | `ddo-carm` | Product Owner / Frontend Lead | Frontend design system & component library, media upload & preview pipeline, accessibility compliance (WCAG 2.1), user experience & booking UI. |

---

## Project Management & Sprint Strategy

### Sprint Architecture (5-Week Execution Plan)

```
main
  └── fullstack              ← merge target during development
        └── issue/<issue-related-branch>
```

- **Week 1 (Foundation):** Environment setup (`docker compose up`), base Django apps (`core-service` & `realtime-service`), PostgreSQL & Redis binding, Nginx routing setup (`/auth/*`, `/api/*`, `/ws/*`).
- **Week 2 (Auth, Profiles & WS Core):** Registration/Login JWT flow, user/pet profile CRUD, Daphne ASGI consumer setup, WebSocket message broadcasting, online presence status.
- **Week 3 (Followers, Permissions & Notifications):** 42 OAuth 2.0 callback flow, RBAC permissions and admin endpoints, followers system, event-triggered WebSocket notification channel groups.
- **Week 4 (Bookings, Services & Media Uploads):** Sitter availability & booking workflow, file upload validation & storage cleanup, HTTPS SSL certificates, cross-browser test pass.
- **Week 5 (Polish, Integration & Delivery):** End-to-end integration, privacy policy & terms pages, soft deletion verification, rate limiting, and README documentation.

---

## Technical Stack

- **Frontend:** React 19, TypeScript, Vite, React Router DOM v7, CSS Modules / Vanilla CSS.
- **Backend Core Service (`core-service`):** Python 3.11, Django 4.2+, Django REST Framework (DRF), `djangorestframework-simplejwt`, `Pillow`, `psycopg2-binary`.
- **Real-Time Service (`realtime-service`):** Python 3.11, Django Channels 4.0+, Daphne ASGI server, `channels_redis`, Redis client.
- **Database & Cache:** PostgreSQL 15 Alpine (relational storage), Redis 7 Alpine (WebSocket pub/sub broker & caching layer).
- **DevOps & Containerization:** Docker, Docker Compose, Nginx Alpine (Reverse proxy & HTTPS SSL termination).

### Database System & Selection Rationale
- **PostgreSQL 15:** Selected as the core database because of its strict ACID compliance, robust relational data integrity for bookings/accounts, and native integration with Django ORM migrations.
- **Redis 7:** Selected as the in-memory data structure store to serve as the high-throughput channel layer for Django Channels WebSockets and to handle API rate-limiting cache.

### Justification for Major Technical Choices
- **React 19 + TypeScript:** Ensures robust compile-time type safety, modular UI component reusability, and fast Hot Module Replacement (HMR) via Vite.
- **Django & Django REST Framework:** Provides built-in security middleware (password hashing, CSRF tokens, SQL injection defense) alongside fast RESTful endpoint generation.
- **Daphne ASGI + Django Channels:** Decouples persistent, long-lived WebSocket connections from standard synchronous HTTP API request/response cycles.
- **Nginx Reverse Proxy:** Performs SSL/TLS termination and routes traffic cleanly across microservices (`/auth/*` and `/api/*` to `core-service`, `/ws/*` to `realtime-service`, `/` to `frontend`).

---

## Microservices Architecture

```
                     +-----------------------+
                     |    Client Browser     |
                     | (Chrome / Firefox /   |
                     |     Edge / Safari)    |
                     +-----------+-----------+
                                 |
                                 | HTTPS / WSS (8080 / 8001)
                                 v
                     +-----------------------+
                     |      Nginx Proxy      |
                     |  (HTTPS + Rev Proxy)  |
                     +---+---------------+---+
                         |               |
       /auth/* & /api/*  |               | /ws/*
                         v               v
    +------------------------+      +------------------------+
    |      core-service      |      |    realtime-service    |
    | (Django REST / Port    |      | (Daphne / WebSockets / |
    |         8000)          |      |       Port 8001)       |
    +-----------+------------+      +-----------+------------+
                |                               |
                | ORM Queries                   | Pub/Sub Broker
                v                               v
    +------------------------+      +------------------------+
    |   PostgreSQL Database  |      |      Redis Cache       |
    |   (Shared Relational   |      |  (Channel Layer + Rate |
    |           DB)          |      |        Limiting)       |
    +------------------------+      +------------------------+
```

---

## Database Schema

The database relies on PostgreSQL mapped via Django ORM.

```
 +----------------------------------+          +----------------------------------+
 |               User               |          |             Follower             |
 +----------------------------------+          +----------------------------------+
 | id                : BigInt       | 1      * | id                : BigInt       |
 | username          : Varchar      |----------| follower_id       : BigInt       |
 | email             : Varchar      |          | following_id      : BigInt       |
 | password          : Varchar      |          +----------------------------------+
 | name              : Varchar      |
 | user_type         : Varchar      |          +----------------------------------+
 | role              : Varchar      |          |               Pet                |
 | avatar            : ImageField   |          +----------------------------------+
 | banner            : ImageField   | 1      * | id                : BigInt       |
 | online_status     : Boolean      |----------| owner_id          : BigInt       |
 | oauth_provider    : Varchar      |          | name              : Varchar      |
 | deleted_at        : DateTime     |          | pet_type          : Varchar      |
 +----------------------------------+          | breed             : Varchar      |
                   |                           | age               : Integer      |
                   | 1                         +----------------------------------+
                   |
                   | *                         +----------------------------------+
 +----------------------------------+          |             Message              |
 |             Booking              |          +----------------------------------+
 +----------------------------------+          | id                : BigInt       |
 | id                : BigInt       |          | sender_id         : Integer      |
 | owner_id          : BigInt       |          | recipient_id      : Integer      |
 | sitter_id         : BigInt       |          | content           : Text         |
 | status            : Varchar      |          | read_at           : DateTime     |
 | start_date        : DateTime     |          | created_at        : DateTime     |
 | end_date          : DateTime     |          +----------------------------------+
 | total_price       : Decimal      |
 +----------------------------------+          +----------------------------------+
                                               |           Notification           |
                                               +----------------------------------+
                                               | id                : BigInt       |
                                               | user_id           : Integer      |
                                               | type              : Varchar      |
                                               | content           : Varchar      |
                                               | reference_id      : Integer      |
                                               | read              : Boolean      |
                                               +----------------------------------+
```

---

## Features List

| Feature | Primary Developer(s) | Description |
| :--- | :--- | :--- |
| **Authentication & 42 OAuth 2.0** | Gabriel (`gde-la-r`) | JWT authentication (register/login/refresh) and 42 Intranet OAuth 2.0 single sign-on callback flow. |
| **Advanced RBAC, Roles & Soft Delete** | Gabriel (`gde-la-r`) | Granular access control (`IsAdmin`, `IsModerator`, `IsOwnerOrAdmin`) and soft deletion system (`ActiveUserManager` & `deleted_at`). |
| **Microservices Setup & DevOps** | Gabriel (`gde-la-r`) | Containerized services with Docker Compose, Nginx SSL reverse proxy, PostgreSQL, and Redis. |
| **User Profiles & Management** | João (`jpedro-f`) | Public sitter/owner profiles, profile editing, user searching, and account management. |
| **Pet & Booking Management** | João (`jpedro-f`) | Pet CRUD, sitter availability scheduling, booking reservation states (pending/confirmed/cancelled). |
| **Media Upload Engine** | João (`jpedro-f`) / Daniela | Avatar/banner file processing, image validation (format/size), storage security, and preview UI. |
| **WebSocket Real-Time Chat** | Ricardo (`rjesus-d`) | Asynchronous 1-on-1 WebSocket chat via Daphne/Channels, online status tracking, and message history REST API. |
| **Notification Engine** | Ricardo (`rjesus-d`) | Real-time push and persistent notifications for messages, followers, and booking updates. |
| **Browser Compatibility** | Ricardo (`rjesus-d`) / Isabel / Daniela | QA testing and styling fixes ensuring full compatibility across Chrome, Firefox, and Edge/Safari. |
| **Frontend React SPA & Routing** | Isabel (`icunha-t`) | Single page application setup with React Router v7, state management, and real-time WebSocket integration. |
| **Design System & UX/Accessibility** | Daniela (`ddo-carm`) | Custom component library, responsive UI design, file upload preview components, and WCAG accessibility compliance. |

---

## Instructions & Setup

### Prerequisites
- [Docker](https://www.docker.com/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0+)
- [Make](https://www.gnu.org/software/make/)

### Quick Start (Single Command Deployment)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-org/ft_transcendence.git
   cd ft_transcendence
   ```

2. **Launch with Makefile (Recommended):**
   ```bash
   make seed
   ```
   *This single command generates `.env` from `.env.example`, boots containers in detached mode, runs database migrations, and seeds test data.*

3. **Alternative Docker Command:**
   ```bash
   cp .env.example .env
   docker compose up --build -d
   docker compose run --rm core-service python manage.py migrate
   docker compose run --rm core-service python manage.py seed
   ```

4. **Access Endpoints:**
   - **Frontend App:** [https://localhost:8080](https://localhost:8080) (or `http://localhost:5173`)
   - **Core Service REST API:** `http://localhost:8080/api/` and `http://localhost:8080/auth/`
   - **Real-Time WebSocket Service:** `ws://localhost:8001/ws/`

---

## Individual Contributions

### Gabriel La Rocque (`gde-la-r`) — Technical Lead / DevOps / Person A
- **Microservices & DevOps:** Authored the `docker-compose.yml`, `Dockerfile`s, and Nginx reverse proxy configuration for SSL termination and route splitting (`/auth/*`, `/api/*`, `/ws/*`).
- **Auth, Permissions & Soft Delete:** Implemented JWT registration, login, token refresh, 42 Intranet OAuth 2.0 integration, custom `ActiveUserManager` soft-delete system (`deleted_at`), and DRF custom permission classes (`IsAdmin`, `IsModerator`, `IsOwnerOrAdmin`).
- **Challenges Overcome:** Resolving Nginx WebSocket upgrade header forwarding to `daphne` and configuring Redis rate-limiting middleware.

### João Vieira (`jpedro-f`) — Project Manager / Backend / Person B
- **User & Pet Management:** Built `users/`, `pets/`, `bookings/`, `services/` endpoints, user profile management, avatar/banner uploads, and database seeding scripts.
- **Media Uploads & Seeding:** Implemented server-side file upload validation for images, automated seeding commands, and booking lifecycle state machines.
- **Challenges Overcome:** Maintaining data integrity and cascade constraints across bookings and pets when accounts are managed.

### Ricardo Marques (`rjesus-d`) — Product Owner / Backend / Person C
- **Real-Time WebSocket Service:** Built `realtime-service` with Django Channels, Daphne ASGI, and Redis channel layers for 1-on-1 chat and online presence detection.
- **Notifications & Browser Support:** Developed the notification consumer and REST history endpoints; conducted cross-browser compatibility testing for Firefox and Edge.
- **Challenges Overcome:** Ensuring synchronization between online status toggles in WebSocket handlers and direct database writes without locking PostgreSQL connections.

### Isabel Tootill (`icunha-t`) — Project Manager / Frontend Lead
- **React SPA Architecture:** Engineered the React 19 single-page application structure, router integration with React Router v7, and client-side view state.
- **Real-Time UI Integration:** Wired WebSocket channels for chat and notifications into React context state, handling connection drops gracefully.
- **Challenges Overcome:** Managing WebSocket reconnect logic with exponential backoff on client disconnections without triggering re-renders.

### Daniela Santos (`ddo-carm`) — Product Owner / Frontend Lead
- **Design System & UI Components:** Created the modular component library (buttons, cards, modals, form controls, badges) and overall design aesthetic.
- **Media Upload UI & Accessibility:** Implemented client-side file upload controls with progress indicators, image previews, and WCAG accessibility standards compliance.
- **Challenges Overcome:** Designing accessible, responsive file upload components that provide immediate feedback and support drag-and-drop mechanics.

---

## Resources & AI Usage

### References & Documentation
- [Django & Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Django Channels & Daphne ASGI Documentation](https://channels.readthedocs.io/)
- [React 19 & Vite Documentation](https://react.dev/)
- [Docker & Docker Compose Specification](https://docs.docker.com/)
- [OAuth 2.0 Authorization Framework (RFC 6749)](https://datatracker.ietf.org/doc/html/rfc6749)
- [W3C Web Content Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/TR/WCAG21/)

### Description of AI Assistance
In compliance with the **42 AI Instructions** guidelines (Chapter I of the project subject):
- **Task Automation:** AI tools were utilized to generate boilerplate Docker Compose configurations, Makefile commands, and initial test seed scripts to reduce repetitive setup work.
- **Debugging & Code Review:** Used AI assistance to audit regex patterns for input validation, Nginx WebSocket header syntax, and complex Django ORM query efficiency.
- **Documentation Synthesis:** AI assisted in formatting markdown structures, point calculations, and ASCII architecture diagrams.
- **Validation:** All AI-generated outputs were critically reviewed, tested, and validated by team members before being merged into the codebase.
