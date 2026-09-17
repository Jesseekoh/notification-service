# API Gateway Service

The **API Gateway** is the single entry point for client HTTP requests in the Distributed Notification Service architecture. It handles request validation, file uploads (such as email template files), and routes operations to downstream microservices over TCP.

---

## Features

- **RESTful Endpoints**: Unified API surface for Users, Templates, and Notifications.
- **Multipart Upload Support**: Handles Handlebars template file uploads via Multer memory storage.
- **Validation**: Global `ValidationPipe` with payload whitelisting and auto-transformation using `class-validator` and `class-transformer`.
- **Error Mapping**: Intercepts TCP RPC microservice exceptions and translates them into appropriate HTTP status codes via `SharedRpcToHttpExceptionFilter`.

---

## Environment Configuration

Create a `.env` file in `apps/api-gateway/.env` (or copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable   |   Type   |    Default    | Description                                               |
| :--------- | :------: | :-----------: | :-------------------------------------------------------- |
| `PORT`     | `number` |    `3000`     | HTTP port on which the server listens                     |
| `NODE_ENV` | `string` | `development` | Runtime environment (`development`, `production`, `test`) |

---

## Downstream Microservice Connections

The API Gateway connects to internal microservices via TCP:

| Service                | Host        | Port   | Transport |
| :--------------------- | :---------- | :----- | :-------- |
| `USERS_SERVICE`        | `localhost` | `3001` | TCP       |
| `TEMPLATES_SERVICE`    | `localhost` | `3002` | TCP       |
| `NOTIFICATION_SERVICE` | `localhost` | `3003` | TCP       |

---

## Available Scripts

From the repository root:

```bash
# Start API Gateway in development mode
bun x turbo dev --filter=api-gateway

# Build the application
bun x turbo build --filter=api-gateway

# Run unit tests
bun x turbo test --filter=api-gateway

# Run linting
bun x turbo lint --filter=api-gateway
```

Or from inside `apps/api-gateway`:

```bash
bun run dev
bun run build
bun run test
bun run lint
```
