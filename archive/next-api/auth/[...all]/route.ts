import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/platform/auth/auth";

export const { GET, POST } = toNextJsHandler(auth);
