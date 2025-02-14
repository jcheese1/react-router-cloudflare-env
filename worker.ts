import { DurableObject } from "cloudflare:workers";
import handle from "hono-react-router-adapter/cloudflare-workers";
// @ts-ignore
import * as build from "./build/server";
import { getLoadContext } from "./load-context";
import server from "./server";

export class Counter extends DurableObject {
	async getCounterValue() {
		const value = (await this.ctx.storage.get("value")) || 0;
		return value;
	}

	async increment(amount = 1) {
		let value: number = (await this.ctx.storage.get("value")) || 0;
		value += amount;
		await this.ctx.storage.put("value", value);
		return value;
	}

	async decrement(amount = 1) {
		let value: number = (await this.ctx.storage.get("value")) || 0;
		value -= amount;
		await this.ctx.storage.put("value", value);
		return value;
	}
}

export default handle(build, server, { getLoadContext });
