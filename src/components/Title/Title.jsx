//Title component used for titles in the app

import {Text} from 'react-native';

//Change font for the text
export default props => <Text {...props} style={[{fontFamily: 'Futura'}, props.style]}>{props.children}</Text>