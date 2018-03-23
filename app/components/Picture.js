import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppRegistry, StyleSheet, View, Text, Button, AsyncStorage } from 'react-native';
import { ImagePicker } from 'expo';

import CameraRollPicker from 'react-native-camera-roll-picker';

export default class CameraRollComponent extends Component {
	


   constructor(props) {
    super(props);

    this.state = {
      num: 0,
      selected: [],
    };
  }

     getSelectedImages(images, current) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    });

    console.log(current);                    
    console.log(this.state.selected);        
  }
	
ShowLocation() {
	
  return this.state.selected.map(function(location, i){
    return(
      <View key={i}>                           
        <Text>{location.uri}</Text>               
      </View>
    );
  });
}
	
	profilep = () => {
	
	
	AsyncStorage.setItem('profile', (this.state.selected[0].uri));
	console.log(this.state.selected[0].uri);
	this.props.navigation.navigate('Home');
		
						 }
	
    render() {
        
		const {navigate} = this.props.navigation;
		
        return (
			
			<View style={styles.container}>
        <View style={styles.content}>
			<Text style={styles.text}>
            <Text style={styles.bold}> </Text> Please select profile picture
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}> {this.state.num} </Text> images has been selected 
          </Text>
			 </View>
			 <View>
		  <Button
            title="update"
            onPress={this.profilep} 
		
            />
        </View>
			
		<View>
			
			
          
			{this.ShowLocation()}
			 </View>
			 
        <CameraRollPicker
          scrollRenderAheadDistance={500}
          initialListSize={1}
          pageSize={3}
          removeClippedSubviews={false}
          groupTypes='SavedPhotos'
          batchSize={5}
          maximum={1}
          selected={this.state.selected}
          assetType='Photos'
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages.bind(this)} />
      </View>
            
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6AE2D',
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
});