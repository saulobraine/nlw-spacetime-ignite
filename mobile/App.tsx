import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, View, TouchableOpacity } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import blurBg from './src/assets/luz.png'
import Stripes from './src/assets/stripes.svg'
import Logo from './src/assets/logo.svg'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { styled } from 'nativewind'
import { useCallback } from 'react'
const StyledStripes = styled(Stripes)

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const onLayoutRootView = useCallback(async () => {
    if (hasLoadedFonts) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }
  }, [hasLoadedFonts])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900 p-10"
      imageStyle={{
        position: 'absolute',
        left: '-150%',
      }}
      onLayout={onLayoutRootView}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <Logo />
        <View className="space-y-2">
          <Text className="text-center text-2xl font-bold leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity className="rounded-full bg-green-500 px-5 py-2">
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-body text-center text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
