import { nanoid } from "nanoid";

export const generateSessionId = (length = 40) => nanoid(length);
