import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, StyleSheet } from 'react-native';

import { View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonoText } from '../../components/StyledText';
import NaviLink from '../../components/Link';
import { useRouter } from 'expo-router';

export default function TabTwoScreen() {
  const [path, setPath] = useState('');
  const [content, setContent] = useState([]);
  const apiUrl = 'https://api.github.com';
  const getRepoContent = async (owner: string, repo: string, token: string, path = '') => {
    const url = `${apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const getUserData = async () => {
    try {
      const username = await AsyncStorage.getItem('USERNAME');
      const repoName = await AsyncStorage.getItem('REPO-NAME');
      const token = await AsyncStorage.getItem('TOKEN');
      const savedPath = await AsyncStorage.getItem('PATH');
      if (savedPath) setPath(savedPath);
      if (username && repoName && token) {
        const content = await getRepoContent(username, repoName, token, path);
        if (path) {
          content.unshift({
            name: '../',
          })
        }
        setContent(content);
      }
    } catch (e) {
      console.log('Error retrieving data: ', e);
      AsyncStorage.setItem('PATH', '');
    }
  };

  const router = useRouter();
  const handlePress = (item: any) => {
    const arr = path.split('/');
    if (item.name === '../') {
      arr.pop();
    } else {
      arr.push(item.name)
    }

    const newPath = arr.join('/');

    if (item.type === 'file') {
      AsyncStorage.setItem('FILE-PATH', newPath);
      AsyncStorage.setItem('SHA', item.sha);
      router.replace('../viewer');
      return;
    }

    setPath(newPath)
    AsyncStorage.setItem('PATH', newPath);
  }

  useEffect(() => {
    getUserData();
  }, [path]);

  return (
    <View style={styles.container}>
      <MonoText>root{path}/</MonoText>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={content}
        renderItem={({ item }) => (
          <NaviLink item={item} action={handlePress} />
        )}
        keyExtractor={(item: any) => item.name}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});

