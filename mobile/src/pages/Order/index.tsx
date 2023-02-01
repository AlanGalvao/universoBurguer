import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { api } from '../../services/api'
import { ModalPicker } from '../../components/ModalPicker';
import { ListItem } from '../../components/ListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListaParamsPilha } from '../../routes/app.routes';


type RouteDetailParams = {
  Order: {
    number: number | string;
    order_id: string;
  }
}

export type CategoriaProps = {
  id: string;
  name: string;
}

type ProdutosProps = {
  id: string;
  name: string
}

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navega = useNavigation<NativeStackNavigationProp<ListaParamsPilha>>();

  const [categoria, setCategoria] = useState<CategoriaProps[] | []>([]); // categoriaProps indica o tipo de item se receber, se não reber fica [] vazio
  const [catSelecionada, setCatSelecionada] = useState<CategoriaProps | undefined>(); // a categoria selecionada vai receber um array do tipo CategoriaProps
  const [modalCatVisivel, setModalCatVisivel] = useState(false);

  const [produto, setProduto] = useState<ProdutosProps[] | []>([]);
  const [pordutoSelecionado, setProdSelecionado] = useState<ProdutosProps | undefined>();
  const [modalProdVisivel, setModalProdVisivel] = useState(false);

  const [itens, setItens] = useState<ItemProps[]>([]);
  const [qtd, setQtd] = useState('1');

  useEffect(() => { // quando a tela for carregada ele vai execura o que estiver dentro da função (buscar as categorias)
    async function loadInfo() {
      const response = await api.get('/category')

      setCategoria(response.data)
      setCatSelecionada(response.data[0])

      // console.log(response.data)
    }
    loadInfo();
  }, [])

  useEffect(() => { // busca os produtos de acordo com as categorias
    async function loadProdutos() {
      const response = await api.get('/category/product', {
        params: {
          category_id: catSelecionada?.id
        }
      })

      setProduto(response.data)
      setProdSelecionado(response.data[0])

      // console.log(response.data)
    }
    loadProdutos();
  }, [catSelecionada]) // usa a categoria selecionada pra buscar os produtos

  async function handleCloseOrder() {
    try {
      await api.delete('/order', {
        params: {
          order_id: route.params?.order_id
        }
      })

      navega.goBack();

    } catch (err) {
      console.log(err)
    }

  }

  function mudaCategoria(item: CategoriaProps) {
    setCatSelecionada(item);
  }

  function mudaProduto(item: ProdutosProps) {
    setProdSelecionado(item);
  }

  //adicionando produtos na mesa
  async function adicionaItem() {
    const response = await api.post('/order/add', {
      order_id: route.params.order_id,
      product_id: pordutoSelecionado?.id,
      amount: Number(qtd)
    })

    let data = {
      id: response.data.id as string,
      product_id: pordutoSelecionado?.id as string,
      name: pordutoSelecionado?.name as string,
      amount: qtd
    }

    setItens(oldArray => [...oldArray, data])
  }

  async function deletaItem(item_id: string) {
    //alert(item_id)
    console.log('excluir o item ', item_id)
    
    try {
      await api.delete('/order/remove', {
        params: {
          item_id: item_id
        }
      })

      // apos remover o item da api, removemos esse item da lista
      let removeItem = itens.filter(item => {
        return (item.id !== item_id) // retorna uma lista com todos os itens menos o item que foi passado
      })
      setItens(removeItem)

    } catch (err) {
      console.log('Erro ao deletar um item', err)
    }
    
  }

  function finalizaPedido(){
    navega.navigate('FinishOrder', { number: route.params?.number, order_id: route.params?.order_id})
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        {itens.length === 0 && ( // não tiver itens na lista enão é exibido o botão
          <TouchableOpacity onPress={handleCloseOrder}>
            <Feather name="trash-2" size={28} color="#FF3F4b" />
          </TouchableOpacity>
        )}
      </View>

      {categoria.length !== 0 && ( // se não vier nada o botão fica desabilitado
        <TouchableOpacity style={styles.input} onPress={() => setModalCatVisivel(true)} >
          <Text style={{ color: '#FFF' }}>
            {catSelecionada?.name} {/* ? evita que na chamada assincrona quebre a aplicação, se não vir nada fica vazio até reber alguma coisa*/}
          </Text>
        </TouchableOpacity>
      )}

      {produto.length !== 0 && (
        <TouchableOpacity style={styles.input} onPress={() => setModalProdVisivel(true)} >
          <Text style={{ color: '#FFF' }}>
            {pordutoSelecionado?.name}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: '60%', textAlign: 'center' }]}
          placeholderTextColor="#F0F0F0"
          keyboardType="numeric"
          value={qtd}
          onChangeText={setQtd}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={adicionaItem} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { opacity: itens.length === 0 ? 0.3 : 1 }]} disabled={itens.length === 0} onPress={finalizaPedido}>
          {/* {opacity: itens.length === 0 ? 0.3 : 1}  quando não tiver itens o botão fica mais apagado, quando tiver itens ele fica 100%*/}
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItem data={item} deleteItem={deletaItem} />}
      />

      <Modal
        transparent={true}
        visible={modalCatVisivel}
        animationType='fade'
      >
        <ModalPicker
          fechaModal={() => setModalCatVisivel(false)}
          options={categoria}
          itemSelecionado={mudaCategoria}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProdVisivel}
        animationType='fade'
      >
        <ModalPicker
          fechaModal={() => setModalProdVisivel(false)}
          options={produto}
          itemSelecionado={mudaProduto}
        />
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '5%',
    paddingEnd: '4%',
    paddingStart: '4%'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 14
  },
  input: {
    backgroundColor: '#101026',
    borderRadius: 4,
    width: '100%',
    height: 40,
    marginBottom: 12,
    justifyContent: 'center',
    paddingHorizontal: 8,
    color: '#FFF',
    fontSize: 20,
  },
  qtdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  qtdText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonAdd: {
    width: '20%',
    backgroundColor: '#3fd1ff',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#101026',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    height: 40,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})