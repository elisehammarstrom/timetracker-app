import { useState } from 'react';
import React from 'react';
import {StyleSheet, View, Text, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const CourseStatsScreen = () =>{
    const navigation = useNavigation();
    const [selected, setSelected] = useState("");

    const data = [
        {key:'1', value:'Mekanik'},
        {key:'2', value:'Reglerteknik'},
        {key:'3', value:'Envariabelanalys'}
    ]

    const onReadCourseEvaluationsPressed = () => {
        navigation.navigate('CourseEvaluations', {course: selected})
    }

    return (
        <View style={styles.container}>

            <View style={styles.selectListContainer}>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    search={false}
                    placeholder='Choose course to see statistics'
                />

            </View>

            <View style={styles.header}>
                
                <View>

                    <Text style={styles.title}>{selected}</Text>
                    
                </View>

                <View style={styles.dateButton}>

                    <CustomButton
                        text="Select date"
                    />

                </View>
            </View>

            <View style={styles.timeContainer}>

                <View style={[styles.time, styles.yourTime]}>
                    <Text style={{fontWeight: 'bold'}}>Your time:</Text>
                </View>  

                <View style={[styles.time, styles.averageTime]}>
                    <Text style={{fontWeight: 'bold'}}>Average time:</Text>
                </View> 

                <View style={styles.evaluationButton}>
                    <CustomButton
                        text="Read course evaluations"
                        onPress={onReadCourseEvaluationsPressed}
                    />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.9 * Dimensions.get('window').width,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,
        justifyContent: 'flex-start'
    },
    dateButton: {
        marginRight: '2%',
    },
    timeContainer: {
        alignItems: 'center',
    },
    time: {
        width: '90%',
        height: 0.1 * Dimensions.get('window').height,
        justifyContent: 'center',
        paddingLeft: '5%',
        margin: 4,
    },
    yourTime: {
        backgroundColor:'#AC7CE4'
    },
    averageTime: {
        backgroundColor: '#5987CC'
    },
    evaluationButton: {
        width: 0.6 * Dimensions.get('window').width,
        justifyContent: 'center',
    }
})

export default CourseStatsScreen;