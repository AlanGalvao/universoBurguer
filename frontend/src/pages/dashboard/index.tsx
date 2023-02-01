import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import { Header } from '../../components/Header'
import { FiRefreshCcw } from 'react-icons/fi'
import { IoTrash } from "react-icons/io5";

import { setupAPIClient } from '../../services/api'

import { ModalOrder } from '../../components/ModalOrder'

import Modal from 'react-modal';
import { toast } from 'react-toastify';

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}


export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders)

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false);


    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalView(id: string) {

        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/detail', {
            params: {
                order_id: id,
            }
        })

        setModalItem(response.data);
        setModalVisible(true);

    }

    async function deletaOrder(id: string) {

        const apiClient = setupAPIClient();
        await apiClient.delete('/order', {
            params: {
                order_id: id,
            }
        })

        refreshOrders();
        toast.success("Pedido excluído")

    }

    async function handleFinishItem(id: string) {
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finish', {
            order_id: id,
        })

        refreshOrders();
        setModalVisible(false);
    }

    async function refreshOrders(){
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/orders')
        setOrderList(response.data)
    }

    Modal.setAppElement('#__next');  //padrão da modal usando next

    return (
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>

                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>
                        <button onClick={() => refreshOrders()}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>

                    <article className={styles.listOreders}> {/*verificar nome depois */}

                        {orderList.length === 0 && (
                            <span className={styles.listaVazia}>
                                Nenhum pedido foi encontrado...
                            </span>
                        )}


                        {orderList.map(item => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tagE}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                                <button onClick={() => deletaOrder(item.id)}>
                                    <IoTrash size={25} color="#3fffa3" />
                                    <div className={styles.tagD}></div>
                                </button>

                            </section>
                        ))}

                    </article>

                </main>

                {modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        finishOrder={handleFinishItem}
                    />
                )}

            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/orders');
    //console.log(response.data);


    return {
        props: {
            orders: response.data
        }
    }
})