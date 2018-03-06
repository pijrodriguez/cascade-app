import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { Badge, Divider } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';


export default class TaskComponent extends React.Component {

	constructor(props) {
		super(props);
	}

  render() {
		let {task} = this.props;
		var due_date = task.due_date.substring(0,10);

    return (
				<View style={styles.taskContainer}>
					<View style={styles.textContainer}>
						<Text style={styles.text}>Task Name: {task.title}</Text>
						<Text style={styles.text}>Task URL: {task.description}</Text>
						<Badge 
						value={due_date}
						containerStyle={{ backgroundColor: 'green', width:120, marginVertical:5}}
						textStyle={{color:'white', fontWeight:'bold'}}/>
					</View>
				</View>
    );
  }
};

const styles = StyleSheet.create({
	wrapper:{
		flex:1	
	},
	taskContainer:{
		width:390,
		height: 100,
		backgroundColor:'rgba(0,0,0,0.5)',
		marginVertical: 10,
		marginHorizontal: 10,
		borderRadius: 5,
	},
	text:{
		marginVertical:2
	},
	textContainer:{
		marginHorizontal:10,
		marginVertical:10
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#191919',
		paddingLeft: 40,
		paddingRight: 40,
	},
})