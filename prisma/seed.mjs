import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const initialProducts = [
    { title: "Colorful Clown Mask Art Silicone Case", price: 699, rating: 5, reviews: 12, image: "/images/clown_mask_case.png", featured: true },
    { title: "Korean Culture Celebration Silicone Case", price: 749, rating: 5, reviews: 8, image: "/images/korean_culture_case.png", featured: true },
    { title: "Retro Denim Charm Silicone Case", price: 699, rating: 4, reviews: 15, image: "/images/retro_denim_case.png", featured: true },
    { title: "Adorable Animals Charm Silicone Case", price: 799, rating: 5, reviews: 20, image: "/images/animal_charm_case.png", featured: true },
];

async function main() {
    console.log('Seeding products...');
    for (const p of initialProducts) {
        await prisma.product.create({
            data: p
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
