import {Text} from 'react-native';


//Change font for the text
export default props => <Text {...props} style={[{fontFamily: 'Avenir'}, props.style]}>{props.children}</Text>