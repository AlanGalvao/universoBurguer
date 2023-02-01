import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from 'react-toastify'

type AuthContextData = {
    user: UserProps;
    estaAutenticado: boolean;
    signIn: (credetials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type SignInProps = {
    email: string;
    password: string;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@universoBurguer.token')
        Router.push('/')
    } catch {
        toast.error('Erro ao deslogar');
        console.log('erro ao deslogar');
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    const estaAutenticado = !!user;

    useEffect(() => {
        // tentar pegar algo no cookie
        const { '@universoBurguer.token': token } = parseCookies();

        // pegar os dados de usuario na resposta da api 
        if (token) {
            api.get('/detailuser').then(response => { // mudei aqui (/me) - estava mandando para uma rota que não existe
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
                
                .catch(() => {
                    // se deu erro deslogamos o usuario
                    signOut();
                })
        }

    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })
            //console.log(response.data)

            const { id, name, token } = response.data;

            setCookie(undefined, '@universoBurguer.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expira em 1 mês
                path: "/" //quais caminhos terão acesso ao cookie (com a barra é o mesmo que para todos)
            })

            setUser({
                id,
                name,
                email,
            })

            //passar para as proximas requisições o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Logado com sucesso")

            // redirecionar o usuario para a pagina de dashboard (ultimos pedidos)
            Router.push('/dashboard')

        } catch (err) {
            toast.error("Erro ao acessar")
            console.log("erro ao acessar")
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password,
            })

            toast.success("Cadastrado com sucesso!");
            Router.push('/');


        } catch (err) {
            toast.error('Erro ao cadastrar')
            console.log("erro ao cadastrar", err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, estaAutenticado, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}