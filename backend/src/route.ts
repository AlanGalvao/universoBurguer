import { Router, Request, Response } from "express";
import multer from "multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { estaAutenticado } from "./middlewares/estaAutenticado";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import uploadConfig from './config/multer';
import { ListByCategoryController } from "./controllers/product/ListByCategoryController";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";
import { ListOrderController } from "./controllers/order/ListOrderControler";
import { EditProductController } from "./controllers/product/EditProductController";
import { RemoveProductController } from "./controllers/product/RemoveProductController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishDetailController";
import { FindProductController } from "./controllers/product/FindProductController";

const router = Router();

const upload = multer(uploadConfig.upload("./tmp")); //configura o caminho para o salve da imagem

// -- ROTA D EUSUÁRIOS
router.post('/users', new CreateUserController().handle); // --ROTA PARA CRIAÇÃO DE NOVO USUÁRIO --
router.post('/session', new AuthUserController().handle); // -- ROTA PARA AUTENTICAÇÃO DE USUÁRIO NA PLATAFORMA
router.get('/detailuser', estaAutenticado, new DetailUserController().handle); // -- ROTA PARA DETALHES DE USUÁRIO

// -- RORA DE CATEGORIAS
router.post('/category', estaAutenticado, new CreateCategoryController().handle); // -- ROTA PARA CADASTRO DE CATEGORIA
router.get('/category', estaAutenticado, new ListCategoryController().handle); // -- ROTA PARA LISTAGEM DE CATEGORIAS

// -- ROTA DE PRODUTOS
router.post('/product', estaAutenticado, upload.single('file'), new CreateProductController().handle); // -- ROTA PARA A CRIAÇÃO DE PRODUTOS
router.get('/category/product', estaAutenticado, new ListByCategoryController().handle); // -- ROTA PARA LISTAGEM DE PRODUTOS POR CATEGORIA
router.put('/product', estaAutenticado, upload.single('file'), new EditProductController().handle); // ROTA PARA EDIÇÃO DE PRODUTOS 
// -- NÃO ESQUECER DE COLOCAR O MIDDLEWARE DE ARQUIVO
router.delete('/product', estaAutenticado, new RemoveProductController().handle); // -- ROTA PARA REMOVER UM PRODUTO
router.get('/product/find', estaAutenticado, new FindProductController().handle); // ROTA PARA ENCONTRAR UM PRODUTO ESPECIFICO

// -- ROTA DE ORDENS
router.post('/order', estaAutenticado, new CreateOrderController().handle); // -- ROTA PARA A CRIAÇÃO DE ORDEM
router.delete('/order', estaAutenticado, new RemoveOrderController().handle); // -- ROTA PARA REMOVER UMA ORDEM
router.get('/orders', estaAutenticado, new ListOrderController().handle); // -- ROTA PARA LISTAGEM DE ORDENS
router.post('/order/add', estaAutenticado, new AddItemController().handle); // -- ROTA PARA ADICIONAR ITENS EM UMA ORDEM
router.delete('/order/remove', estaAutenticado, new RemoveItemController().handle); // -- ROTA PARA EXCLUIR ITENS EM UMA ORDEM
router.put('/order/send', estaAutenticado, new SendOrderController().handle);  // -- ROTA PARA ENVIAR UMA ORDEM'
router.get('/order/detail', estaAutenticado, new DetailOrderController().handle); // -- ROTA PARA RECEBER OS DETALHES DO PEDIDO'
router.put('/order/finish', estaAutenticado, new FinishOrderController().handle); // -- ROTA PARA ENCERRAR UM PEDIDO'

export {router};