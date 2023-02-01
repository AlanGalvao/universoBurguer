import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";


class ListCategoryController{
    async handle(req: Request, res: Response){
        
        const listCategoService = new ListCategoryService();

        const listCategory = await listCategoService.execute();


        return res.json(listCategory)
    }
}

export { ListCategoryController}