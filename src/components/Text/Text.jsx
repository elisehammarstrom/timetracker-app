//Text component used for general text
import {Text} from 'react-native';

//Change font for the text
export default props => <Text {...props} style={[{fontFamily: 'Trebuchet MS'}, props.style]}>{props.children}</Text>