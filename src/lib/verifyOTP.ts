import prisma from "./database/prisma";

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  if (!email || !otp) return false;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return false;
  if (user.otpCode !== otp) return false;

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      otpCode: null,
    },
  });

  return true;
}
