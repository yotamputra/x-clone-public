import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";
import { ApolloProvider } from "@apollo/client";
import client from "./config/Apollo";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StackNav />
        </NavigationContainer>
      </ApolloProvider>
    </AuthProvider>
  );
}
