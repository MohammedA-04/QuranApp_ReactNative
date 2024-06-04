import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppNavigation from './navigation/appNavigation';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
