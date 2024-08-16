import {View, ActivityIndicator} from "react-native";
import {AppRoutes} from "./app.routes";
import {AuthRoutes} from "./auth.routes";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Routes() {
  const {isAuthenticated} = useContext(AuthContext);

  const loading = false;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1d1d2e",
          justifyContent: "center",
          alignItems: "center"
        }}
        >

        <ActivityIndicator size={60} color="#f5f7fb"/>
        </View>
    );
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}
