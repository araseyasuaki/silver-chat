import React from 'react'
import { Stack } from 'expo-router'
import { RecoilRoot } from "recoil";

const layout = () => {
  return (
    <RecoilRoot>
      <Stack>
        <Stack.Screen name='index'/>
      </Stack>
    </RecoilRoot>
    
  )
}

export default layout