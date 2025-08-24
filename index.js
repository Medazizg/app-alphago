import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';

// Disable new architecture features
global.__turboModuleProxy = undefined;
global.__DEV__ = __DEV__;

// Enable screens
enableScreens(false);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
