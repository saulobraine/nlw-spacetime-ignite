import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'

import Logo from '../src/assets/logo.svg'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { api } from '../src/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'

dayjs.locale(ptBR)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>()

  async function handleSignOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1 px-10 py-5"
      contentContainerStyle={{
        marginBottom: bottom,
        marginTop: top,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Logo />

        <View className="flex-row items-center gap-2">
          <Link href="/new" asChild>
            <TouchableOpacity className=" h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
              <Icon name="plus" size={16} color="black" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            onPress={() => handleSignOut()}
            className=" h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white"
          >
            <Icon name="log-out" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="relative flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50"></View>
                <Text className="font-body text-sm leading-relaxed text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
              <View className="space-y-4">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
              </View>

              <Link href="/memories/:id" asChild>
                <TouchableOpacity className="flex flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
