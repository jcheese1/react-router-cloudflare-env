import { type } from "arktype";
import { getContext } from "hono/context-storage";
import type { HonoEnv } from "server";

export const env = type({
	PUBLIC_ENV: "string",
	SUPER_SECRET: "string",
});

export type Env = typeof env.infer;

export type PublicEnv = {
	[K in keyof Env as K extends `PUBLIC_${string}` ? K : never]: Env[K];
};

// server-only env
export function getEnv() {
	return getContext<HonoEnv>().var;
}

export function init() {
	const parsed = env(getEnv());

	if (parsed instanceof type.errors) {
		console.error("❌ Invalid environment variables:", parsed.summary);

		throw new Error("Invalid environment variables");
	}
}

// client-safe env
export function getPublicEnv() {
	const env = getEnv();

	return Object.fromEntries(
		Object.entries(env).filter(([key]) => key.startsWith("PUBLIC_")),
	) as PublicEnv;
}

type ENV = ReturnType<typeof getPublicEnv>;

declare global {
	var ENV: ENV;
	interface Window {
		ENV: ENV;
	}
}
