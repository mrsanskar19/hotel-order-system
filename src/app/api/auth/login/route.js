import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing Info", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user?.hashedPassword) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!isCorrectPassword) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return NextResponse.json({ token, user });
  } catch (error) {
    console.log(error, "LOGIN_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

