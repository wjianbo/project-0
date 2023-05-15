import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";

import { Text, View } from "./Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { MyContext } from "../app/context";

export default function EditScreenInfo() {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const api = useContext(MyContext);

  const getUserData = async () => {
    try {
      const path = await AsyncStorage.getItem('FILE-PATH');
      if (path) {
        const data = await api.getRepositoryContent(path);
        const content = Buffer.from(data.content, data.encoding);
        const contentString = content.toString("utf-8");

        setFileName(data.name);
        setFileContent(contentString);
      }
    } catch (e) {
      console.log('Error retrieving data: ', e);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
    >
      <Text style={styles.title}>{fileName}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text
        style={styles.textInput}>{fileContent}</Text>
      <View style={styles.btnContainer}>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  textInput: {
    fontFamily: "LXGWBright",
    borderColor: "#000000",
  },
  btnContainer: {
    backgroundColor: "white",
    marginBottom: 120,
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
