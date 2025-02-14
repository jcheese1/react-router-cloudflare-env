import { createCookieSessionStorage } from "react-router";
import { getEnv } from "./env.server";

export const SESSION_KEY_ADDRESS = "number";

type SessionData = {
	[SESSION_KEY_ADDRESS]: string;
};

type SessionFlashData = {
	error: string;
};

export const sessionStorage = () => {
	const { getSession, commitSession, destroySession } =
		createCookieSessionStorage<SessionData, SessionFlashData>({
			cookie: {
				name: "__session",
				sameSite: "lax",
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 30, // 30 days
				secrets: [getEnv().SUPER_SECRET],
				secure: import.meta.env.PROD,
			},
		});

	return { getSession, commitSession, destroySession };
};
