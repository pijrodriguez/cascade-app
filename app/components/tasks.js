import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import TaskComponent from './taskComponent';


export default class Tasks extends React.Component {

	constructor(props) {
		super();
		this.state = {
            tasks: null
		}
    }
    
    getTasks = async () => {
		//get user_id from AsyncStorage and use it to fetch this user's tasks
		var user_id = await AsyncStorage.getItem('user_id');
		
        fetch('https://cascade-app-server.herokuapp.com/tasks', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: user_id,
			}),
		})

		.then((response) => response.json())
		.then((res => {

			if (res.success == true) {
				console.log('CALLED');
				this.setState({tasks: res.tasks});
			}

			else {
				alert(res.message);
			}

		}))
		.done();
	}
	
	componentWillMount() {
		this.getTasks();
	}

	
    showTasks() {
		this.getTasks();
		console.log('SHOW TASKS');
		console.log(this.state.tasks);

		//check if the user has tasks
		if( this.state.tasks != null ){
			return this.state.tasks.map( task => <TaskComponent task={task} /> );
		}
		return <Text>No tasks assigned.</Text>;	
    }

  render() {
    return (
		<View style={styles.wrapper}>
            <Header
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'TASKS', style: { color: '#fff', fontSize: 15, fontWeight: 'bold' } }}
            outerContainerStyles={{backgroundColor:'black'}}
            />
            
            <ScrollView>
                {this.state && this.state.tasks && this.showTasks()}
            </ScrollView>
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
})