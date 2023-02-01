import prismaClient from "../../prisma";

interface PorductRequest{
    category_id: string;
}


class ListByCategoryService{
    async execute({category_id}: PorductRequest){

        const findByCategory = await prismaClient.product.findMany({
            where: {
                category_id: category_id
            }
        })

        return findByCategory;

    }
}

export { ListByCategoryService }