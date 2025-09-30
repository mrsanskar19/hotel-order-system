import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ message: "Missing Info" }, { status: 400 });
    }

    const [user] = await prisma.hotel.findMany({
      where: {
        username: username,
      },
    });

    if (!user || !user?.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password
    );

    const isPasswordMatch = password === user.password;

    if (isCorrectPassword || isPasswordMatch) {
      
      const token = jwt.sign({ userId: user.hotel_id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return NextResponse.json({ token, user });
    }
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.log(error, "LOGIN_ERROR");
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
