import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const Routes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="MainTabs" >
                        {props => <MainTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Auth">
                        {props => <AuthStack {...props} setIsAuthenticated={setIsAuthenticated} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
