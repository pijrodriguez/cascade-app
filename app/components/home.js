import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { Header } from 'react-native-elements';

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

  render() {
    return (
		<View style={styles.wrapper}>
			<Header
				leftComponent={{ icon: 'menu', color: '#fff' }}
				centerComponent={{ text: 'HOME', style: { color: '#fff', fontSize: 15, fontWeight: 'bold' } }}
				outerContainerStyles={{backgroundColor:'black'}}
      />
			<View style={styles.container}>
				<Text style={styles.text}> Welcome to the app! </Text>			
			</View>
		</View>
    );
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