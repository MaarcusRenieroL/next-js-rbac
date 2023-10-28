import prisma from "@/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod"



const registerFormSchema = z
	.object({
		email: z.string({
			required_error: ""
		}).email("Invalid email address"),
		password: z.string()
	})

export async function POST(request: NextRequest, response: NextResponse) {
	const body = await request.json()
	const { email, password } = registerFormSchema.parse(body);

	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (existingUser) {
			throw new Error("User already exists");
		}
		const hashPassword = await bcrypt.hash(password, 16);
		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: hashPassword,
			},
		});

		if (newUser) {
			return NextResponse.json({ ...newUser }, { status: 201 });
		}
	} catch (error) {

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 409 });
		}
	}

}