//ProfileIcon

import React from "react";
import { Text, StyleSheet, Pressable,Image, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileIcon = ({onPress}) => {

    const navigation = useNavigation();

    const onProfileIconPressed = () => {       
        navigation.navigate('Profile', {
        });
      }



    return (
        <TouchableHighlight onPress={onProfileIconPressed} style={[styles.container]}> 
        <Image   style={styles.picture}
          source={{uri: 'https://www.bootdey.com/img/Content/avatar/avatar3.png'}}>
        </Image>
        </TouchableHighlight>
    );
};

const styles =StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
        alignItems: 'flex-end'
    },
    picture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        border: 'solid',
        borderColor: 'white'
      },

 
})

export default ProfileIcon