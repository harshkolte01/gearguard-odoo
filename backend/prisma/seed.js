const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Hash password once for all users (Password@123)
  console.log('🔐 Hashing passwords...');
  const passwordHash = await bcrypt.hash('Password@123', 12);
  console.log('✅ Password hashed\n');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Clearing existing data...');
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.equipmentCategory.deleteMany({});
  await prisma.workCenter.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // 1. CREATE USERS
  console.log('👥 Creating users...');
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@gearguard.com',
      password_hash: passwordHash,
      role: 'admin',
    },
  });
  console.log('  ✓ Admin created:', admin.email);

  const manager = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'manager@gearguard.com',
      password_hash: passwordHash,
      role: 'manager',
    },
  });
  console.log('  ✓ Manager created:', manager.email);

  const techMech1 = await prisma.user.create({
    data: {
      name: 'Mike Rodriguez',
      email: 'mike.tech@gearguard.com',
      password_hash: passwordHash,
      role: 'technician',
    },
  });
  console.log('  ✓ Technician created:', techMech1.email);

  const techMech2 = await prisma.user.create({
    data: {
      name: 'James Wilson',
      email: 'james.tech@gearguard.com',
      password_hash: passwordHash,
      role: 'technician',
    },
  });
  console.log('  ✓ Technician created:', techMech2.email);

  const techElec = await prisma.user.create({
    data: {
      name: 'Emily Chen',
      email: 'emily.tech@gearguard.com',
      password_hash: passwordHash,
      role: 'technician',
    },
  });
  console.log('  ✓ Technician created:', techElec.email);

  const techIT = await prisma.user.create({
    data: {
      name: 'David Kumar',
      email: 'david.tech@gearguard.com',
      password_hash: passwordHash,
      role: 'technician',
    },
  });
  console.log('  ✓ Technician created:', techIT.email);

  const portalUser1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@gearguard.com',
      password_hash: passwordHash,
      role: 'portal',
    },
  });
  console.log('  ✓ Portal user created:', portalUser1.email);

  const portalUser2 = await prisma.user.create({
    data: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@gearguard.com',
      password_hash: passwordHash,
      role: 'portal',
    },
  });
  console.log('  ✓ Portal user created:', portalUser2.email);

  const portalUser3 = await prisma.user.create({
    data: {
      name: 'Robert Martinez',
      email: 'robert.martinez@gearguard.com',
      password_hash: passwordHash,
      role: 'portal',
    },
  });
  console.log('  ✓ Portal user created:', portalUser3.email);
  console.log('✅ 9 users created\n');

  // 2. CREATE TEAMS
  console.log('🔧 Creating teams...');
  
  const mechanicalTeam = await prisma.team.create({
    data: {
      name: 'Mechanical Team',
    },
  });
  console.log('  ✓ Team created:', mechanicalTeam.name);

  const electricalTeam = await prisma.team.create({
    data: {
      name: 'Electrical Team',
    },
  });
  console.log('  ✓ Team created:', electricalTeam.name);

  const itTeam = await prisma.team.create({
    data: {
      name: 'IT Support Team',
    },
  });
  console.log('  ✓ Team created:', itTeam.name);
  console.log('✅ 3 teams created\n');

  // 3. CREATE TEAM MEMBERS (Assign technicians to teams)
  console.log('👨‍🔧 Assigning technicians to teams...');
  
  await prisma.teamMember.create({
    data: {
      team_id: mechanicalTeam.id,
      user_id: techMech1.id,
    },
  });
  console.log(`  ✓ ${techMech1.name} → ${mechanicalTeam.name}`);

  await prisma.teamMember.create({
    data: {
      team_id: mechanicalTeam.id,
      user_id: techMech2.id,
    },
  });
  console.log(`  ✓ ${techMech2.name} → ${mechanicalTeam.name}`);

  await prisma.teamMember.create({
    data: {
      team_id: electricalTeam.id,
      user_id: techElec.id,
    },
  });
  console.log(`  ✓ ${techElec.name} → ${electricalTeam.name}`);

  await prisma.teamMember.create({
    data: {
      team_id: itTeam.id,
      user_id: techIT.id,
    },
  });
  console.log(`  ✓ ${techIT.name} → ${itTeam.name}`);
  console.log('✅ Team members assigned\n');

  // 4. CREATE EQUIPMENT CATEGORIES
  console.log('📦 Creating equipment categories...');
  
  const computersCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Computers',
      description: 'Desktop computers, laptops, and workstations'
    }
  });
  console.log('  ✓ Category created:', computersCategory.name);

  const softwareCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Software',
      description: 'Licensed software and applications'
    }
  });
  console.log('  ✓ Category created:', softwareCategory.name);

  const monitorsCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Monitors',
      description: 'Display monitors and screens'
    }
  });
  console.log('  ✓ Category created:', monitorsCategory.name);

  const networkCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Network Equipment',
      description: 'Routers, switches, and network devices'
    }
  });
  console.log('  ✓ Category created:', networkCategory.name);

  const machineryCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Machinery',
      description: 'Industrial machinery and production equipment'
    }
  });
  console.log('  ✓ Category created:', machineryCategory.name);

  const toolsCategory = await prisma.equipmentCategory.create({
    data: {
      name: 'Tools',
      description: 'Hand tools and power tools'
    }
  });
  console.log('  ✓ Category created:', toolsCategory.name);

  console.log('✅ 6 equipment categories created\n');

  // 5. CREATE WORK CENTERS
  console.log('🏭 Creating work centers...');
  
  const productionFloor = await prisma.workCenter.create({
    data: {
      name: 'Production Floor',
      code: 'PROD-001',
      cost_per_hour: 150.00,
      capacity_efficiency: 85.5,
      oee_target: 90.0,
      default_team_id: mechanicalTeam.id,
    },
  });
  console.log(`  ✓ Work center created: ${productionFloor.name} (default team: ${mechanicalTeam.name})`);

  const serverRoom = await prisma.workCenter.create({
    data: {
      name: 'Server Room',
      code: 'IT-001',
      cost_per_hour: 200.00,
      capacity_efficiency: 95.0,
      oee_target: 98.0,
      default_team_id: itTeam.id,
    },
  });
  console.log(`  ✓ Work center created: ${serverRoom.name} (default team: ${itTeam.name})`);
  console.log('✅ 2 work centers created\n');

  // 5. CREATE EQUIPMENT
  console.log('⚙️  Creating equipment...');
  
  const cncMachine = await prisma.equipment.create({
    data: {
      name: 'CNC Milling Machine',
      serial_number: 'CNC-2024-001',
      department: 'Production',
      employee_owner_id: portalUser1.id,
      location: 'Production Floor - Bay A',
      purchase_date: new Date('2023-01-15'),
      warranty_expiry: new Date('2026-01-15'),
      status: 'active',
      maintenance_team_id: mechanicalTeam.id,
      default_technician_id: techMech1.id,
      work_center_id: productionFloor.id,
      category_id: machineryCategory.id,
      health_score: 87.5,
    },
  });
  console.log(`  ✓ Equipment created: ${cncMachine.name}`);
  console.log(`    - Owner: ${portalUser1.name}`);
  console.log(`    - Team: ${mechanicalTeam.name}`);
  console.log(`    - Technician: ${techMech1.name}`);
  console.log(`    - Location: ${productionFloor.name}`);

  const generator = await prisma.equipment.create({
    data: {
      name: 'Industrial Backup Generator',
      serial_number: 'GEN-2024-002',
      department: 'Facilities',
      employee_owner_id: manager.id,
      location: 'Building C - Basement',
      purchase_date: new Date('2022-06-20'),
      warranty_expiry: new Date('2025-06-20'),
      status: 'active',
      maintenance_team_id: electricalTeam.id,
      default_technician_id: techElec.id,
      work_center_id: null,
      category_id: machineryCategory.id,
      health_score: 92.0,
    },
  });
  console.log(`  ✓ Equipment created: ${generator.name}`);
  console.log(`    - Owner: ${manager.name}`);
  console.log(`    - Team: ${electricalTeam.name}`);
  console.log(`    - Technician: ${techElec.name}`);

  const server = await prisma.equipment.create({
    data: {
      name: 'Database Server - Primary',
      serial_number: 'SRV-2024-003',
      department: 'IT',
      employee_owner_id: portalUser2.id,
      location: 'Server Room - Rack 3',
      purchase_date: new Date('2023-09-10'),
      warranty_expiry: new Date('2026-09-10'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: serverRoom.id,
      category_id: computersCategory.id,
      health_score: 98.5,
    },
  });
  console.log(`  ✓ Equipment created: ${server.name}`);
  console.log(`    - Owner: ${portalUser2.name}`);
  console.log(`    - Team: ${itTeam.name}`);
  console.log(`    - Technician: ${techIT.name}`);
  console.log(`    - Location: ${serverRoom.name}`);

  // Create UNASSIGNED equipment for auto-assignment to new portal users
  const laptop1 = await prisma.equipment.create({
    data: {
      name: 'Dell Laptop - Model XPS 15',
      serial_number: 'LAPTOP-2024-004',
      department: 'IT',
      employee_owner_id: null, // Unassigned
      location: 'IT Storage Room - Shelf 2',
      purchase_date: new Date('2024-03-10'),
      warranty_expiry: new Date('2027-03-10'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: null,
      category_id: computersCategory.id,
      health_score: 95.0,
    },
  });
  console.log(`  ✓ Equipment created: ${laptop1.name} (UNASSIGNED)`);

  const printer = await prisma.equipment.create({
    data: {
      name: 'HP Color LaserJet Printer',
      serial_number: 'PRINT-2024-005',
      department: 'Office',
      employee_owner_id: null, // Unassigned
      location: 'Office Floor 2 - Room 205',
      purchase_date: new Date('2024-01-20'),
      warranty_expiry: new Date('2027-01-20'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: null,
      category_id: computersCategory.id,
      health_score: 88.0,
    },
  });
  console.log(`  ✓ Equipment created: ${printer.name} (UNASSIGNED)`);

  const tablet = await prisma.equipment.create({
    data: {
      name: 'iPad Pro 12.9-inch',
      serial_number: 'TABLET-2024-006',
      department: 'IT',
      employee_owner_id: null, // Unassigned
      location: 'IT Storage Room - Shelf 1',
      purchase_date: new Date('2024-05-15'),
      warranty_expiry: new Date('2026-05-15'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: null,
      category_id: computersCategory.id,
      health_score: 98.0,
    },
  });
  console.log(`  ✓ Equipment created: ${tablet.name} (UNASSIGNED)`);

  const monitor = await prisma.equipment.create({
    data: {
      name: 'LG UltraWide Monitor 34"',
      serial_number: 'MONITOR-2024-007',
      department: 'Office',
      employee_owner_id: null, // Unassigned
      location: 'Office Storage - Aisle 3',
      purchase_date: new Date('2024-02-28'),
      warranty_expiry: new Date('2027-02-28'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: null,
      category_id: monitorsCategory.id,
      health_score: 96.5,
    },
  });
  console.log(`  ✓ Equipment created: ${monitor.name} (UNASSIGNED)`);

  const projector = await prisma.equipment.create({
    data: {
      name: 'Epson Conference Room Projector',
      serial_number: 'PROJ-2024-008',
      department: 'Office',
      employee_owner_id: null, // Unassigned
      location: 'Conference Room A',
      purchase_date: new Date('2023-11-10'),
      warranty_expiry: new Date('2026-11-10'),
      status: 'active',
      maintenance_team_id: itTeam.id,
      default_technician_id: techIT.id,
      work_center_id: null,
      category_id: computersCategory.id,
      health_score: 91.0,
    },
  });
  console.log(`  ✓ Equipment created: ${projector.name} (UNASSIGNED)`);

  console.log('✅ 8 equipment items created (3 assigned, 5 unassigned)\n');

  // 6. CREATE MAINTENANCE REQUESTS
  console.log('📋 Creating maintenance requests...');
  
  const request1 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'CNC Machine - Strange Noise During Operation',
      description: 'Machine making unusual grinding noise when cutting metal. Vibration levels higher than normal. Needs immediate inspection.',
      type: 'corrective',
      state: 'in_progress',
      equipment_id: cncMachine.id,
      work_center_id: productionFloor.id,
      team_id: mechanicalTeam.id,
      assigned_technician_id: techMech1.id,
      scheduled_date: null,
      duration_hours: null,
      created_by: portalUser1.id,
    },
  });
  console.log(`  ✓ Request created: ${request1.subject}`);
  console.log(`    - Type: ${request1.type} | State: ${request1.state}`);
  console.log(`    - Equipment: ${cncMachine.name}`);
  console.log(`    - Assigned to: ${techMech1.name}`);
  console.log(`    - Created by: ${portalUser1.name}`);

  const request2 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Generator - Scheduled Quarterly Maintenance',
      description: 'Routine preventive maintenance: oil change, filter replacement, battery check, load test.',
      type: 'preventive',
      state: 'new',
      equipment_id: generator.id,
      work_center_id: null,
      team_id: electricalTeam.id,
      assigned_technician_id: null,
      scheduled_date: new Date('2025-01-15'),
      duration_hours: null,
      created_by: manager.id,
    },
  });
  console.log(`  ✓ Request created: ${request2.subject}`);
  console.log(`    - Type: ${request2.type} | State: ${request2.state}`);
  console.log(`    - Equipment: ${generator.name}`);
  console.log(`    - Scheduled for: 2025-01-15`);
  console.log(`    - Created by: ${manager.name}`);

  const request3 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'Database Server - Cooling System Maintenance',
      description: 'Completed cooling fan cleaning and thermal paste replacement. Server temperatures back to normal.',
      type: 'preventive',
      state: 'repaired',
      equipment_id: server.id,
      work_center_id: serverRoom.id,
      team_id: itTeam.id,
      assigned_technician_id: techIT.id,
      scheduled_date: new Date('2024-12-20'),
      duration_hours: 2.5,
      created_by: admin.id,
    },
  });
  console.log(`  ✓ Request created: ${request3.subject}`);
  console.log(`    - Type: ${request3.type} | State: ${request3.state}`);
  console.log(`    - Equipment: ${server.name}`);
  console.log(`    - Completed in: ${request3.duration_hours} hours`);
  console.log(`    - Created by: ${admin.name}`);

  const request4 = await prisma.maintenanceRequest.create({
    data: {
      subject: 'CNC Machine - Calibration Check',
      description: 'Monthly precision calibration and alignment verification.',
      type: 'preventive',
      state: 'new',
      equipment_id: cncMachine.id,
      work_center_id: productionFloor.id,
      team_id: mechanicalTeam.id,
      assigned_technician_id: techMech2.id,
      scheduled_date: new Date('2025-01-05'),
      duration_hours: null,
      created_by: manager.id,
    },
  });
  console.log(`  ✓ Request created: ${request4.subject}`);
  console.log(`    - Type: ${request4.type} | State: ${request4.state}`);
  console.log(`    - Equipment: ${cncMachine.name}`);
  console.log(`    - Assigned to: ${techMech2.name}`);
  console.log(`    - Scheduled for: 2025-01-05`);
  console.log('✅ 4 maintenance requests created\n');

  console.log('🎉 Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('  - 9 Users (1 admin, 1 manager, 4 technicians, 3 portal)');
  console.log('  - 3 Teams (Mechanical, Electrical, IT)');
  console.log('  - 4 Team member assignments');
  console.log('  - 2 Work centers (Production Floor, Server Room)');
  console.log('  - 8 Equipment items (3 assigned, 5 unassigned for new users)');
  console.log('  - 4 Maintenance requests (various states)');
  console.log('\n✅ All relationships established correctly!');
  console.log('\n🔐 Login credentials for all users:');
  console.log('  Password: Password@123');
  console.log('\n📝 User emails:');
  console.log('  Admin: admin@gearguard.com');
  console.log('  Manager: manager@gearguard.com');
  console.log('  Technicians: mike.tech@, james.tech@, emily.tech@, david.tech@gearguard.com');
  console.log('  Portal Users: john.smith@, lisa.anderson@, robert.martinez@gearguard.com');
  console.log('\n📦 Unassigned Equipment (available for auto-assignment):');
  console.log('  - Dell Laptop XPS 15');
  console.log('  - HP Color LaserJet Printer');
  console.log('  - iPad Pro 12.9-inch');
  console.log('  - LG UltraWide Monitor 34"');
  console.log('  - Epson Conference Room Projector');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


