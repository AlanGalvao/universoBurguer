import prismaClient from "../../prisma";

interface CategoryRequest{
    name: string;
}

class CreateCategoryService{
    async execute({name} : CategoryRequest){

        //verificando se tem um nome
        if (name === "") {
            throw new Error("categoria invalida");             
        }

        // verificando se o nome já existe
        const categoriaJaExiste = await prismaClient.category.findFirst({
            where:{
                name: name
            }
        })
        if (categoriaJaExiste) {
            throw new Error("Categoria já existe");
            
        }
        //cadastrando a categoria no banco
        const category = await prismaClient.category.create({
            data:{
                name: name
            },
            select: { //devolvendo apenas os dados que interessam
                id: true,
                name: true
            }

        })
        return category
    }
}

export { CreateCategoryService}