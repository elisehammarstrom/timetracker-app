import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import Text from '../../components/Text';
import Title from '../../components/Title';


const ChooseAssignmentScreen = ({route}) => {
    const {token} = route.params;
    const {courses} = route.params;
    const {courseIDs} = route.params;
    const [data, setData] = useState('');

    const [assignments, setAssignments] = useState([]);
    const navigation = useNavigation();


    axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/myAssignments/get_assignments_user_courses/",
        headers: {
          'Authorization': `token ` + token
        }
      })
        .then(function (response) {
          //handle success
          if (data.length <1 ){
            setData(response.data.assignmentData)
            
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

    // Just a line that separate each item in the list
    const ItemSeparatorView = () => {
        return (
        // Flat List Item Separator
        <View
            style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#C8C8C8',
            }}
        />
        );
    };

    function pickAssignment(selectedAssignment) {
        // If you press a box that is already checked you remove it
        if (assignments.includes(selectedAssignment)) {
            setAssignments(assignments.filter(Assignment => Assignment !== selectedAssignment))
            return;
        } else {
            setAssignments(Assignments => Assignments.concat(selectedAssignment))
        }
    
      }

    const onReturnPressed = () => {
        for (let i=0; i<assignments.length;i++) {
            var formData = new FormData();
            formData.append('assignmentID', assignments[i].assignmentId);

            axios({
                method: "post",
                url: "http://127.0.0.1:8000/api/myAssignments/add_assignment/",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `token ` + token
                }
              })
                .then(function (response) {
                  //handle success
                //   console.log(response.data)
                })
                .catch(function (response) {
                  //handle error
                  console.log(response);
                });
        }
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/optimalSchedule/create_optimal_schedule/",
            headers: {
              'Authorization': `token ` + token
        
            }
            })
            .then(function (response) {
                //handle success
                // console.log(response.data)
        
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
            
        navigation.navigate('CalendarOpScreen', {token: token, courses: courses, courseIDs: courseIDs})
    }
    if (data.length > 0) {
    return (
        <View style={styles.container}>
            <Title style={styles.title}>Choose assignments:</Title>
            <View style={styles.options}>

                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <View style={styles.course}>

                        <TouchableOpacity style={styles.checkBox} onPress={() => pickAssignment(item)}>
                            {assignments.includes(item) && <Text style={styles.check}>✓</Text>}
                        </TouchableOpacity>

                        <Text style={styles.courseName}> {item.course} - {item.assignmentName}</Text>

                        </View>

                    )}
                    ItemSeparatorComponent={ItemSeparatorView}
                />
                <CustomButton
                    text="Return to calendar"
                    onPress={onReturnPressed}
                />

            </View>

            
        </View>
    );
                    }
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#313131',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        justifyContent: 'flex-start'
    },
    options: {
        width: '90%',
        height: '90%',
    },
    courseName: {
        fontSize: 16,
        color: '#EFEFEF'
    },
    checkBox: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: '#EFEFEF',
        marginRight: 5,
        backgroundColor: 'white'
    },
    check: {
        alignSelf: 'center',
    },
    course: {
        flexDirection: 'row',
        marginVertical: 7,
    },
});

export default ChooseAssignmentScreen