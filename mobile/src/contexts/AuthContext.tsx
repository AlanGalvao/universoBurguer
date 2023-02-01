import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
    user: UserProps;
    estaAutenticado: boolean;
    signIn: (credenciais: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: ()=> Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode
}

type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: '',
    })


    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true)

    const estaAutenticado = !!user.name;  // = !!  tecnica para conversão rapida de uma informação em booleana

    useEffect(() => {
        async function getUser() {
            //pegar os dados salvos do usuario
            const infoUser = await AsyncStorage.getItem('@universoburguer');
            let temUsuario: UserProps = JSON.parse(infoUser || '{}') // converte a string novamente em um objeto

            // verificar se recebemos as informações dele.
            if (Object.keys(temUsuario).length > 0) {
                api.defaults.headers.common['Authorization'] = `Bearer ${temUsuario.token}` // informa para outras paginas o token de autorização

                setUser({
                    id: temUsuario.id,
                    name: temUsuario.name,
                    email: temUsuario.email,
                    token: temUsuario.token,
                })
            }
            setLoading(false)

        }

        getUser();

    }, [])

    async function signIn({ email, password }: SignInProps) {

        setLoadingAuth(true);

        try {
            const response = await api.post('/session', { email, password })
            console.log(response.data)

            const { id, name, token } = response.data

            //converte um objeto em uma estring pois o AsynStorage guarda apenas uma variavel string
            const data = { ...response.data }

            await AsyncStorage.setItem('@universoburguer', JSON.stringify(data)) // deixa salvo no app as informações de login

            api.defaults.headers.common['Authorization'] = `Bearer ${token}` // informa para outras paginas o token de autorização

            setUser({
                id,
                name,
                email,
                token,
            })
            // desativa o icone de loading
            setLoadingAuth(false)

        } catch (err) {
            console.log('erro ao acessar', err)
            setLoadingAuth(false)
            alert('Senha ou email incorreto')
        }

    }

    async function signOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser({
                    id: '',
                    name: '',
                    email: '',
                    token: '',
                })
            })
    }



    return (
        <AuthContext.Provider value={{ user, estaAutenticado, signIn, loading, loadingAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}