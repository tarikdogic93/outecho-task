import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateRoboHashAvatar(uniqueString: string) {
  const encodedString = encodeURIComponent(uniqueString);

  const avatarUrl = `${process.env.ROBOHASH_API_URL}${encodedString}.png`;

  try {
    const response = await fetch(avatarUrl, { method: "HEAD" });

    const contentType = response.headers.get("content-type");

    if (response.ok && contentType && contentType.startsWith("image")) {
      return avatarUrl;
    } else {
      console.log(
        "RoboHash image generation failed or invalid image response.",
      );

      return null;
    }
  } catch (error) {
    console.log("Error checking RoboHash avatar:", error);

    return null;
  }
}
