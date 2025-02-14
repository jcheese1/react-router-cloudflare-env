import { LIST } from "~/const";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<Welcome />
			<ul>
				{LIST().map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	);
}
