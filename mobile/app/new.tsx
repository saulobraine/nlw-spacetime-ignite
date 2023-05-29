import { useState } from 'react'
import {
  TouchableOpacity,
  View,
  Switch,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'

import Logo from '../src/assets/logo.svg'
import { Link, useRouter } from 'expo-router'
import { api } from '../src/lib/api'

interface File extends Blob {
  name: string
  uri: string
  type: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })
      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as File)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }

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

        <Link href="/memories" asChild>
          <TouchableOpacity className=" h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
            <Icon name="arrow-left" size={16} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="mt-6 flex-1 space-y-6">
            <Text className="font-alt text-lg text-white">Nova memória</Text>

            <View className="flex-row items-center gap-2">
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                thumbColor={isPublic ? '#5c3ea3' : '#372560'}
                trackColor={{
                  false: '#48307e',
                  true: '#8257e5',
                }}
              />
              <Text
                className="font-body text-base text-gray-50"
                onPress={() => setIsPublic(!isPublic)}
              >
                Tornar memória pública
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              className="rounded-large h-32 items-center justify-center border-dashed border-gray-500 bg-black/20"
              onPress={openImagePicker}
            >
              {preview ? (
                <Image
                  source={{ uri: preview }}
                  className="h-full w-full rounded-lg object-cover"
                  alt=""
                />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Icon name="image" size={24} color="white" />
                  <Text className="font-body text-sm text-gray-50">
                    Adicionar imagem de capa
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              multiline
              className="p-2 font-body text-lg text-gray-50"
              placeholderTextColor="#56565a"
              placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
              textAlignVertical="top"
              value={content}
              onChangeText={(value) => setContent(value)}
            />

            <TouchableOpacity
              className="items-center self-end rounded-full bg-green-500 px-10 py-2"
              onPress={handleCreateMemory}
            >
              <Text className="font-alt text-sm uppercase text-black">
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
