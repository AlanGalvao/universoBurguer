import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/erros/AuthTokenError";

// função para paginas que so podem ser acessadas por usuarios logados

export function canSSRAuth<P>(fn:GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> =>{
        
        const cookies = parseCookies(ctx);

        const token = cookies['@universoBurguer.token'];

        // se o usuario não tiver um token então será enviado para a tela de login
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }

        // se o usuario tiver um login
        try {

            return await fn(ctx); //segue o fluxo

        } catch (err) {
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@universoBurguer.token') // se ocorrer um erro o token é destruido e o uusario segue para a area de login

                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }

        return await fn(ctx)
    }
}