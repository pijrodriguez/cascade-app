import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';


export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	_reloadState = async () => {
			var value = await AsyncStorage.getItem('user');
			if (value == null) {
				this.props.navigation.navigate('Page2');
			} else {
				this.setState({status: "Error: Logout Failed"});
			}
	}

  render() {
    return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<Text style={styles.text}> Welcome to the app! </Text>
				
				<TouchableOpacity
				style={styles.btn}
				onPress={this.logout}>
					<Text>Log out</Text>
				</TouchableOpacity>
				<Text style={styles.text}> {this.state.status}</Text>
				
				
			</View>
		</View>
    );
  }

  logout = () => {
	AsyncStorage.removeItem('user');
	this._reloadState().done();
  }
	
}

const styles = StyleSheet.create({
	wrapper:{
		flex:1	
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#191919',
		paddingLeft: 40,
		paddingRight: 40,
	},
	text: {
		color: '#fff',
		marginBottom: 20
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#F44336',
		padding: 20,
		alignItems: 'center'
	}
})