import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Logo from '../../components/Logo'

const Settings = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@loggedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      await AsyncStorage.setItem('@loggedInUser', JSON.stringify(user));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@loggedInUser');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred during logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
       <View>
         <Logo/>
      </View>
      <Text style={styles.title}>Perfil</Text>
      <Image
            style={styles.user}
            source={require('../../../assets/user.png')}
        />
      {isEditing ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
          <TouchableOpacity style={styles.button} onPress={saveUserProfile}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.profileItem}>Nome: {user.name}</Text>
          <Text style={styles.profileItem}>Email: {user.email}</Text>
          <View style={styles.buttons}>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#FFA500'}]} onPress={toggleEditMode}>
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#FF000E'}]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>


          </View>
        </View>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  profileItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  inputContainer: {
    width: '100%',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 4,
  },
  user: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
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

export default Settings;