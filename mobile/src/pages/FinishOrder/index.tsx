import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListaParamsPilha } from '../../routes/app.routes';

type RouteDetailParams = {
    FinishOrder: {
        number: number | string;
        order_id: string
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder() {

    const route = useRoute<FinishOrderRouteProp>()
    const navega = useNavigation<NativeStackNavigationProp<ListaParamsPilha>>()

    async function enviaPedido(){

        try {

            await api.put('/order/send', {
                order_id: route.params?.order_id
            })

            navega.popToTop() // volta para o inicio da primeira tela

        } catch (err) {
            console.log('Erro ao enviar o pedido', err)
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja finalizar este pedido?</Text>
            <Text style={styles.title}>Mesa {route.params?.number}</Text>
            <TouchableOpacity style={styles.button} onPress={enviaPedido}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={30} color='#1d1d2e' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alert: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    title: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderRadius: 4,

    },
    textButton: {
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e'
    }
})