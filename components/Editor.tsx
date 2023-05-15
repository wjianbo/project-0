import React, { createContext, useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { TextInput, View } from "./Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import GitHubAPI from "../utils/githubAccessor";
import { MyContext } from "../app/context";

export const FileInfoContext = createContext({
  name: '',
  content: ''
});

export default function EditScreenInfo({ mode }: { mode: string }) {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const api = useContext(MyContext);

  const getUserData = async () => {
    try {
      const username = await AsyncStorage.getItem('USERNAME');
      const repoName = await AsyncStorage.getItem('REPO-NAME');
      const token = await AsyncStorage.getItem('TOKEN');
      const path = await AsyncStorage.getItem('FILE-PATH');
      if (username && repoName && token && path) {
        const data = await api.getRepositoryContent(path);
        const content = Buffer.from(data.content, data.encoding);
        const contentString = content.toString("utf-8");

        console.log(data)
        setFileContent(contentString);
        setFileName(data.name);
      }
    } catch (e) {
      console.log('Error retrieving data: ', e);
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      const date = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
      setFileName(`${date}.md`);
      setFileContent(` ---
title:  
date: ${date}
---
`)
      return;
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (fileName)
      AsyncStorage.setItem('FILENAME', fileName);
    if (fileContent)
      AsyncStorage.setItem('FILECONTENT', fileContent);
  }, [fileName, fileContent]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <TextInput style={styles.title}
          value={fileName}
          onChangeText={setFileName}
          autoFocus
          placeholder="newpost.md" />
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <TextInput
          multiline
          numberOfLines={10}
          placeholder="write something..."
          style={styles.textInput}
          value={fileContent}
          onChangeText={setFileContent}
        />
        <View style={styles.btnContainer}>
        </View>
      </View>
      <FileInfoContext.Provider value={{name: fileName, content: fileContent}}></FileInfoContext.Provider>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
  },
  textInput: {
    fontFamily: "LXGWBright",
    height: '60%',
  },
  btnContainer: {
    backgroundColor: "white",
    marginBottom: 220,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    borderColor: "#000000",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
