import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Font } from 'expo';
import { Header, Divider } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import TaskComponent from './taskComponent';
import Foundation from 'react-native-vector-icons/Foundation';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Tasks extends React.Component {

	constructor(props) {
		super();
		this.state = {
			tasks: null,
			fontLoaded: false,
			noTasks: true
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
				this.setState({ tasks: res.tasks, noTasks: false });
			}

			else {
				this.setState({noTasks:true})
			}

		}))
		.done();
	}
	
	componentWillMount() {
		this.getTasks();
	}

	async componentDidMount() {
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
		});

		this.setState({ fontLoaded: true })
	}

	
    showTasks() {
		this.getTasks();
		console.log('Show tasks');
		console.log(this.state.tasks);

		//check if the user has tasks
		if( this.state.tasks != null ){
			return this.state.tasks.map( task => <TaskComponent task={task} /> );
			}
		}

  render() {
    return (
		!this.state.fontLoaded ? <Text> Loading... </Text> :
		<View style={styles.wrapper}>
            <Header
			leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
            centerComponent={{ text: 'TASKS', style: { color: '#fff', fontSize: 15, fontWeight: 'bold' } }}
            outerContainerStyles={{backgroundColor:'black'}}
            />
            
            <ScrollView>
				{this.state && this.state.noTasks ? 
				this.state &&
				<View style={[styles.noTasks, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>
					<Foundation
						name='clipboard-pencil'
						color='rgba(171, 189, 219, 1)'
						size={100}
					/>
					<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>No tasks assigned.</Text>
				</View> :
				this.state && this.state.tasks && this.showTasks()
 				}
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
	noTasks: {
		justifyContent:'center',
		alignItems: 'center',
		backgroundColor: 'white'
	}
})