

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Icon, Image, ImageBackground} from 'react-native';


class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <View style={styles.container}>
		<View style={styles.topContainer}>
		<ImageBackground source={require('./user.png')} style={{width: 200, height: 150}}>  
		<Image source={require('./contact.png')}
       style={{width: 100, height: 100}} />
	   </ImageBackground>
        </View>
        <ScrollView>
          <View>
        
		
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page1')}>
              <Image source={require('./profile.png')}
       style={{width: 40, height: 40}} /> PROFILE
              </Text>
            </View>
          </View>
          <View>
            
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page3')}>
               <Image source={require('./cog.png')}
       style={{width: 40, height: 40}} /> SETTINGS
              </Text>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page2')}>
                <Image source={require('./out.png')}
       style={{width: 40, height: 40}} /> LOG OUT
              </Text>
            </View>
          </View>
        </ScrollView>
     
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
