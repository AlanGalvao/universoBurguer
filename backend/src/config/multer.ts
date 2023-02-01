import multer from "multer";
import crypto from 'crypto';
import { extname, resolve} from 'path';

export default{
    upload(folder: string){
        return{
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder ),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString("hex"); //gera uma string unica
                    const fileName = `${fileHash}-${file.originalname}` // junta a string unica com o nome original, evitando conflito de nome de arquivos

                    return callback(null, fileName)

                }
            })
        }
    }
}