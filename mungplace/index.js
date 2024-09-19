/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {TextEncoder, TextDecoder} from 'text-encoding';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

AppRegistry.registerComponent(appName, () => App);
