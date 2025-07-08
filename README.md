# Wakeb CLI 🚀

A powerful Vue 3 development tool for rapid CRUD module generation, component management, and project scaffolding.

## Features

- **🔧 CRUD Generation**: Auto-generate complete CRUD modules with forms, views, and routing
- **📝 Smart Schema Generation**: Parse payload formats to auto-generate form schemas
- **🧩 Component Management**: Add and manage reusable components
- **📦 Module System**: Organize your Vue 3 project with modular architecture
- **🎨 Template Support**: Modal and Pages layout templates
- **🚀 Auto-routing**: Automatic router configuration
- **📱 Sidebar Integration**: Auto-update navigation sidebar
- **🔄 Interactive CLI**: User-friendly prompts and choices

## Installation

### Global Installation

```bash
npm install -g wakeb-cli
```

### Local Installation

```bash
npm install --save-dev wakeb-cli
```

## Usage

### Quick Start

```bash
wb
```

### Available Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `wb create`        | Create a new CRUD module with form schemas |
| `wb add:module`    | Add a common reusable module               |
| `wb add:component` | Add a common component                     |
| `wb help`          | Show help message                          |

## Commands in Detail

### 1. Create CRUD Module

```bash
wb create
```

**What it does:**

- Creates complete CRUD functionality (Create, Read, Update, Delete)
- Generates form schemas from payload data
- Sets up routing automatically
- Integrates with sidebar navigation
- Supports both Modal and Pages layouts

**Interactive Process:**

1. **Module Name**: Enter module name (e.g., `user`, `product`)
2. **Multiple CRUDs**: Choose if module has multiple CRUD operations
3. **Layout Type**: Select between Modal or Pages layout
4. **Help Models**: Specify related models (comma-separated)
5. **Help Enums**: Specify enums (comma-separated)
6. **Schema Generation**: Auto-generate form schema from payload
7. **Sidebar Integration**: Add to navigation sidebar

**Example:**

```bash
wb create
# Follow prompts:
# Module name: users
# Layout: Modal
# Help models: roles, departments
# Help enums: status, priority
```

### 2. Add Module

```bash
wb add:module
```

**What it does:**

- Adds pre-built common modules
- Shows available vs installed modules
- Supports batch selection
- Handles overwrite confirmation

**Features:**

- ✅ Shows installed modules
- ⬜ Shows available modules
- 📦 Checkbox selection interface
- ⚠️ Overwrite protection

### 3. Add Component

```bash
wb add:component
```

**What it does:**

- Adds reusable Vue components
- Supports folder structure navigation
- Batch component selection
- Smart conflict resolution

**Features:**

- 🧩 Component browser
- 📁 Folder navigation
- ✅ Bulk selection
- 🔄 Overwrite handling

## Project Structure

Wakeb CLI expects and creates the following structure:

```
src/
├── modules/
│   ├── users/
│   │   ├── views/
│   │   │   ├── Users.vue
│   │   │   └── UserForm.vue
│   │   ├── schema/
│   │   │   └── users.js
│   │   └── router/
│   │       └── index.js
│   └── products/
│       └── ...
├── components/
│   └── common/
│       ├── forms/
│       ├── tables/
│       └── ...
└── data/
    └── sidebarLinks.js
```

## Schema Generation

### Payload Format Support

The CLI can parse various payload formats and generate form schemas:

```javascript
// Input payload format
user.name: John Doe
user.email: john@example.com
user.age: 30
user.active: true
user.role_id: select
user.created_at: 2023-05-20
user.login_time: 14:30
```

### Generated Schema

```javascript
export const userSchema = {
  "user.name": "text",
  "user.email": "text",
  "user.age": "number",
  "user.active": "checkbox",
  "user.role_id": "select",
  "user.created_at": "date",
  "user.login_time": "time",
};
```

### Supported Field Types

- `text` - Text input
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox
- `radio` - Radio buttons
- `number` - Number input
- `date` - Date picker
- `time` - Time picker
- `password` - Password input
- `phone` - Phone number
- `email` - Email input
- `file` - File upload
- `image` - Image upload
- `editor` - Rich text editor
- `otp` - One-time password
- `captcha` - Captcha field

## Configuration

### String Utilities

The CLI includes powerful string transformation utilities:

```javascript
import { toKebabCase, toCamelCase, toSnakeCase } from "./stringUtils.js";

// Examples
toKebabCase("UserProfile"); // → 'user-profile'
toCamelCase("user-profile"); // → 'userProfile'
toSnakeCase("UserProfile"); // → 'user_profile'
```

### Template System

- **Modal Layout**: Popup-based CRUD operations
- **Pages Layout**: Full-page CRUD operations
- **Placeholder System**: Dynamic content replacement
- **Component Templates**: Reusable UI components

## Advanced Features

### Auto-routing

Automatically updates `router/index.js` with new routes:

```javascript
{
  path: "/users",
  name: "users",
  component: () => import("@/modules/users/views/Users.vue"),
  meta: {
    is_searchable: true,
    name: "users",
  },
}
```

### Sidebar Integration

Auto-updates `sidebarLinks.js` with navigation:

```javascript
{
  to: "/users",
  name: "sidebar.users",
  permissions: "*",
  hipath: "icons.users",
}
```

### Help Models & Enums

Support for related data:

```javascript
// Auto-generated in components
const tables = ["roles", "departments"];
const enums = ["status", "priority"];

await Promise.all([
  enumsStore.getHelpEnums(enums),
  enumsStore.getHelpModels(tables),
]);
```

## Examples

### Creating a User Management Module

```bash
wb create
# Module name: users
# Multiple CRUDs: No
# Layout: Modal
# Help models: roles, departments
# Help enums: status
# Schema: Yes
# Sidebar: Yes
# Icon: users
```

### Adding Authentication Components

```bash
wb add:component
# Select: 📁 auth
# Choose: LoginForm, RegisterForm, ForgotPassword
```

### Bulk Module Installation

```bash
wb add:module
# Select multiple modules:
# ✅ authentication
# ⬜ file-manager
# ⬜ notifications
```

## Best Practices

1. **Module Naming**: Use singular names (`user`, not `users`)
2. **Schema First**: Always define schema before creating views
3. **Help Models**: Define related models for better UX
4. **Consistent Icons**: Use consistent icon naming
5. **Template Reuse**: Leverage existing templates

## Troubleshooting

### Common Issues

**Module already exists**

- Use the overwrite option or choose different name

**Invalid router format**

- Check `router/index.js` syntax
- Ensure proper export format

**Schema generation fails**

- Verify payload format
- Check field type mappings

**Component conflicts**

- Use selective installation
- Handle overwrite prompts

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: keroloszakaria@wakeb.com
- 🐛 Issues: [GitHub Issues](https://github.com/keroloszakaria/issues)
- 📚 Docs: [Documentation](https://keroloszakaria.surge.sh)

---

Made with ❤️ by the Wakeb Team
