import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Link } from 'expo-router'

const ticketImg1 = require('../assets/images/ticket-img-1.png');
const ticketImg2 = require('../assets/images/ticket-img-2.png');

const index = () => {
  return (
    <Link href='login' asChild>
      <View style={s.main}>
      <Image source={ticketImg1}/>
      <Image source={ticketImg2}/>
      <Text>Rrrrrrip</Text>
      </View>
    </Link>
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