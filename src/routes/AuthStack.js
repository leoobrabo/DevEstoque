import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from  '../pages/Login'

const Stack = createNativeStackNavigator();

const AuthStack = ({ setIsAuthenticated }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Login" 
                options={{ headerShown: false }}>
                {props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AuthStack;
