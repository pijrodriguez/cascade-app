import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';


export default class Profile extends React.Component {

  render() {
    return (

			<View style={styles.container}>
				<Text style={styles.text}> Welcome to dear Member </Text>
			</View>

    );
  }
	
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2896d3',
	},
	text: {
		color: '#fff',
	},
})