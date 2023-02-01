import prismaClient from "../../prisma";


interface PorductRequest{
    id: string
    name: string;
    price: string;
    description: string;
    banner: string
    category_id: string
}

class EditProductService{
    async execute({id, name, price, description, banner, category_id}: PorductRequest){

        const product = await prismaClient.product.update({
            where: {
                id:id
            },
           data:{
                name: name,
                price: price,
                description: description,
                banner: banner,
                category_id: category_id
            },
        })

        return product
    }
}

export { EditProductService }