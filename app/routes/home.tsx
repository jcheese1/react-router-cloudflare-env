import { Form, redirect } from "react-router";
import { LIST } from "~/const";
import { SESSION_KEY_ADDRESS, sessionStorage } from "~/session.server";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const { getSession } = sessionStorage();
	const session = await getSession(request.headers.get("cookie"));
	const number = session.get(SESSION_KEY_ADDRESS);

	return {
		number,
		country: context.cloudflare.cf.country,
		city: context.cloudflare.cf.city,
	};
};

export const action = async ({ request }: Route.ActionArgs) => {
	const { getSession, commitSession } = sessionStorage();

	const session = await getSession(request.headers.get("cookie"));
	const formData = await request.formData();
	const number = formData.get("number");

	session.set(SESSION_KEY_ADDRESS, number as string);

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
			<ul>
				{LIST().map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
			<Form method="post">
				<button type="submit">Set random number on cookie</button>
				<input
					type="text"
					name="number"
					placeholder="Enter a number"
					className="text-white border border-white bg-stone-600"
				/>
			</Form>
			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	);
}
