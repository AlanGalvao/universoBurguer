import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// função para paginas que so podem ser acessadas por visitantes

export function canSSRGuest<P>(fn:GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> =>{
        
        const cookies = parseCookies(ctx);

        // se o usuario tentar acessar a pagina porem já logado, redirecionamos
        if (cookies['@universoBurguer.token']) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }
        return await fn(ctx)
    }
}