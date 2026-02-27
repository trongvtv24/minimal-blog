import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@minimalfocus.com' },
        update: {},
        create: {
            email: 'admin@minimalfocus.com',
            passwordHash,
            name: 'Admin',
        },
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Email: admin@minimalfocus.com');
    console.log('🔑 Password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
