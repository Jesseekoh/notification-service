# Templates Microservice

The **Templates Microservice** is responsible for storing, managing, and rendering email templates dynamically using the **Handlebars** template engine.

---

## Features

- **Template Persistence**: Stores template metadata, required variable schemas, and raw template markup in MongoDB.
- **Dynamic Handlebars Rendering**: Fast interpolation of template variables into clean HTML/text bodies.
- **CRUD Message Handlers**: Full template lifecycle management (create, list, get, update, delete).

---

## Environment Configuration

Create a `.env` file in `apps/templates/.env` (or copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable      |   Type   |                      Default                       | Description              |
| :------------ | :------: | :------------------------------------------------: | :----------------------- |
| `MONGODB_URI` | `string` | `mongodb://localhost:27017/notification_templates` | MongoDB connection URI   |
| `NODE_ENV`    | `string` |                   `development`                    | Runtime environment mode |

---

## TCP Message Patterns

Listens on TCP port **3002**:

| Pattern                       | Payload                        | Returns      | Description                                |
| :---------------------------- | :----------------------------- | :----------- | :----------------------------------------- |
| `{ cmd: 'template.create' }`  | `{ name, content, variables }` | `Template`   | Creates a new template                     |
| `{ cmd: 'template.findAll' }` | `{}`                           | `Template[]` | Retrieves all templates                    |
| `{ cmd: 'template.findOne' }` | `id: string`                   | `Template`   | Retrieves a template by ID                 |
| `{ cmd: 'template.update' }`  | `{ id, ...data }`              | `Template`   | Updates a template                         |
| `{ cmd: 'template.delete' }`  | `id: string`                   | `Template`   | Deletes a template                         |
| `{ cmd: 'template.render' }`  | `{ templateId, variables }`    | `string`     | Compiles Handlebars content with variables |

---

## Available Scripts

From the repository root:

```bash
# Start Templates service in development mode
bun x turbo dev --filter=templates

# Build the application
bun x turbo build --filter=templates

# Run unit tests
bun x turbo test --filter=templates

# Run linting
bun x turbo lint --filter=templates
```
