import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Link } from 'expo-router'

const ticketImg = require('../assets/images/ticket-img.png');

const index = () => {
  return (
    <Link href='sign' asChild>
      <View style={s.main}>
        <View style={s.content}>
          <Image source={ticketImg} style={s.img}/>
          <Text style={s.text}>Rrrrrrip</Text>
        </View>
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
    position: 'relative',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -50 },
      { translateY: -50 },
    ],
  },
  img: {
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 30,
  },
})