"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { AUTH_COOKIE } from "@/features/auth/constants";

export const getCurrent = async () => {
  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE);

    if (authCookie) {
      try {
        const decodedPayload = jwt.verify(
          authCookie.value,
          process.env.JWT_SECRET!,
        );

        return decodedPayload;
      } catch (error) {
        console.log(error);

        return null;
      }
    }

    return null;
  } catch (error) {
    console.log(error);

    return null;
  }
};
