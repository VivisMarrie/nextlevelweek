import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'react-native';

import Routes from './src/routes'

export default function App() {
  return (
    <>
    <StatusBar barStyle="dark-content" 
    backgroundColor="transparent" translucent />
    <Routes />
    </>
  );
};



/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
*/