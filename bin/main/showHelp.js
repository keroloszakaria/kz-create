export default function showHelp() {
  console.log(`\n🚀 Wakeb CLI - Vue 3 Development Tool
    Usage:
      wb <command>

    Commands:
      create        Create a new CRUD module with form schemas
      add:module    Add a common reusable module
      add:component Add a common component
      help          Show help message

    Examples:
      wb create
      wb add:module
      wb add:component
      wb help
  `);
}
