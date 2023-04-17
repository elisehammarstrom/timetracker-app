import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import TimerScreen from '../screens/TimerScreen';
import CourseScreen from '../screens/CourseScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CoursesScreen from '../screens/CoursesScreen/CoursesScreen';
import YourReportsScreen from '../screens/YourReportsScreen/YourReportsScreen';
import ChooseEvaluateCourseScreen from '../screens/ChooseEvaluateCourseScreen/ChooseEvaluateCourseScreen';
import EvaluateCourseScreen from '../screens/EvaluateCourseScreen/EvaluateCourseScreen';
import CourseStatsScreen from '../screens/CourseStatsScreen/CourseStatsScreen';
import CourseEvaluationsScreen from '../screens/CourseEvaluationsScreen/CourseEvaluationsScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            
            <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="CourseStats" component={CourseStatsScreen}/>

            <Stack.Screen name="CourseEvaluations" component={CourseEvaluationsScreen}/>

            <Stack.Screen name="SignIn" component={SignInScreen} />

            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="StartCalendar" component={CalendarScreen} />
            <Stack.Screen name="StartCourses" component={CourseScreen}/>
            <Stack.Screen name="Timer" component={TimerScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen name="YourReports" component={YourReportsScreen}/>
            <Stack.Screen name="ChooseEvaluateCourse" component={ChooseEvaluateCourseScreen}/>
            <Stack.Screen name="EvaluateCourse" component={EvaluateCourseScreen}/>


            <Stack.Screen name="Courses" component={CoursesScreen}/>

            





                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation