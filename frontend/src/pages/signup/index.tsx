import Head from "next/head"
import styles from '../../../styles/home.module.scss'
import Image from "next/image"
import logoImg from '../../../public/ublogowhitelittle.png'
import { Input } from "../../components/ui/Input"
import { Buttom } from "../../components/ui/Buttom"
import Link from "next/link"
import { useState, FormEvent, useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import {toast} from 'react-toastify'


export default function SignUp() {

    const { signUp } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleSignUp(event: FormEvent){
        event.preventDefault();

        try {
            if (name === "" || email === "" || password === "") {
                toast.error("PREENCHA TODOS OS CAMPOS!")
                return;
            }
    
            setLoading(true);
    
            let data = {
                name,
                email,
                password
            }
    
            await signUp(data);
    
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>Faça seu cadastro agora</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoImg} alt="Logo Universo Burguer" />
                <div className={styles.login}>
                    <h1>Criando sua conta</h1>
                    <form onSubmit={handleSignUp}>
                        <Input
                            placeholder="Digite seu nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Digite seu email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Digite sua senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Buttom
                            type="submit"
                            loading={loading}
                        >
                            Cadastrar
                        </Buttom>
                    </form>

                    <Link href="/" legacyBehavior>
                        <a className={styles.text}>Já possuí uma conta? Faça o login</a>
                    </Link>


                </div>
            </div>
        </>
    )
}