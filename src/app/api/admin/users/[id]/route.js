import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate total spending
        const totalSpent = user.orders.reduce((acc, order) => acc + order.total, 0);

        return NextResponse.json({
            ...user,
            totalSpent
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
    }
}
