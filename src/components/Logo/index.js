import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';


const Logo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.viText}>
        <Image
            style={styles.logo}
            source={require('../../../assets/logo.png')}
        />
        <Text style={styles.textLogo}>Dev</Text>
        <Text style={{fontSize: 24}}>Estoque</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  viText: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textLogo:{
    color: '#FF0000',
    fontSize: 25,
  }
});


export default Logo;