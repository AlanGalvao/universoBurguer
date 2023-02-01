import { Request, Response } from "express";
import { EditProductService } from "../../services/product/EditProductService";


class EditProductController{
    async handle(req: Request, res: Response){

        const {id, name, price, description, category_id} = req.body
        const editProduct = new EditProductService();
        
        if (!req.file) {
            console.log(req.file)
            throw new Error("Erro de carregamento de imagem");
        } else {
           const { originalname, filename: banner} = req.file;

            const edit = await editProduct.execute({
                id,
                name,
                price,
                description,
                banner,
                category_id
            });

            return res.json(edit)
        }
        
    }
}

export { EditProductController }