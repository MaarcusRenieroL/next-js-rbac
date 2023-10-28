"use client"

import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface AuthProps {
	session: Session;
}

export default function Auth({ session }: AuthProps) {
	const router = useRouter()
	if (session.user.role === "ADMIN") {
		router.push("/admin");
	} else if (session.user.role === "USER") {
		router.push("/user");
	} else {
		router.push("/login");
	}
	return (
		<>
			<h1>Redirecting....</h1>
		</>
	)
}