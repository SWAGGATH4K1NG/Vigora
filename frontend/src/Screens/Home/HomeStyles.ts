import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  logo: {
    fontSize: 42,
    color: "#f87171",
    fontWeight: "bold",
    letterSpacing: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#f87171",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#f87171",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "bold",
  },
});
