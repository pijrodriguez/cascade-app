import Login from './app/components/login';
import Home from './app/components/home';
import Settings from './app/components/settings';
import Change from './app/components/change';
import SideMenu from './app/SideMenu/SideMenu';
import {DrawerNavigator} from 'react-navigation';

export default DrawerNavigator({
  Home: {
    screen: Home
  },
  Login: {
    screen: Login
  },
  Settings: {
    screen: Settings
  },
  Change: {
    screen: Change
  }
}, {
  contentComponent: SideMenu,
  drawerWidth: 200
});
