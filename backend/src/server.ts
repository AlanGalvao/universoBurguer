import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import { router } from "./route";
import cors from 'cors';
import path from 'path';

const PORT = 5000
const app = express(); //instanciando o express na variavel app
app.use(express.json()); //inofrmando para o app que o formato do express é o json
app.use(cors()); 



app.use(router); //usando as rotas

app.use(
    '/files',
    express.static(path.resolve(__dirname, '..','tmp'))
)

//middleware de erro
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof Error){
        // se for uma instancia de um tipo error
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    })

})

app.listen(PORT, () => console.log('Servidor online!!!!!!')) //"escutando a porta informada"
//app.listen(PORT, () => console.log(`Listening on ${ PORT }`))