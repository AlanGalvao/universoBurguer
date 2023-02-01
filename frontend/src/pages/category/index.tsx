import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from "next/head"
import { Header } from "../../components/Header"
import styles from './styles.module.scss'
import { FormEvent, useState } from 'react'
import { toast } from "react-toastify"
import { setupAPIClient } from "../../services/api"

export default function Category() {

    const [name, setName] = useState('');

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if (name === '') {
            return
        }

        // cadastrar a categoria no banco de dados
        const apiClient = setupAPIClient();
        await apiClient.post('/category', {
            name: name
        })

        toast.success(`Categoria ${name} cadastrada com sucesso!`)
        setName(''); //limpar o campo da categoria

    }


    return (
        <>
            <Head>
                <title>Nova Categoria - Universo Burguer</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar Categorias</h1>
                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})