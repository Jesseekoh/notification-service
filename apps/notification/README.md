# Notification Microservice

The **Notification Microservice** orchestrates notification validation, recipient preference verification, template rendering coordination, and resilient background email dispatching via **BullMQ** and **Resend**.

---

## Features

- **Preference Validation**: Automatically verifies if the recipient has email notifications turned on before processing.
- **In-Memory Caching**: Caches user records (15-min TTL) and preferences (2-min TTL) via `@nestjs/cache-manager` to minimize inter-service overhead.
- **Resilient BullMQ Queue**: Offloads email delivery to an asynchronous BullMQ queue named `email` with 4 attempts and exponential backoff retry policy.
- **Transactional Delivery**: Delivers emails reliably using the official **Resend** SDK.

---

## Environment Configuration

Create a `.env` file in `apps/notification/.env` (or copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable         |   Type   | Required |    Default    | Description                                               |
| :--------------- | :------: | :------: | :-----------: | :-------------------------------------------------------- |
| `RESEND_API_KEY` | `string` | **Yes**  |       -       | Resend API key ([Get a key](https://resend.com/api-keys)) |
| `REDIS_HOST`     | `string` |    No    |  `localhost`  | Redis server hostname for BullMQ queue                    |
| `REDIS_PORT`     | `number` |    No    |    `6379`     | Redis server port                                         |
| `NODE_ENV`       | `string` |    No    | `development` | Runtime environment mode                                  |

---

## Inter-Service Communication

The Notification service connects to:

- **Users Microservice** on TCP `localhost:3001` (retrieves email address and notification preferences).
- **Templates Microservice** on TCP `localhost:3002` (requests template compilation).

---

## TCP Message Patterns

Listens on TCP port **3003**:

| Pattern                             | Payload                                                | Returns                        | Description                                        |
| :---------------------------------- | :----------------------------------------------------- | :----------------------------- | :------------------------------------------------- |
| `{ cmd: 'notification.sendEmail' }` | `{ userId, templateId?, body?, subject?, variables? }` | `{ message: 'queued', jobId }` | Validates, resolves template, and queues email job |

---

## BullMQ Queue & Worker Architecture

- **Queue Name**: `email`
- **Worker**: `EmailConsumer` (processes `sendEmail` jobs asynchronously)
- **Retry Policy**: 4 attempts, exponential backoff
- **Provider**: `Resend` (`https://resend.com`)

---

## Available Scripts

From the repository root:

```bash
# Start Notification service in development mode
bun x turbo dev --filter=notification

# Build the application
bun x turbo build --filter=notification

# Run unit tests
bun x turbo test --filter=notification

# Run linting
bun x turbo lint --filter=notification
```
