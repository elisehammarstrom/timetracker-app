import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import BackArrow from '../../../assets/arrowBack.png';
import { useNavigation } from '@react-navigation/native';


const CourseEvaluationsScreen = ({route}) => {
    const {course} = route.params;
    const {courses} = route.params;
    const {token} = route.params;
    const {courseIDs} = route.params;

    const navigation = useNavigation();

    const [selected, setSelected] = useState("");

    const onArrowPressed = () => {
        navigation.navigate('Courses', {courses: courses, token: token, courseIDs: courseIDs})
      }

    return (
        <View style={styles.container}>
             <View style={{justifyContent: 'flex-start'}}>
            <View style={styles.topContainer}>
        
            <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                <Image 
                    source={BackArrow} 
                    style={[{height: 100 * 0.3}, {width: 100 * 0.3}]} 
                    resizeMode="contain"
                />
            </TouchableOpacity >
            <Text style={styles.firstTitle}>Course Evaluations</Text>
            </View>
           
    
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
                    dropdownStyles={styles.dropDown}

                />

            </View>
           

            <View style={styles.stats}>
                <Text style={styles.title}>{selected} evaluation</Text>
                <ScrollView>

                <Text style={styles.breadtext}>80% of students recommend going to lectures</Text>

                <Text style={styles.breadtext}>25% of students recommend doing voluntary assignments ...</Text>

                <Text style={styles.breadtext}>25% of students are very stressed during this course</Text>

                <Text style={styles.breadtext}>10% of students are not stressed at all during this course</Text>

                <Text style={styles.breadtext}>35% of students think the workload is too high</Text>
                </ScrollView>

            </View>
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
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.75 * Dimensions.get('window').width,
        backgroundColor: '#0376C2'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        padding: 20,
        marginBottom: 20,
        justifyContent: 'flex-start'
    },
    breadtext: {
        fontSize: 20,
        color: "#EFEFEF",
        padding: 20
    },
    backArrow: {
        width: '10%',
        padding: 10,
        flex: 0.5
    },
    dropDown: {
        width: 0.75 * Dimensions.get('window').width,
        backgroundColor: '#0376C2'
    },
    firstTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        padding: 10,
        flex: 2.5

    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    stats: {
        marginTop: 40,
    }
 

});


export default CourseEvaluationsScreen;