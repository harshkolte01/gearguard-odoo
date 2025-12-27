#!/usr/bin/env node

/**
 * Database Connection Checker
 * Run this script to verify your database connection
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkConnection() {
  console.log('🔍 Checking database connection...\n');
  
  // Extract database details
  const dbUrl = process.env.DATABASE_URL || 'Not set';
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (match) {
    const [, user, , host, port, database] = match;
    console.log('📋 Connection Details:');
    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   User: ${user}`);
    console.log(`   Database: ${database}`);
    console.log('');
  }

  try {
    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Test query executed successfully!');
    console.log('   Result:', result);
    console.log('');

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables in database:`);
      tables.forEach(t => console.log(`   - ${t.tablename}`));
      console.log('');
    } else {
      console.log('⚠️  No tables found. You may need to run:');
      console.log('   npx prisma db push');
      console.log('   npm run seed\n');
    }

    // Check for users
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Found ${userCount} users in database`);
      
      if (userCount === 0) {
        console.log('\n⚠️  No users found. Run seed script:');
        console.log('   npm run seed\n');
      }
    } catch (e) {
      console.log('⚠️  Could not query users table. Run migrations:');
      console.log('   npx prisma db push\n');
    }

    console.log('🎉 Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting steps:');
    console.error('');
    console.error('1. Check if PostgreSQL is running:');
    if (match && match[3] === 'localhost') {
      console.error('   Windows: services.msc (look for postgresql)');
      console.error('   Linux: sudo systemctl status postgresql');
      console.error('   Docker: docker ps (check for postgres container)');
    } else {
      console.error(`   Ping the server: ping ${match ? match[3] : 'your-db-host'}`);
      console.error(`   Check firewall: telnet ${match ? match[3] : 'your-db-host'} ${match ? match[4] : '5432'}`);
    }
    console.error('');
    console.error('2. Use Docker to start PostgreSQL:');
    console.error('   docker run -d --name gearguard-db -p 5432:5432 \\');
    console.error('     -e POSTGRES_USER=ashish \\');
    console.error('     -e POSTGRES_PASSWORD=ashish \\');
    console.error('     -e POSTGRES_DB=gearguard \\');
    console.error('     postgres:15');
    console.error('');
    console.error('3. Update .env to use localhost:');
    console.error('   DATABASE_URL="postgresql://ashish:ashish@localhost:5432/gearguard"');
    console.error('');
    console.error('4. Then run:');
    console.error('   npx prisma db push');
    console.error('   npm run seed');
    console.error('');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();

