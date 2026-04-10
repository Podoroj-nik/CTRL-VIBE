import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { encrypt, decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Необходимы все поля" }, { status: 400 });
    }

    // Check if user exists (Decrypting in memory - okay for now with small DB)
    const allUsers = await prisma.user.findMany();
    const existingUser = allUsers.find((u: any) => {
      try {
        return decrypt(u.email) === email;
      } catch { return false; }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const encryptedEmail = encrypt(email);

    const user = await prisma.user.create({
      data: {
        email: encryptedEmail,
        passwordHash,
        name,
        role: "STUDENT", 
      },
    });

    return NextResponse.json({ 
      message: "Регистрация успешна", 
      userId: user.id 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      error: "Ошибка сервера при регистрации",
      details: error.message 
    }, { status: 500 });
  }
}
