import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest{
    name: string;
    email: string;
    password:string;
}


class CreateUserService{
    async execute({name, email, password}: UserRequest) {

        //verificar se foi enviado um email
        if (!email) {
            throw new Error("Email incorreto");
            
        }

        //Verificar se esse email ja está cadastrado na plataforma
        const userJaExiste = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })
        if (userJaExiste) {
            throw new Error("Usuário já existe");
            
        }

        const passwordHash = await hash(password, 8);

        const user = await prismaClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user
    }
}

export {CreateUserService}