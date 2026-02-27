const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "spdgamerz@gmail.com"; // Promoting this user
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'admin' }
        });
        console.log(`SUCCESS: User ${user.email} is now an ADMIN.`);
    } catch (error) {
        console.error("Update error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
