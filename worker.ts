import handle from "hono-react-router-adapter/cloudflare-workers";
// @ts-ignore
import * as build from "./build/server";
import { getLoadContext } from "./load-context";
import server from "./server";

export default handle(build, server, { getLoadContext });
