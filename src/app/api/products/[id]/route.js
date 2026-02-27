import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id }
        });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        console.log('PATCH Request Data for id:', id, data);

        const product = await prisma.product.update({
            where: { id },
            data: {
                title: data.title,
                price: parseFloat(data.price) || 0,
                originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
                description: data.description,
                image: data.image,
                category: data.category,
                featured: !!data.featured
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('PATCH Error details:', error);
        return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
