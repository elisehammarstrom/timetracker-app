import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';


const CourseEvaluationsScreen = ({route}) => {
    const {course} = route.params;
    const {courses} = route.params;
    const {token} = route.params;

    const [selected, setSelected] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.selectListContainer}>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelected(val)}
                    data={courses}
                    save="value"
                    search={false}
                    placeholder='Choose course to see evaluations'
                    defaultOption={{ key: course, value: course }}
                />

            </View>

            <View>
                <Text style={styles.title}>{selected} evaluation</Text>

                <Text style={styles.breadtext}>80% of students recommend going to lectures</Text>

                <Text style={styles.breadtext}>25% of students recommend doing voluntary assignments ...</Text>

            </View>
            

            <View>
                <ButtonMenu
                    screen="courseStats"
                    token={token}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
        justifyContent: 'space-between'
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
        // borderRadius: 5,
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
    },
    breadtext: {
        fontSize: 20,
        color: "#EFEFEF"
    }
});


export default CourseEvaluationsScreen;