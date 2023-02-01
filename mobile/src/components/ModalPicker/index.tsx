import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { CategoriaProps } from "../../pages/Order";

interface ModalpickerProps {
    options: CategoriaProps[];
    fechaModal: () => void;
    itemSelecionado: (item: CategoriaProps) => void;
}

const { width: largura, height: altura } = Dimensions.get('window')

export function ModalPicker({ options, fechaModal, itemSelecionado }: ModalpickerProps) {

    function onPressItem(item: CategoriaProps) {
        // console.log(item);
        itemSelecionado(item) //quando clicar no item, ele vai selecionar o item
        fechaModal();
    }

    const option = options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => onPressItem(item)}>
            <Text style={styles.item}>
                {item.name}
            </Text>
        </TouchableOpacity>
    ))


    return (
        <TouchableOpacity style={styles.container} onPress={fechaModal}>
            <View style={styles.content}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: largura - 20,
        height: altura / 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4,
    },
    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#8a8a8a',
    },
    item: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})