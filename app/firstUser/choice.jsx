import React from 'react'
import { View, Button } from 'react-native'
import { Link } from 'expo-router'

const choice = () => {
  return (
    <View>
      <Link href='/firstUser' asChild>
        <Button title='戻る'/>
      </Link>
      <Link href='/home' asChild>
        <Button title='ユーザー'/>
      </Link>
      <Link href='/home/createGroupChat' asChild>
        <Button title='クリエーター'/>
      </Link>
    </View>
  )
}

export default choice