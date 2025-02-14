// load-context.ts
import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy, "dispose">;

declare module "react-router" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		extra: string;
	}
}

type GetLoadContext = (args: {
	request: Request;
	context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
	return {
		...context,
		extra: "stuff",
	};
};
