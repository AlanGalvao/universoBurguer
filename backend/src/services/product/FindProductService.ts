import prismaClient from "../../prisma";


interface ProductRequest{
    name: string;
}

class FindProductService{

    async execute({name}: ProductRequest){

        const produtoJaExiste = await prismaClient.product.findFirst({
            where:{
                name: name
            }, 
            select:{
                name: true
            }
        })

        console.log(name)
        return produtoJaExiste.name

    }

}

export {FindProductService }