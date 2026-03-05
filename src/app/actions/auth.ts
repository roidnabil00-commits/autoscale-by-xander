"use server";

import { cookies } from "next/headers";

export async function setAdminSession() {
  const cookieStore = await cookies();
  
  cookieStore.set("xander_admin_session", "authenticated_admin_xander_systems", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // Berlaku 24 jam
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("xander_admin_session");
}