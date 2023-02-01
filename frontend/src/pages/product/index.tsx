import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from "next/head"
import { Header } from "../../components/Header"
import styles from './styles.module.scss'
import { FiUpload } from "react-icons/fi"
import { useState, ChangeEvent, FormEvent } from 'react'
import { setupAPIClient } from "../../services/api"
import { toast } from "react-toastify"

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}


export default function Product({ categoryList }: CategoryProps) {


    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const nome = name;
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0)

    
    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return
        }

        const image = e.target.files[0];

        if (!image) {
            return
        }

        if (image.type === 'image/png' || image.type === 'image/jpeg') {
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(image)) //imagem temporaria 
        }
    }

    // quando voce seleciona uma categoria na lista
    function handleCategory(event) {
        setCategorySelected(event.target.value);
    }

    


    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try {
            /*
            const apiClientProduto = setupAPIClient();
            const produto = await apiClientProduto.get('/product/find', {
                params:{
                    name:nome
                }
            })

            console.log(name)

            if (produto.data) {
                alert(produto.data)
                return
            }
            */
            const data = new FormData();
            if (name === "" || price === "" || description === "") {
                toast.error("Preencha todos os campos!")
                return;
            }

            data.append('name', name);
            data.append('price', price)
            data.append('description', description);
            data.append('file', imageAvatar); // pega a foto
            data.append('category_id', categories[categorySelected].id)

            const apiClient = setupAPIClient();
            await apiClient.post('/product', data);
            toast.success("Produto cadastrado com sucesso")

        } catch (err) {
            console.log(err);
            toast.error("OPS! Algo deu errado!")
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');

    }


    return (
        <>
            <Head>
                <title>Novo Produto Universo Burguer</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <select className={styles.select} value={categorySelected} onChange={handleCategory}>
                            {categories.map((item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input type="text"
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <textarea
                            placeholder="Descreva seu produto"
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={35} color="#fff" />
                            </span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                            {/*verificação condicional se existe uma imagem ou não */}
                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Imagem do produto"
                                    width={250}
                                    height={250}
                                />
                            )}

                        </label>

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
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category'); // requisição que lista todas as categorias
    const responseProduct = await apiClient.get('/category/product'); // requisição para lista de todos os produtos

    return {
        props: {
            categoryList: response.data, // recebe a o array de categorias
            productList: responseProduct.data // recebe a o array de produtos
        }
    }
})