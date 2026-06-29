import { cookies } from "next/headers";
import { prisma } from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bainsla-music-os-secret-key-2024";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export async function createToken(user: SessionUser): Promise<string> {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      phone: true,
    },
  });
  return user;
}

export function hasPermission(
  userRole: string,
  allowedRoles: string[]
): boolean {
  return allowedRoles.includes(userRole);
}

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];
export const ALL_STAFF_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "YOUTUBE_MANAGER",
  "COPYRIGHT_MANAGER",
  "DESIGNER",
  "STUDIO_STAFF",
  "VIDEO_TEAM",
  "ACCOUNTANT",
];
