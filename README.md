# KZ-Create CLI Tool

A powerful CLI tool for generating CRUD modules with Vue 3 form schemas, designed to accelerate development by automatically creating complete module structures with intelligent form field detection.

## 🚀 Features

- **Interactive CLI Interface**: Step-by-step prompts for easy module creation
- **Smart Schema Generation**: Automatically generates Vue 3 form schemas from payload data
- **Multiple Layout Support**: Choose between Modal and Pages layouts
- **Intelligent Field Detection**: Automatically detects field types from payload values
- **Multi-language Support**: Built-in support for Arabic/English fields
- **Router Integration**: Automatically updates router configurations
- **Help Models & Enums**: Support for external data sources
- **Template System**: Flexible template-based module generation

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g kz-create
```

### Local Installation

```bash
npm install kz-create
npx kz-create
```

## 🎯 Quick Start

Run the CLI tool in your project directory:

```bash
kz-create
```

The tool will guide you through:

1. **Module Name**: Enter your module name (e.g., `user`, `product`)
2. **Layout Type**: Choose between `Modal` or `Pages`
3. **CRUD Configuration**: Handle existing modules or create new ones
4. **Help Data**: Configure models and enums for dropdowns
5. **Schema Generation**: Auto-generate forms from payload data

## 🔧 Usage Examples

### Basic Module Creation

```bash
kz-create
# Follow prompts:
# Module name: user
# Layout: Modal
# Multiple CRUDs: No
# Help models: categories, tags
# Help enums: user_status, user_roles
```

### Advanced Schema Generation

When prompted for schema generation, you can paste payload data like:

```javascript
title[ar]: منتج جديد
title[en]: New Product
description[ar]: textarea
description[en]: textarea
price: 100
status: true
category_id: 1
tag_ids: [1,2,3]
launch_date: 2023-05-20
phone: phone
email: email
```

The tool will automatically generate:

- **Field Types**: text, textarea, select, checkbox, date, etc.
- **Validation Rules**: Based on field patterns
- **Multi-language Fields**: Arabic/English support
- **Relationship Fields**: Foreign key detection
- **Special Fields**: Phone, email, datetime, etc.

## 📁 Generated Structure

```
src/modules/your-module/
├── locales/
│   ├── ar.json
│   └── en.json
├── router/
│   └── index.js
├── schema/
│   └── yourCrud.js
├── stores/
│   └── yourCrud.js
└── views/
    └── YourCrud.vue
```

## 🎨 Field Type Detection

The tool automatically detects field types based on patterns:

| Pattern      | Generated Type    | Example                   |
| ------------ | ----------------- | ------------------------- |
| `field[ar]`  | Text (Arabic)     | `title[ar]: منتج`         |
| `field[en]`  | Text (English)    | `title[en]: Product`      |
| `*_id`       | Select (Single)   | `category_id: 1`          |
| `*_ids`      | Select (Multiple) | `tag_ids: [1,2,3]`        |
| `true/false` | Checkbox          | `is_active: true`         |
| `YYYY-MM-DD` | Date Picker       | `launch_date: 2023-05-20` |
| `HH:MM`      | Time Picker       | `launch_time: 14:30`      |
| `phone`      | Phone Input       | `phone: phone`            |
| `email`      | Email Input       | `email: email`            |
| `password`   | Password Input    | `password: password`      |
| `textarea`   | Textarea          | `description: textarea`   |
| `image/file` | File Upload       | `avatar: image`           |
| `editor`     | Rich Text Editor  | `content: editor`         |
| `number`     | Number Input      | `price: 100`              |

## 🌐 Multi-language Support

The tool supports multi-language fields:

```javascript
// Input
title[ar]: منتج جديد
title[en]: New Product

// Generated Schema
createTextField({
  key: "title.ar",
  label: "title_ar",
  isArabicOnly: true,
  // ... other props
}),
createTextField({
  key: "title.en",
  label: "title_en",
  isEnglishOnly: true,
  // ... other props
})
```

## 🔗 Help Models & Enums

Configure external data sources for dropdowns:

### Help Models

```bash
# Input: categories, tags, users
# Generates select fields with:
options: computed(() => enumsStore.state["categories"])
itemTitle: "name"
itemValue: "id"
```

### Help Enums

```bash
# Input: user_status, user_roles
# Generates select fields with:
options: computed(() => enumsStore.state["user_status"])
itemTitle: "label"
itemValue: "value"
```

## 🎛️ Generated Schema API

The generated schema uses a composable pattern:

```javascript
import { useUserSchema } from "./schema/user.js";

export default {
  setup() {
    const schema = useUserSchema({
      isCreate: true,
      isView: false,
    });

    return { schema };
  },
};
```

## 📝 Field Configuration Options

Each generated field includes comprehensive configuration:

```javascript
createTextField({
  t, // i18n translation function
  key: "title", // Field key
  label: "title", // Field label
  inputStyle: "flat", // Input styling
  cols: { md: 6, lg: 6 }, // Grid columns
  value: "", // Default value
  required: true, // Validation
  // ... type-specific props
});
```

## 🔄 Router Integration

The tool automatically updates your router configuration:

```javascript
export default [
  {
    path: "/user",
    name: "user",
    component: () => import("@/modules/user/views/User.vue"),
    meta: {
      is_searchable: true,
      name: "user",
    },
  },
];
```

## 🛠️ Advanced Configuration

### Template Customization

Modify templates in the `templates/` directory:

- `templates/modal/` - Modal-based layouts
- `templates/pages/` - Page-based layouts

### Field Utilities

The tool generates imports for field utilities:

```javascript
import {
  createTextField,
  createSelectField,
  createDateTimeField,
} from "@/utils/fieldUtils";
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions:

- Open an issue on [GitHub Issues](https://github.com/yourusername/kz-create/issues)
- Check existing issues for solutions
- Provide detailed reproduction steps

## 🚀 Roadmap

- [ ] TypeScript support
- [ ] Custom field types
- [ ] Theme customization
- [ ] Plugin system
- [ ] Configuration file support
- [ ] Test generation
- [ ] Documentation generation

## 💡 Tips & Best Practices

1. **Use descriptive module names**: `user-management` instead of `user`
2. **Leverage help models**: Define reusable data sources
3. **Follow naming conventions**: Use kebab-case for modules
4. **Test generated schemas**: Always validate form behavior
5. **Customize templates**: Adapt templates to your project needs

---

Made with ❤️ by the KZ-Create team
