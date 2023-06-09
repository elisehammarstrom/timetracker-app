// This is the file that contains the navigation. We use react natives navigation and stack navigator 

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import CoursesScreen from '../screens/CoursesScreen/CoursesScreen';
import YourReportsScreen from '../screens/YourReportsScreen/YourReportsScreen';
import ChooseEvaluateCourseScreen from '../screens/ChooseEvaluateCourseScreen/ChooseEvaluateCourseScreen';
import EvaluateCourseScreen from '../screens/EvaluateCourseScreen/EvaluateCourseScreen';
import CourseStatsScreen from '../screens/CourseStatsScreen/CourseStatsScreen';
import CourseEvaluationsScreen from '../screens/CourseEvaluationsScreen/CourseEvaluationsScreen';
import UntrackedScreen from '../screens/UntrackedScreen';
import StressScreen from '../screens/StressScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen/CalendarScreen';
import CalendarOpScreen from '../screens/CalendarOpScreen';
import ChooseAssignmentScreen from '../screens/ChooseAssignmentScreen/ChooseAssignmentScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            
            <Stack.Navigator screenOptions={{headerShown: false}}>
                
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />

                <Stack.Screen name="StartCourses" component={CourseScreen}/>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddTime" component={UntrackedScreen}/>
                <Stack.Screen name="Stress" component={StressScreen}/>
                <Stack.Screen name="YourReports" component={YourReportsScreen} />
                <Stack.Screen name="Calendar" component={CalendarScreen}/>

                <Stack.Screen name="Courses" component={CoursesScreen}/> 

                <Stack.Screen name="EvaluateCourse" component={EvaluateCourseScreen}/> 
                <Stack.Screen name="ChooseEvaluateCourse" component={ChooseEvaluateCourseScreen}/>

                <Stack.Screen name="CourseStats" component={CourseStatsScreen}/>
                <Stack.Screen name="CourseEvaluations" component={CourseEvaluationsScreen}/>

                <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
                <Stack.Screen name="CalendarOpScreen" component={CalendarOpScreen} />
                <Stack.Screen name="ChooseAssignment" component={ChooseAssignmentScreen}/>

            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation