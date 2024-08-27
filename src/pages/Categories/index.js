import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('@categories');
      setCategories(storedCategories ? JSON.parse(storedCategories) : []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar as categorias. Por favor, tente novamente.');
    }
  };

  const saveCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
      return;
    }

    if (categories.includes(newCategory.trim()) && !editingCategory) {
      Alert.alert('Erro', 'Essa categoria já existe.');
      return;
    }

    try {
      let updatedCategories;
      if (editingCategory) {
        // Editando uma categoria existente
        updatedCategories = categories.map((category) =>
          category === editingCategory ? newCategory.trim() : category
        );
      } else {
        // Adicionando uma nova categoria
        updatedCategories = [...categories, newCategory.trim()];
      }

      await AsyncStorage.setItem('@categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setNewCategory('');
      setEditingCategory(null); // Reseta a edição
      Keyboard.dismiss();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a categoria. Por favor, tente novamente.');
    }
  };

  const deleteCategory = async (category) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja excluir a categoria "${category}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const updatedCategories = categories.filter((c) => c !== category);
              await AsyncStorage.setItem('@categories', JSON.stringify(updatedCategories));
              setCategories(updatedCategories);
            } catch (error) {
              console.error('Erro ao deletar categoria:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao deletar a categoria. Por favor, tente novamente.');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const startEditing = (category) => {
    setNewCategory(category);
    setEditingCategory(category);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.headerText}>Categorias</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        extraData={categories}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => startEditing(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteCategory(item)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome da categoria"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.button} onPress={saveCategory}>
          <Text style={styles.buttonText}>{editingCategory ? 'Salvar Alterações' : 'Adicionar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    color: '#000',
    fontSize: 30,
    padding: 16,
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
  },
  categoryName: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
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
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#FFA500',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF000E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Categories;
