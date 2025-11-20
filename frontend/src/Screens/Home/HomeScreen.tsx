import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { styles } from "./HomeStyles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigation/types";

type Props = StackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const displayName =
    user?.profile?.firstName ||
    user?.profile?.lastName ||
    user?.username ||
    user?.email;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>VIGORA</Text>
        <Text style={styles.subtitle}>
          {user
            ? `Bem-vindo de volta, ${displayName ?? "atleta"}`
            : "Your fitness journey starts now"}
        </Text>

        {user ? (
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Terminar sessão</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Já tenho conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.outlineButtonText}>Criar conta</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
