// The rating star used in course evaluations
// React Native Custom Star Rating Bar
// https://aboutreact.com/react-native-custom-star-rating-bar/

import React, {useState} from 'react';
import axios from 'axios';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const Star = ({token, question, answerID, submit}) => {
    // To set the default Star Selected
    const [defaultRating, setDefaultRating] = useState(2);
    const answerText = "star";
    // To set the max number of Stars
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

    // Filled Star. You can also give the path from local
    const starImageFilled =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    // Empty Star. You can also give the path from local
    const starImageCorner =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    // When the submit-button is pressed on EvaluateCourseScreen we send the info to backend
    if (submit === true) {
        const formData = new FormData();
        formData.append('answerID', answerID)
        formData.append('answerNumber', defaultRating)
        formData.append('answerText', answerText)

        axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/evaluate/update_answer/",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':`token ` + token
        }
        })
        .then(function (response) {
            //handle success
            // console.log(response.data);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });


    }

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
  });

