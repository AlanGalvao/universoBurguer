import { Response, Request } from "express";
import { FindProductService } from "../../services/product/FindProductService";


class FindProductController{
    async handle(req: Request, res: Response){

        const name = req.body

        const findProductService = new FindProductService();

        const findProduct = await findProductService.execute(name)

        return res.json(findProduct)


    }
}

export { FindProductController }