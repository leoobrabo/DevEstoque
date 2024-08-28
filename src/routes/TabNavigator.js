import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import Home from '../pages/Home'
import Settings from '../pages/Setting';
import Categories from '../pages/Categories';

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ setIsAuthenticated }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Produtos') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Categorias') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Configurações') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#8A2BE2',
                tabBarInactiveTintColor: '#000',
            })}
        >
            <Tab.Screen 
                name="Produtos" 
                component={Home} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="Categorias" 
                component={Categories}
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                options={{ headerShown: false }}
                name="Configurações">
                {props => <Settings {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
