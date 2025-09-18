const { initializeDatabase } = require('../lib/db/init.ts');

async function main() {
  await initializeDatabase();
  process.exit(0);
}

main().catch(console.error);
