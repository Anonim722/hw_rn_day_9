// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTitleStyle: { fontWeight: '700', color: '#0f172a' },
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Профіль користувача' }}
        />
      </Stack>
    </>
  );
}
