import prisma from "@/prisma"

export const connectToDB = async () => {
	try {
		await prisma.$connect();
	} catch (error: any) {
		throw new Error(error);
	} 
}