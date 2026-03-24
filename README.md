# Ft_transcendence planning

## Devops (Gabriel)

### Tech stack
- Docker && Docker-compose
- Nginx
- Documentation (Swagger)

### Tasks
- Check that frontend is using everything backend has to ofer (all microservices endpoints)
- Implement search filter
- Dockerize the project

## Backend

### Team 
- Gabriel (Techinical Lead && Developer)
- João (Project Manager && Developer)
- Ricardo (Product Owner && Developer)

### Tasks
- Microservices (docker/docker-compose, API getway, service communication)
- Auth permission (JWT, json web token)
- DataBase

### Tech stack
- Node.js with typeScript
- Framework (Next.js)
- DB (To be decided, PostgreSQL mb?)
- Communication (Rabbitmq + Redis)
- Web socket (Socket.io)
- Security (Passport.js)

## Frontend

### Team
- Daniela (Product Owner && Developer)
- Isabel (Project Manager && Developer)

### Tech stack
- Framework (React or next.js)
- Microservices management (ReactQuery)
- Styling (Tailwind CSS)

### Tasks
- Real-time chat
- Notifications
- Profile dashboard
- Swipe interface (tinder like)?

# Development Roadmap
### Phase 1: Infrastructure (The "Fullstack" Bridge)
- Dockerization: Setup docker-compose with nginx, postgres, and redis.

- API Gateway: Configure Nginx to route /api to Backend and / to Frontend.

- Shared Types: Create a shared package/folder for TypeScript interfaces used by both fronted and backend.

### Phase 2: Core Backend Services
- Auth Service: 42 OAuth implementation, JWT generation, and 2FA (Google Authenticator).

- User Service: Profile management, stats, and "Swipe" logic data.

- Chat Service: Room-based architecture (Direct Messages, Channels, Protected Rooms).

- Game Service: Server-side Physics engine (The source of truth for Pong to prevent cheating).

### Phase 3: Frontend Experience
- Dashboard: User stats, match history, and friend lists.

- The Arena: Responsive Pong canvas with low-latency socket updates.

- Social Hub: Floating chat window and notification system.

- The Swipe (Bonus): Tinder-like interface to find new opponents/friends.

# Security Checklis
- 2FA: Mandatory implementation (SMS or TOTP).

- Input Validation: Use class-validator in Nest.js to sanitize all incoming data.

- Protected Routes: JWT-guarded endpoints and HttpOnly Cookies for token storage.

> [!Note]
> Anything can be changed after the next meeting, nothing here is mandatory


> [!Testing]
> Adding more text just to test main ruleset