import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items, total, shippingDetails } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 1. Create the order in the database
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total: parseFloat(total),
                status: "processing",
                items: JSON.stringify(items.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    model: item.model
                }))),
                customer: shippingDetails.name // Storing name for quick reference
            }
        });

        // 2. Option: Update user's shipping address if it changed or was empty
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                shippingAddress: shippingDetails.address + ", " + shippingDetails.city + " - " + shippingDetails.pincode
            }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id
        }, { status: 201 });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({
            error: "Failed to process order",
            details: error.message
        }, { status: 500 });
    }
}
