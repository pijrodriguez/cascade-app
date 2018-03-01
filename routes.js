import Login from './app/components/login';
import Profile from './app/components/profile';
import settings from './app/components/settings';
import change from './app/components/change';
import SideMenu from './app/SideMenu/SideMenu';
import {DrawerNavigator} from 'react-navigation';

export default DrawerNavigator({
  Page1: {
    screen: Profile
  },
  Page2: {
    screen: Login
  },
  Page3: {
    screen: settings
  },
  Page4: {
    screen: change
  }
}, {
  contentComponent: SideMenu,
  drawerWidth: 200
});
