import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log("Profile API - Session status:", session ? "Found" : "Not Found");

        if (!session) {
            return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 });
        }

        if (!session.user?.email) {
            return NextResponse.json({ error: "Unauthorized - No email in session" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        console.log("Profile API - User in DB:", user ? "Yes" : "No");

        if (!user) {
            return NextResponse.json({ error: `User record not found for: ${session.user.email}` }, { status: 404 });
        }

        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Profile GET error detailed:", error);
        return NextResponse.json({
            error: "Failed to fetch profile",
            details: error.message
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, currentPassword, newPassword, shippingAddress, billingAddress } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
        if (billingAddress !== undefined) updateData.billingAddress = billingAddress;

        // Password change logic
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password required to set new password" }, { status: 400 });
            }

            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData
        });

        const { password: _, ...finalUser } = updatedUser;
        return NextResponse.json({ message: "Profile updated successfully", user: finalUser });
    } catch (error) {
        console.error("Profile PATCH error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
