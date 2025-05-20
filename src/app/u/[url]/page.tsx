import { createClient } from "@libsql/client";
import { redirect } from "next/navigation";

const turso = createClient({
	url: process.env.TURSO_DATABASE_URL || "",
	authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export default async function urlRedirect(props: { params: Promise<{ url: string }> }) {
	const params = await props.params;

	const parsedURLId = params.url;

	if (!parsedURLId) {
		return (
			<div className="flex flex-col items-center justify-center pt-20">
				<h1 className="text-5xl font-bold">Malcolm's URL Shortener</h1>
				<p className={"text-3xl font-bold text-[#ff3b30]"}>Invalid URL ID Provided</p>
			</div>
		);
	}

	const { rows } = await turso.execute("SELECT url FROM urls WHERE urlName = ?", [
		parsedURLId,
	]);

	if (rows.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center pt-20">
				<h1 className="text-5xl font-bold">Malcolm's URL Shortener</h1>
				<p className={"text-3xl font-bold text-[#ff3b30]"}>Short URL Not Found</p>
			</div>
		);
	}

	const redirectURL = rows[0].url as string;

	if (redirectURL) {
		redirect(redirectURL);
	} else {
		return (
			<div className="flex flex-col items-center justify-center pt-20">
				<h1 className="text-5xl font-bold">Malcolm's URL Shortener</h1>
				<p className={"text-3xl font-bold text-[#ff3b30]"}>
					Error: Redirect URL is Empty
				</p>
			</div>
		);
	}
}
