import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Font } from 'expo';
import { Header, Divider, ButtonGroup } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import TaskComponent from './taskComponent';
import Foundation from 'react-native-vector-icons/Foundation';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Tasks extends React.Component {

	constructor(props) {
		super();
		this.state = {
			tasks:null,
			active: null,
			done: null,
			missed: null,
			fontLoaded: false,
			noTasks: true,
			refreshing: false,
			selectedIndex: 0
			}
		
		this.updateIndex = this.updateIndex.bind(this)
    }
	
	_onRefresh() {
		this.setState({refreshing: true});
		this.getTasks().then(this.setState({refreshing:false}));
	}

	//this function is called when the goals are filtered so that the UI will refresh
	_filter(selectedIndex) {
		this.setState({refreshing: true});
		this.getTasks().then(this.setState({refreshing:false,selectedIndex}));
	}

	updateIndex (selectedIndex) {
		this.setState({selectedIndex})
	}

	//this function is called to fetch the goals from the server
    getTasks = async () => {

		//clear the tasks array
		this.setState({tasks:null,active:null, done:null, missed:null});

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
				var goals = [];
				var activeGoals = [];
				var finishedGoals = [];
				var missedGoals = [];
				
				//seperate the missed goals, active goals and finished goals for filtering purposes
				//push all the goals in an array as well
				res.tasks.forEach(element => {
					if(element.missed == false){
						if(element.finished_date != null){
							finishedGoals.push(element);
							goals.push(element);
						} else {
							activeGoals.push(element);
							goals.unshift(element);
						}
					} else {
						missedGoals.push(element);
						goals.push(element);
					}
				});
				
				this.setState({ 
					tasks:goals,
					active:activeGoals,
					done:finishedGoals,
					missed:missedGoals, 
					noTasks: false });
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
		console.log('Show tasks');
		//check if the user has tasks
		//filter the tasks based on their status
		if( this.state.tasks != null ){
			if( this.state.selectedIndex == 0) {
				return this.state.tasks.map((task, index) => <TaskComponent task={task} key={index} />);
			} else if( this.state.selectedIndex == 1){
				return this.state.active.map((task, index) => <TaskComponent task={task} key={index} />);
			} else if( this.state.selectedIndex == 2){
				return this.state.done.map((task, index) => <TaskComponent task={task} key={index} />);
			} else if( this.state.selectedIndex == 3){
				return this.state.missed.map((task, index) => <TaskComponent task={task} key={index} />);
			}
		}
	}

  render() {
	const buttons = ['All', 'Active', 'Done', 'Missed']
	const { selectedIndex } = this.state

    return (
		!this.state.fontLoaded ? <Text> Loading... </Text> :
		<View style={styles.wrapper}>
            <Header
				leftComponent={{ icon: 'menu', color: '#fff', size: SCREEN_WIDTH/14, type:'entypo', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
				centerComponent={{ text: 'GOALS', style: { color: '#fff', fontSize: SCREEN_WIDTH/20, fontFamily:'Montserrat-Bold'} }}
				outerContainerStyles={{backgroundColor:'black'}}
            />
            
            <ScrollView
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh.bind(this)}
					/>
				}
			>
			<ButtonGroup
			onPress={this.updateIndex && this._filter.bind(this)}
			selectedIndex={selectedIndex}
			buttons={buttons}
			containerStyle={{height: 30, marginTop:15}}
			textStyle={{fontFamily:'Montserrat-SemiBold'}}
			selectedButtonStyle={{borderBottomColor:'#191919', borderBottomWidth: 3}}
			/>
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