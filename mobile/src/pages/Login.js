import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  StyleSheet
} from "react-native";

import { StackActions, NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";

const Behavior = Platform.select({
  ios: "padding",
  android: ""
});

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    username: ""
  };

  async componentDidMount() {
    const username = await AsyncStorage.getItem("@GoTwitter:username");
    if (username) {
      this.navigateToTimeline();
    }
  }

  handleLogin = async () => {
    const { username } = this.state;
    if (!username.length) return;

    await AsyncStorage.setItem("@GoTwitter:username", username);
    this.navigateToTimeline();
  };

  navigateToTimeline = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Timeline" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  handleInputChange = username => {
    this.setState({ username });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Behavior}>
        <View style={styles.content}>
          <View>
            <Icon name="twitter" size={64} color="#4BB0EE" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            value={this.state.username}
            onChangeText={this.handleInputChange}
            returnKeyType="send"
            onSubmitEditing={this.handleLogin}
          />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleLogin}
            underlayColor="#3177a2"
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    height: 44,
    paddingHorizontal: 15,
    alignSelf: "stretch",
    marginTop: 30
  },

  button: {
    height: 44,
    alignSelf: "stretch",
    marginTop: 10,
    backgroundColor: "#4BB0EE",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});
