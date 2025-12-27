const { PrismaClient } = require('@prisma/client');

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle connection errors gracefully
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.error('📍 Please check your DATABASE_URL in .env file');
    const dbHost = process.env.DATABASE_URL?.match(/postgresql:\/\/[^:]+:[^@]+@([^:]+):/)?.[1];
    if (dbHost) {
      console.error(`🌐 Trying to connect to: ${dbHost}`);
    }
    console.error('\n💡 Quick fixes:');
    console.error('   1. Use local database: Change host to "localhost" in .env');
    console.error('   2. Start PostgreSQL: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=ashish postgres');
    console.error('   3. Check if remote database is accessible\n');
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

