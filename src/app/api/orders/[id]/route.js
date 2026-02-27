import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Security check: Ensure the order belongs to the user or user is admin
        if (order.userId !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Parse items JSON string
        const parsedOrder = {
            ...order,
            items: JSON.parse(order.items)
        };

        return NextResponse.json(parsedOrder);

    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}
