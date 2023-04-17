// React Native Custom Star Rating Bar
// https://aboutreact.com/react-native-custom-star-rating-bar/

// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const Star = ({question, leftText, rightText}) => {
        // To set the default Star Selected
    const [defaultRating, setDefaultRating] = useState(2);
    // To set the max number of Stars
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

    // Filled Star. You can also give the path from local
    const starImageFilled =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    // Empty Star. You can also give the path from local
    const starImageCorner =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

    const CustomRatingBar = () => {
        return (
            <View style={styles.customRatingBarStyle}>
            {maxRating.map((item, key) => {
                return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setDefaultRating(item)}>
                    <Image
                    style={styles.starImageStyle}
                    source={
                        item <= defaultRating
                        ? {uri: starImageFilled}
                        : {uri: starImageCorner}
                    }
                    />
                </TouchableOpacity>
                );
            })}
            </View>
        );
        };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>

            {/* View to hold our Stars */}

            <Text style={styles.title}>{question}</Text>

            <View style={styles.ratingTextContainer}>

                <Text style={styles.ratingText}>{leftText}</Text>

                <Text style={styles.ratingText}>{rightText}</Text>
            </View>
            <CustomRatingBar />
            
            </View>
        </SafeAreaView>
        );
    };

export default Star;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        textAlign: 'center',
    },
    customRatingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    starImageStyle: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        padding: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
    },
    ratingTextContainer: {
        color: '#EFEFEF',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ratingText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
  });

