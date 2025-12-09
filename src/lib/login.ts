import bcrypt, { compare } from "bcrypt";
import prisma from "@/lib/database/prisma";
import { User } from "../generated/prisma/client";
import { CredentialsSignin } from "next-auth";

export class AuthError extends CredentialsSignin {
  code: string;

  constructor(code: string) {
    super();
    this.code = code;
  }
}

export async function login(
  email: string,
  password: string
): Promise<User | null> {
  try {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthError("USER_NOT_FOUND");
    }

    if (!user.password) {
      throw new AuthError("NO_PASSWORD_SET");
    }

    const isCorrectPass = await compare(password, user.password);

    if (!isCorrectPass) {
      throw new AuthError("INVALID_PASSWORD");
    }

    if (!user.isVerified) {
      throw new AuthError("EMAIL_NOT_VERIFIED");
    }

    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}
