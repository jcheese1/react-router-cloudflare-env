import { Form, type ShouldRevalidateFunction, redirect } from "react-router";
import { SESSION_KEY_ADDRESS, sessionStorage } from "~/session.server";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const { getSession } = sessionStorage();
	const session = await getSession(request.headers.get("cookie"));
	const number = session.get(SESSION_KEY_ADDRESS);

	const id = context.cloudflare.env.COUNTER.idFromName("global");
	const stub = context.cloudflare.env.COUNTER.get(id);

	return {
		number,
		country: context.cloudflare.cf.country,
		city: context.cloudflare.cf.city,
		counter: await stub.getCounterValue(),
	};
};

export function shouldRevalidate(revalidate: ShouldRevalidateFunction) {
	console.log("shouldRevalidate", revalidate);
	return true;
}

export const action = async ({ request, context }: Route.ActionArgs) => {
	const { getSession, commitSession } = sessionStorage();

	const session = await getSession(request.headers.get("cookie"));
	const formData = await request.formData();
	const number = formData.get("number");
	const intent = formData.get("intent");

	const id = context.cloudflare.env.COUNTER.idFromName("global");
	const stub = context.cloudflare.env.COUNTER.get(id);

	if (intent === "increment") {
		await stub.increment();
	} else if (intent === "decrement") {
		await stub.decrement();
	} else if (intent === "set-cookie") {
		session.set(SESSION_KEY_ADDRESS, number as string);
	}

	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<Welcome />

			<Form method="post">
				<button name="intent" value="set-cookie" type="submit">
					Set random number on cookie
				</button>
				<input
					type="text"
					name="number"
					placeholder="Enter a number"
					className="text-white border border-white bg-stone-600"
				/>
				<button name="intent" value="increment" type="submit">
					Increment
				</button>
				<button name="intent" value="decrement" type="submit">
					Decrement
				</button>
			</Form>

			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	);
}
