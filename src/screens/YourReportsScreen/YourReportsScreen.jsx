import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from '../../components/CustomButton/CustomButton';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import Navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const YourReportsScreen = ({route}) => {
  const {token} = route.params;
  const {courses} = route.params;
  const {firstDate} = route.params;
  const {lastDate} = route.params;

  const [initialLabels, setInitialLabels] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  axios.get('http://127.0.0.1:8000/api/tracking/get_dates_in_week/', {
    headers: {
      'Authorization': `token ` + token
    }
  })
  .then((res) => {
    
    if (initialLabels.length < 1 ) {
      setInitialLabels(res.data.dates)
      setStartDate(res.data.startDate);
      setEndDate(res.data.endDate);

    }


  })
  .catch((error) => {
    console.error(error)
  })

  if (firstDate) {
    if (startDate !== firstDate.dateString) {
      setStartDate(firstDate.dateString)
      setEndDate(lastDate.dateString)
    }
  }
  
  // console.log("startDate= ", startDate)

  const formData = new FormData();
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)

  for (var pair of formData.entries()) {
    console.log(pair[0]+ ',' + pair[1]);
  }
  
  axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/tracking/get_user_course_study_time/",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `token ` + token
    }
  })
  .then((res) => {
    console.log(res.data)

  })
  .catch((error) => {
    console.error(error)
  })
 
  

  const fakeTime = ["10h", "12h", "11h"]
  // let newLabels = [];

  

  //   // console.log(date)

  // var createLabels = [];
  // for (let i=-4; i<=0; i++) {
  //   createLabels.push(day+i)
  // }
  // const [labels, setLabels] = useState(createLabels)

  // if (firstDate) {
  //   let newLabels = [];

   
  //   for (let i=firstDate.day; i<=lastDate.day; i++) {
  //     newLabels.push(i + '/' + firstDate.month) 
  //   }
  //   // console.log("newlabels=", newLabels)
  //   if (`${labels}` != `${newLabels}`) {
  //     setLabels(newLabels)
  //   }
  // }
  // console.log(labels)
  
    
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
      decimalPlaces: 0,
      backgroundGradientFrom: "#313131",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#313131",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(239, 239, 239, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
  };
  
  const colorsConst = ['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977'];
  const testTime = [[6,3,0,1,0], [1,3,2,2,4], [1,1,4,5,0]];


  const [legend, setLegend] = useState(courses);
  const [colors, setColors] = useState(['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977']);
  
  var time = [];
  var timeCourses = [];

  const [timeVar, setTimeVar] = useState(time)

  for (let i=0; i<courses.length; i++) {
    timeCourses.push({course: courses[i], time: testTime[i]})
  };
  
  for (let i=0; i<testTime[0].length; i++) {

    time.push([testTime[0][i], testTime[1][i], testTime[2][i]])
    
  };

  // console.log(time)

  const data = {
    labels: initialLabels,
    legend: [],
    data: timeVar,
    barColors: colors
  };

  const onCoursePressed = (course) => {
    for (let i=0; i<timeCourses.length; i++) {
      if (legend.length === 1 & legend[0] === course) {
        setLegend(courses)
        setColors(colorsConst)
        setTimeVar(time)
      }
      
      else if (course === timeCourses[i].course & legend.length != 1){
        setLegend([timeCourses[i].course])
        setColors([colors[i]])
        var timeChange = []
        for (let j=0;j<timeCourses[i].time.length; j++){
          timeChange.push([timeCourses[i].time[j]])
        }
        setTimeVar(timeChange)  
      }
    }
  };

  const onDatePressed = () => {
    navigation.navigate('Calendar', {courses: courses, token: token})
  }
    return (
        <View style={styles.container}>
          
            <View style={styles.header}>
                
                <View>
                    <Text style={styles.title}>Your reports</Text>
                </View>

                <View style={styles.dateButton}>
                    <CustomButton
                        text="Select dates"
                        onPress={onDatePressed}

                    />
                </View>

            </View>

            <View>
              <StackedBarChart
                // style={graphStyle}
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                yAxisLabel="h "

                decimalPlaces={1}
              />
            </View>

            <View style={styles.dataContainer}>
              <View style={styles.data}>
                <Text style={styles.dataText}>Course</Text>
                <Text style={styles.dataText}>Time</Text>
              </View>
              
              {courses.map((course,i) => (
                <TouchableOpacity style={[styles.colors, {backgroundColor: colorsConst[i]}]} key={course} onPress={() => onCoursePressed(course)}>
                  
                  <View>
                    <Text style={{fontWeight: 'bold'}}>{course}</Text>
                  </View>

                  <View>
                    <Text style={{fontWeight: 'bold'}}>{fakeTime[i]}</Text>
                  </View>

                </TouchableOpacity> 
              ))}
               
            </View>

            <View>
              <ButtonMenu
                screen="yourReports"
                token={token}
              />
            </View>
            
        </View>
    )
};

const styles=StyleSheet.create({
  container: {
      backgroundColor: '#313131',
      height: '100%',
      justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#EFEFEF',
      margin: 10,
      justifyContent: 'flex-start'
  },
  dateButton: {
      marginRight: '2%',
  },
  colors: {
    width: '90%',
    height: 0.1 * Dimensions.get('window').height,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    margin: 4,
    alignItems: 'center'
  },
  dataContainer: {
    alignItems: 'center',
  },
  dataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
  data: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%'
  },
})

export default YourReportsScreen;