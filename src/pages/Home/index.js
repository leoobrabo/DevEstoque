import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import Logo from '../../components/Logo'

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, category: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('@categories');
      setCategories(storedCategories ? JSON.parse(storedCategories) : []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('@products');
      setProducts(storedProducts ? JSON.parse(storedProducts) : []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const saveProduct = async () => {
  // Validação dos campos
  if (!newProduct.name.trim()) {
    alert("Por favor, insira um nome para o produto.");
    return;
  }

  if (!newProduct.quantity || isNaN(newProduct.quantity) || newProduct.quantity <= 0) {
    alert("Por favor, insira uma quantidade válida.");
    return;
  }

  if (!newProduct.category) {
    alert("Por favor, selecione uma categoria.");
    return;
  }

  if (!newProduct.description.trim()) {
    alert("Por favor, insira uma descrição.");
    return;
  }

  try {
    let updatedProducts = [...products];
    if (editingProduct) {
      updatedProducts = updatedProducts.map((product) =>
        product.name === editingProduct.name ? newProduct : product
      );
      setEditingProduct(null);
    } else {
      updatedProducts.push(newProduct);
    }
    await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    setNewProduct({ name: '', quantity: 0, category: '', description: '' });
    setModalVisible(false); // Fechar o modal após salvar o produto
  } catch (error) {
    console.error('Error saving product:', error);
  }
};


  const deleteProduct = async (product) => {
  Alert.alert(
    "Confirmação",
    `Tem certeza que deseja excluir o produto "${product.name}"?`,
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            const updatedProducts = products.filter((p) => p.name !== product.name);
            await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
            setProducts(updatedProducts);
          } catch (error) {
            console.error('Error deleting product:', error);
          }
        },
        style: "destructive"
      }
    ]
  );
};

  const editProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setModalVisible(true); // Abrir o modal para edição
  };

  return (
    <View style={styles.container}>
      <Logo/>
      <Text style={{color: '#000', fontSize: 30, padding: 16}}>Produtos</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Description: {item.description}</Text>

            
            <View style={styles.buttons}>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#FFA500'}]} onPress={() => editProduct(item)}>
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#FF000E'}]} onPress={() => deleteProduct(item)}>
                <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>


          </View>
          </View>
        )}
      />

      
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              value={newProduct.quantity.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, quantity: parseInt(text) })}
              keyboardType="numeric"
            />

            {categories.length > 0 ? (
              <Picker
                selectedValue={newProduct.category}
                onValueChange={(itemValue) =>
                  setNewProduct({ ...newProduct, category: itemValue })
                }
              >
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            ) : (
              
              <TouchableOpacity style={[styles.button, {backgroundColor: '#FF000E'}]} onPress={() => navigation.navigate('Categorias')}>
                  <Text style={styles.buttonText}>Adicionar categoria</Text>
              </TouchableOpacity>   
            )}

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            />
            <View style={styles.buttons}>

            <TouchableOpacity style={styles.button}  onPress={saveProduct}>
                <Text style={styles.buttonText}>{editingProduct ? 'Atualizar' : 'Adicionar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#FF000E'}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>


          </View>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  button: {
    backgroundColor: '#8A2BE2', // Cor roxa
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
