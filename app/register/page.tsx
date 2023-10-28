"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

type RegisterInput = {
	email: string;
	password: string;
}

const formSchema = z.object({
	email: z.string({
		required_error: ""
	}).email("Invalid email address"),
	password: z.string()
})


export default function RegisterPage() {
	const router = useRouter();
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const handleLogin: SubmitHandler<RegisterInput> = async (data: RegisterInput) => {
		try {
			toast.loading("Registering in...", { id: "register" });
			await fetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			});
			router.push("/login")
			toast.success("Registered successfully!", { id: "register" });
		} catch (error) {
			toast.error("Failed to register!", { id: "register" });
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
								Create your account
							</CardTitle>
							<CardDescription>
								Enter your email and password to register
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
								Register
							</Button>
							<p className="text-sm">
								Already have an account? <Link className="hover:underline" href="/login">Login</Link>
							</p>
						</CardFooter>
					</Card>
				</form>
			</div>
		</>
	)
}