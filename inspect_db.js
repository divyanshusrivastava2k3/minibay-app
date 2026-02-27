const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- DATABASE INSPECTION ---");
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        console.log("Users Data:");
        console.log(JSON.stringify(users, null, 2));

        const admins = users.filter(u => u.role === 'admin');
        if (admins.length === 0) {
            console.log("WARNING: No admin user found in database!");
        } else {
            console.log(`Admins found: ${admins.length}`);
        }
    } catch (error) {
        console.error("Database query error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
