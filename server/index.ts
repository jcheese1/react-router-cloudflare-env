import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { type Env, type HonoEnv, getPublicEnv, init } from "~/env.server";

const global = globalThis as typeof globalThis & {
	__context: Env;
};

export const initializePublicEnv = () => {
	if (!global.ENV) {
		global.ENV = getPublicEnv();
	}
	return global.ENV;
};

const app = new Hono<HonoEnv>();

app.use(contextStorage());

app.use(async (c, next) => {
	for (const [key, value] of Object.entries(c.env as Env)) {
		c.set(key as keyof Env, value);
	}

	init();
	initializePublicEnv();

	await next();
});

export default app;
