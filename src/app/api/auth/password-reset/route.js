import bcrypt from 'bcryptjs';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, oldPassword, newPassword } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse('Invalid email or password', { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.hashedPassword);

    if (!passwordMatch) {
      return new NextResponse('Invalid email or password', { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    return new NextResponse('Password reset successful', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred during password reset', { status: 500 });
  }
}
