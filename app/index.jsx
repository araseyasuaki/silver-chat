import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ticketImg1 = require('../assets/images/ticket-img-1.png');
const ticketImg2 = require('../assets/images/ticket-img-2.png');

const index = () => {
  return (
    <View style={s.main}>
      <Image source={ticketImg1}/>
      <Image source={ticketImg2}/>
      <Text>Rrrrrrip</Text>
    </View>
  )
}

export default index

const s = StyleSheet.create({
  main: {
    backgroundColor: '#C995E0',
    width: '100vw',
    height: '100vh',
  }
})