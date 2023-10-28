import Auth from "@/components/auth";
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/login");
	}
	return (
		<Auth session={session} />
	)
}
