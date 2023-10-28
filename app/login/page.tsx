"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {useRouter} from "next/navigation"
type LoginInput = {
	email: string;
	password: string;
}

const formSchema = z.object({
	email: z.string({
		required_error: ""
	}).email("Invalid email address"),
	password: z.string()
})

export default function LoginPage() {
	const router = useRouter();
	const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const handleLogin: SubmitHandler<LoginInput> = async (data: LoginInput) => {
		try {
			toast.loading("Logging in...", { id: "login" });
			await signIn("credentials", { ...data, redirect: false });
			toast.success("Logged in successfully!", { id: "login" });
			router.replace("/");
		} catch (error) {
			toast.error("Failed to login!", { id: "login" });
			console.log(error);
		}
	}
	return (
		<>
			<div className="h-screen w-screen flex items-center justify-center">
				<form method="post" onSubmit={handleSubmit(handleLogin)}>
					<Card>
						<CardHeader>
							<CardTitle>
								Login to your account
							</CardTitle>
							<CardDescription>
								Enter your email and password to login
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-2">
								<Label>Email</Label>
								<Input type="email" placeholder="johndoe@gmail.com" {...register("email", {
									required: {
										value: true,
										message: "Email is required!"
									},
								})} />
								<p className="text-red-500 text-xs">
									{errors.email && errors.email.message}
								</p>
							</div>
							<div className="space-y-2">
								<Label>Password</Label>
								<Input type="password" placeholder="*******" {...register("password")} />
								<p className="text-red-500 text-xs">
									{errors.password && errors.password.message}
								</p>
							</div>
						</CardContent>
						<CardFooter className="flex-col items-center justify-center space-y-3 w-full">
							<Button className="w-full" type="submit">
								Login
							</Button>
							<p className="text-sm">
								Don&apos;t have an account? <Link className="hover:underline" href="/register">Register</Link>
							</p>
						</CardFooter>
					</Card>
				</form>
			</div>
		</>
	)
}