import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Keyboard  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../components/Logo'

const Login = ({ navigation, setIsAuthenticated }) => {

    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setName('');
        setEmail('');
        setPassword('');
    };


    const handleRegister = async () => {
    try {
        
        if (!name) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de nome.');
            return;
        }

        if (!email) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de e-mail.');
            return;
        }

        if (!password) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de senha.');
            return;
        }

        const storedUser = await AsyncStorage.getItem('@loggedInUser');
        if (storedUser) {
            Alert.alert('Ops!', 'Parece que você já possui uma conta. Faça login para continuar.');
            return;
        }

  
        const newUser = { name, email, password };
        await AsyncStorage.setItem('@loggedInUser', JSON.stringify(newUser));

        Alert.alert('Tudo certo!', 'Cadastro realizado com sucesso. Faça login para continuar.');
        Keyboard.dismiss();
        toggleAuthMode();
    } catch (error) {
        console.error('Erro durante o cadastro:', error);
        Alert.alert('Erro', 'Ocorreu um problema durante o cadastro. Tente novamente.');
    }
};


    const handleLogin = async () => {
    try {
        if (!email) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de e-mail.');
            return;
        }

        if (!password) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de senha.');
            return;
        }

        const storedUser = await AsyncStorage.getItem('@loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.email === email && user.password === password) {
                await AsyncStorage.setItem('@loggedInUser', JSON.stringify(user));
                Keyboard.dismiss();
                Alert.alert('Tudo certo!', 'Login realizado com sucesso.');
                setIsAuthenticated(true);
            } else {
                Alert.alert('Ops!', 'E-mail ou senha inválidos. Tente novamente.');
            }
        } else {
            Alert.alert('Ops!', 'Usuário não encontrado. Por favor, cadastre-se primeiro.');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        Keyboard.dismiss();
        Alert.alert('Erro', 'Ocorreu um problema durante o login. Tente novamente.');
    }
};



return (
    <View style={styles.container}>
        <Logo/>
      <Text style={styles.title}>{isLogin ? 'Entrar' : 'Criar conta'}</Text>
      <View style={styles.inputContainer}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
       
        <View style={styles.buttons}>

            <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleRegister}>
                <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Criar conta'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#000'}]} onPress={toggleAuthMode}>
                <Text style={styles.buttonText}>{isLogin ? 'Criar conta' : 'Entrar'}</Text>
            </TouchableOpacity>


          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  buttons:{
    
    alignItems: 'center',
    
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
