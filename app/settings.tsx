import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, TextInput, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './context';

export default function ModalScreen() {
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [token, setToken] = useState('');

  const githubAccessor = useContext(MyContext);

  const getUserData = () => {
    setUsername(githubAccessor.getUsername());
    setRepoName(githubAccessor.getRepo());
    setToken(githubAccessor.getToken());
  };

  const setUserData = () => {
    if (username)
      AsyncStorage.setItem('USERNAME', username);
    if (repoName)
      AsyncStorage.setItem('REPO-NAME', repoName);
    if (token)
      AsyncStorage.setItem('TOKEN', token);
  }
  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    setUserData();
  }, [username, repoName, token]);


  return (
    <View style={styles.container}>
      <Text>GitHub username</Text>
      <TextInput style={styles.textInput}
        onChangeText={setUsername}
        value={username}
      ></TextInput>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>GitHub repository name</Text>
      <TextInput style={styles.textInput}
        onChangeText={setRepoName}
        value={repoName}
      ></TextInput>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>GitHub token</Text>
      <TextInput style={styles.textInput}
        onChangeText={setToken}
        value={token}
      ></TextInput>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    height: 30,
  },
});
