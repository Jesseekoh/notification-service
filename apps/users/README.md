# Users Microservice

The **Users Microservice** manages user profiles and granular notification preferences. It exposes TCP message handlers consumed by the API Gateway and the Notification Service.

---

## Features

- **User Management**: Creation and retrieval of user accounts stored in MongoDB.
- **Preference Management**: Auto-initializes default notification preferences (`emailNotifications: true`, `pushNotifications: true`) upon user creation, and provides endpoints to view/update preferences.
- **Structured Logging**: Integrated `nestjs-pino` with pretty-printing in development and structured JSON in production.
- **Error Normalization**: Maps MongoDB duplicate key errors (code 11000) to clean HTTP 409 Conflict RPC exceptions.

---

## Environment Configuration

Create a `.env` file in `apps/users/.env` (or copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable      |   Type   |                    Default                     | Description                                                       |
| :------------ | :------: | :--------------------------------------------: | :---------------------------------------------------------------- |
| `MONGODB_URI` | `string` | `mongodb://localhost:27017/notification_users` | MongoDB connection URI                                            |
| `NODE_ENV`    | `string` |                 `development`                  | Setting to `development` enables `pino-pretty` with `debug` level |

---

## TCP Message Patterns

Listens on TCP port **3001**:

| Pattern                                        | Payload                           | Returns                  | Description                          |
| :--------------------------------------------- | :-------------------------------- | :----------------------- | :----------------------------------- |
| `{ cmd: 'user.create' }`                       | `{ email: string, name: string }` | `User`                   | Creates user and default preferences |
| `{ cmd: 'user.getById' }`                      | `id: string`                      | `User`                   | Finds a user by ID or throws 404     |
| `{ cmd: 'user.getNotificationPreference' }`    | `userId: string`                  | `NotificationPreference` | Retrieves preferences for a user     |
| `{ cmd: 'user.updateNotificationPreference' }` | `{ userId, preferences }`         | `NotificationPreference` | Updates preference flags             |

---

## Available Scripts

From the repository root:

```bash
# Start Users service in development mode
bun x turbo dev --filter=users

# Build the application
bun x turbo build --filter=users

# Run unit tests
bun x turbo test --filter=users

# Run linting
bun x turbo lint --filter=users
```
