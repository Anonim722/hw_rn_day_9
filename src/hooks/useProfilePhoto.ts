// src/hooks/useProfilePhoto.ts
import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  optimizePhoto,
  savePhotoPermanently,
  getSavedPhoto,
  deleteSavedPhoto,
} from '../services/mediaService';

function showPermissionAlert(message: string) {
  Alert.alert('Немає доступу', message, [
    { text: 'Скасувати', style: 'cancel' },
    { text: 'Відкрити налаштування', onPress: () => Linking.openSettings() },
  ]);
}

export function useProfilePhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // При монтуванні хука завантажуємо збережене фото (якщо воно є)
  useEffect(() => {
    loadExistingPhoto();
  }, []);

  const loadExistingPhoto = async () => {
    try {
      const savedUri = await getSavedPhoto();
      if (savedUri) {
        setPhotoUri(savedUri);
      }
    } catch (error) {
      console.error('Failed to load saved photo:', error);
    }
  };

  const processAndSave = async (sourceUri: string) => {
    setIsLoading(true);
    try {
      const optimizedUri = await optimizePhoto(sourceUri);
      const savedUri = await savePhotoPermanently(optimizedUri);
      setPhotoUri(`${savedUri}?t=${Date.now()}`);
    } catch (error) {
      console.error('Failed to process photo:', error);
      Alert.alert('Помилка', 'Не вдалося обробити та зберегти фото. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showPermissionAlert(
        'Щоб обрати аватар, надайте доступ до фотографій у налаштуваннях.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndSave(result.assets[0].uri);
    }
  };

  const takeWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showPermissionAlert(
        'Щоб зробити фото, надайте доступ до камери у налаштуваннях.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndSave(result.assets[0].uri);
    }
  };

  const removePhoto = async () => {
    try {
      await deleteSavedPhoto();
      setPhotoUri(null);
    } catch (error) {
      console.error('Failed to delete photo:', error);
      Alert.alert('Помилка', 'Не вдалося видалити фото.');
    }
  };

  return {
    photoUri,
    isLoading,
    pickFromGallery,
    takeWithCamera,
    removePhoto,
  };
}
