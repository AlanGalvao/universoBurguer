import prismaClient from "../../prisma";



class ListCategoryService{
    async execute(){
        
        const listcategories = await prismaClient.category.findMany({
            select:{
                id: true,
                name: true
            }
        })

        return listcategories
    }
}

export{ ListCategoryService}