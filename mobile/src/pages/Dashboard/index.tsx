import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ListaParamsPilha } from '../../routes/app.routes'
import { api } from '../../services/api';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';



export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<ListaParamsPilha>>();

    const [number, setNumber] = useState('');
    const [name, setName] = useState('');

    const { signOut } = useContext(AuthContext)

    async function openOrder() {
        if (number === '') {
            return;
        }

        const response = await api.post('/order', {
            table: Number(number),
            name: name,
        })

        //console.log(response.data)
        //console.log(response.data.id)
        navigation.navigate('Order', { number: number, order_id: response.data.id })
        setNumber('');
        setName('');

    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo pedido</Text>

            <TextInput
                placeholder="Numero da mesa"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />
            <TextInput
                placeholder="Nome"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 24,
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    }
})