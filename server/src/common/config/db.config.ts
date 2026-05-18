import { PrismaClient } from "@prisma/client/extension";

const globalForPrisma:any = global
const prisma = new PrismaClient()

if(process.env.NODE_ENV != "production"){
    globalForPrisma.prisma = prisma;
}

export default prisma