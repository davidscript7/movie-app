import { Dimensions } from 'react-native';

export const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  isSmallDevice: Dimensions.get('window').width < 375,
  isTablet: Dimensions.get('window').width >= 768,
};
