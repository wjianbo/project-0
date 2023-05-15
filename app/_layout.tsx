import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, Link, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Pressable, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { GestureResponderEvent } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from 'buffer';
import { FileInfoContext } from "../components/Editor";
import { MyContext, MyProvider } from "./context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    LXGWBright: require("../assets/fonts/LXGWBright-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      <MyProvider>
        {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
        {!loaded && <SplashScreen />}
        {loaded && <RootLayoutNav />}
      </MyProvider>
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const router = useRouter();
  function handlePress(event: GestureResponderEvent): void {
    router.replace('/')
  }

  const fileInfo = useContext(FileInfoContext);
  const api = useContext(MyContext);

  async function updateFile() {
    const path = await AsyncStorage.getItem('FILE-PATH');
    const fileContent = await AsyncStorage.getItem('FILECONTENT');
    if (!fileContent) return;
    const content = Buffer.from(fileContent).toString("base64");
    const sha = await AsyncStorage.getItem('SHA');
    if (path && sha) {
      console.log(path);
      await api.updateFileContent(path, content, sha);
      router.replace('/viewer')
    }
  }

  async function createFile() {
      await api.createFile();
      router.replace('/viewer');
  }

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          <Stack.Screen name="newpost" options={{
            presentation: "modal",
            headerRight: () => (
              <Pressable onPress={createFile}>
                {({ pressed }) => (
                  <FontAwesome
                    name="check"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }} />
          <Stack.Screen name="editor" options={{
            presentation: "modal",
            headerRight: () => (
              <Pressable onPress={updateFile}>
                {({ pressed }) => (
                  <FontAwesome
                    name="check"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }} />
          <Stack.Screen name="contents"
            options={{
              headerRight: () => (
                <Link href="/settings" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="gear"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }}
          />
          <Stack.Screen name="viewer"
            options={{
              headerLeft: () => (
                <Pressable onPress={handlePress}>
                  {({ pressed }) => (
                    <FontAwesome
                      name="chevron-left"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              ),
              headerRight: () => (
                <Link href="/editor" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="pencil"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }}
          />
        </Stack>
      </ThemeProvider>
    </>
  );
}
