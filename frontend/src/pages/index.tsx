import { useContext, FormEvent, useState } from "react"
import Head from "next/head"
import styles from '../../styles/home.module.scss'
import Image from "next/image"
import logoImg from '../../public/ublogowhitelittle.png'
import { Input } from "../components/ui/Input"
import { Buttom } from "../components/ui/Buttom"
import Link from "next/link"
import { AuthContext } from "../contexts/AuthContext"
import { toast } from 'react-toastify'
import { canSSRGuest } from "../utils/canSSRGuest"


export default function Home() {

  const {signIn} = useContext(AuthContext)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)


  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.warning("PREENCHA TODOS OS CAMPOS");
      return
    };

    setLoading(true);

    let data = {
      email,
      password
    };
    await signIn(data);

    setLoading(false);
  };


  return (
    <>
      <Head>
        <title>Universo Burguer - Faça o seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Universo Burguer"/>
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
              <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              />
              <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              />

              <Buttom
              type="submit"
              loading={loading}
              >
                Acessar
              </Buttom>
          </form>

          <Link href="/signup" legacyBehavior>
            <a className={styles.text}>Não possuí uma conta? Cadastre-se</a>
          </Link>

          
        </div>
      </div>
    </>
  )
}

// redireciona o usuario logado para a pagina de dashboard caso este tente acessar a area de login
export const getServerSideProps = canSSRGuest(async (ctx)=> {
  return {
    props: {}
  }
})
