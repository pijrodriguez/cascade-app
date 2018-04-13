import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Alert, Dimensions } from 'react-native';
import { Badge, Card, Divider, Button, Overlay } from 'react-native-elements';
import { Font } from 'expo';
import Entypo from 'react-native-vector-icons/Entypo';
import Moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class TaskComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fontLoaded: false,
			taskStatus:'Finish',
			taskColor: '#00c6ff',
			icon: {}
			
		}
		this.finishGoal = this.finishGoal.bind(this);
		this.checkGoalCompletion = this.checkGoalCompletion.bind(this);
	}

	async componentDidMount() {
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
		});
		this.setState({fontLoaded:true});
		Moment.locale('en');
		let{task} = this.props;
		this.checkGoalCompletion(task.assigned_to, task.goal_id, task.missed,task.finished_date, task.due_date);
	}

	finishGoal(goal_id, assigned_to) {
		console.log('FINISH GOAL');
		console.log(goal_id);
		console.log(assigned_to);
		
		if(this.state.taskStatus == 'Missed') {
			console.log('Missed!')
		} else if(this.state.taskStatus == 'Done') {
			console.log('Done')
		} else {
		fetch('https://follow-thru-server.herokuapp.com/finished-task', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				goal_id: goal_id,
				assigned_to: assigned_to
			}),
		})

		.then((response) => response.json())
		.then((res => {

			if (res.success == true) {
				this.setState({taskStatus:'Done', taskColor:'#00E676', icon: {name: 'check', type: 'font-awesome'}});
			}

			else {
				console.log(res.message);
			}

		}))
		}
	}

	checkGoalCompletion(user,goal, missed, finished_date, due_date) {
		
		//get current date
		var now = new Date();
		now.setHours(now.getHours() - 7);

		//parse the dates
		var current_date = Date.parse(now);
		var date_due = Date.parse(due_date);

		if(finished_date != null) {
			this.setState({taskStatus:'Done', taskColor:'#00E676', icon:{name: 'check', type: 'font-awesome'}})
			console.log('CHANGE BUTTON');
		} else if(current_date > date_due){
			
			if(!missed) {
			
				//fetch and count missed tasks
				fetch('https://follow-thru-server.herokuapp.com/missed-task', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_id: user,
						goal_id: goal
					}),
				})
		
				.then((response) => response.json())
				.then((res => {
		
					if (res.success == true) {
						console.log('CALLED');
						this.setState({taskStatus:'Missed', taskColor:'#EF5350',icon:{name: 'exclamation', type: 'font-awesome'}})
					}
		
					else {
						console.log(res.message);
					}
		
				}))
			} else {
				this.setState({taskStatus:'Missed', taskColor:'#EF5350',icon:{name: 'exclamation', type: 'font-awesome'}})
			}
		}
	}

  render() {
	  	Moment.locale('en');
		let {task} = this.props;
		
		//format the date
		var due_date = task.due_date.substring(0,16);
		var formatted_date = Moment(due_date).format('ddd MMMM D hh:mm a')

    return (
		!this.state.fontLoaded ? <Text>Loading....</Text> :
		<Card 
		title={task.title} 
		titleStyle={{fontFamily:'Montserrat-SemiBold'}}
		containerStyle={{borderLeftColor:this.state.taskColor, borderLeftWidth:5}}
		>
		<View style={{marginHorizontal:15, justifyContent:'space-around'}}>
			<Text style={{fontSize:SCREEN_WIDTH/25, fontFamily:'Montserrat-Regular'}}>{task.description}</Text>
			<Text style={{fontSize:SCREEN_WIDTH/20, fontFamily:'Montserrat-SemiBold'}}>{formatted_date}</Text>		
		</View>
			<Button
			title ={this.state.taskStatus}
			buttonStyle={[styles.doneButton,{backgroundColor:this.state.taskColor}]}
			textStyle={{fontFamily:'Montserrat-Bold'}}
			icon={this.state.icon}
			onPress={() => this.finishGoal(task.goal_id, task.assigned_to)}
			/>
		</Card>
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
	doneButton:{
		height: 50,
		backgroundColor: '#00c6ff',
		//borderRadius: 30,
		marginVertical: 10
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