import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";


interface AuthRequest{
    email: string,
    password: string,
}

class AuthUserService {
    async execute({email, password} : AuthRequest) {
        // Verifivcar se o email existe.
        const user = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })
        if (!user) {
            throw new Error("Usuário ou senha incorreto!"); 
        }

        // preciso verificar se a senha que ele mandou está correta
        const senhaCorreta = await compare(password, user.password);
        if (!senhaCorreta) {
            throw new Error("Usuário ou senha incorreto!");  
        }

        //se deu tudo certo, podemos gerar um token JWT e devolver os dados do usuario como id, name e email
        const token = sign(
            {
                name: user.name,
                email: user.email,
            }, process.env.JWT_SECRET, //instale o dotenv e coloque o valor secreto criptografado em alguma variavel de ambeiente em .env
            {
                subject: user.id,
                expiresIn: '30d' //token vai expirar em 30 dias
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        }
    }
}

export {AuthUserService};
