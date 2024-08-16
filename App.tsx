import React from "react";
import {StatusBar} from "react-native";
import {Routes} from "./src/routes";
import {NavigationContainer} from "@react-navigation/native";
import {AuthProvider} from "./src/contexts/AuthContext";

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#1d1d2e"
          translucent={false}
        />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
