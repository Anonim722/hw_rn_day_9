// src/services/mediaService.ts
// Since Expo SDK 54 the classic API (documentDirectory, getInfoAsync, ...) lives in `expo-file-system/legacy`.
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

const AVATAR_FILE_NAME = 'avatar.jpg';
export const AVATAR_PATH = `${FileSystem.documentDirectory}${AVATAR_FILE_NAME}`;

/**
 * Оптимізація фотографії: ресайз до 500px за шириною та стиснення JPEG 0.7.
 */
export async function optimizePhoto(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 500 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

/**
 * Персистентне збереження: копіює тимчасовий файл у documentDirectory/avatar.jpg.
 */
export async function savePhotoPermanently(tempUri: string): Promise<string> {
  const info = await FileSystem.getInfoAsync(AVATAR_PATH);
  if (info.exists) {
    await FileSystem.deleteAsync(AVATAR_PATH, { idempotent: true });
  }

  await FileSystem.copyAsync({ from: tempUri, to: AVATAR_PATH });
  return AVATAR_PATH;
}

/**
 * Отримання збереженого фото при старті застосунку.
 */
export async function getSavedPhoto(): Promise<string | null> {
  const info = await FileSystem.getInfoAsync(AVATAR_PATH);
  if (info.exists) {
    // query-параметр скидає кеш компонента Image
    return `${AVATAR_PATH}?t=${Date.now()}`;
  }
  return null;
}

/**
 * Видалення збереженого фото.
 */
export async function deleteSavedPhoto(): Promise<void> {
  const info = await FileSystem.getInfoAsync(AVATAR_PATH);
  if (info.exists) {
    await FileSystem.deleteAsync(AVATAR_PATH, { idempotent: true });
  }
}
