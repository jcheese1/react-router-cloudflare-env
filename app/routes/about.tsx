import type { Route } from "./+types/about";

export function loader({ context }: Route.LoaderArgs) {
	const message = "yo";
	return {
		message,
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <div>About</div>;
}
