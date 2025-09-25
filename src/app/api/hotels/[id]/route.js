import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(){
  return NextResponse.json({name:"Testing Hotel"})
}
