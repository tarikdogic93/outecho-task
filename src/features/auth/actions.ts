"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { AUTH_COOKIE } from "@/features/auth/constants";

export const getCurrent = async () => {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE);

    if (authCookie) {
      const { payload } = await jwtVerify(
        authCookie.value,
        new TextEncoder().encode(process.env.JWT_SECRET!),
      );

      return payload;
    }

    return null;
  } catch (error) {
    console.log(error);

    return null;
  }
};
