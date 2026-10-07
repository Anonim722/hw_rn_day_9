// app/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useProfilePhoto } from '../src/hooks/useProfilePhoto';

export default function ProfileScreen() {
  const [name, setName] = useState('Олексій Шевченко');
  const [role, setRole] = useState('React Native Розробник');

  const {
    photoUri,
    isLoading,
    pickFromGallery,
    takeWithCamera,
    removePhoto,
  } = useProfilePhoto();

  const handlePhotoPress = () => {
    Alert.alert(
      'Фото профілю',
      'Оберіть дію для оновлення фотографії:',
      [
        { text: 'Зробити фото (Камера)', onPress: takeWithCamera },
        { text: 'Обрати з галереї', onPress: pickFromGallery },
        ...(photoUri
          ? [
              {
                text: 'Видалити фото',
                style: 'destructive' as const,
                onPress: removePhoto,
              },
            ]
          : []),
        { text: 'Скасувати', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Аватар з підтримкою натискання */}
        <Pressable
          onPress={handlePhotoPress}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.avatarContainer,
            pressed && styles.avatarPressed,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>👤</Text>
              <Text style={styles.placeholderText}>Додати фото</Text>
            </View>
          )}

          <View style={styles.badgeEdit}>
            <Text style={styles.badgeEditText}>Змінити</Text>
          </View>
        </Pressable>

        {/* Текстові поля профілю */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ім'я:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Введіть ім'я"
          />

          <Text style={styles.label}>Посада / Спеціальність:</Text>
          <TextInput
            value={role}
            onChangeText={setRole}
            style={styles.input}
            placeholder="Введіть спеціальність"
          />
        </View>

        {/* Кнопки швидких дій */}
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={pickFromGallery}
          >
            <Text style={styles.primaryButtonText}>Галерея</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={takeWithCamera}
          >
            <Text style={styles.secondaryButtonText}>Камера</Text>
          </Pressable>
        </View>

        {photoUri && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={removePhoto}
          >
            <Text style={styles.deleteButtonText}>Видалити фото</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.noteText}>
        💡 Підказка: фото оптимізується (ресайз до 500px, JPEG 0.7) та зберігається у системній директорії документів, тому не зникає при повторному відкритті застосунку.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#3b82f6',
    position: 'relative',
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 42,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  badgeEdit: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  badgeEditText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#e0e7ff',
  },
  secondaryButtonText: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 15,
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  noteText: {
    marginTop: 20,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
});
