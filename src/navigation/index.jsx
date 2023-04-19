import React from 'react';
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
import CoursesScreen from '../screens/CoursesScreen/CoursesScreen';
import OldYourReportsScreen from '../screens/OldYourReportsScreen/OldYourReportsScreen';
import YourReportsScreen from '../screens/YourReportsScreen/YourReportsScreen';
import ChooseEvaluateCourseScreen from '../screens/ChooseEvaluateCourseScreen/ChooseEvaluateCourseScreen';
import EvaluateCourseScreen from '../screens/EvaluateCourseScreen/EvaluateCourseScreen';
import CourseStatsScreen from '../screens/CourseStatsScreen/CourseStatsScreen';
import CourseEvaluationsScreen from '../screens/CourseEvaluationsScreen/CourseEvaluationsScreen';
import UntrackedScreen from '../screens/UntrackedScreen';
import StressScreen from '../screens/StressScreen';
import TestScreen from '../screens/TestScreen';
import EditProfileScreen from '../screens/EditProfileScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            
            <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="CourseStats" component={CourseStatsScreen}/>

            <Stack.Screen name="YourReports" component={YourReportsScreen} />

            <Stack.Screen name="SignUp" component={SignUpScreen} />

            <Stack.Screen name="Courses" component={CoursesScreen}/> 

            <Stack.Screen name="EvaluateCourse" component={EvaluateCourseScreen}/>    






            
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="StartCourses" component={CourseScreen}/>
                
                <Stack.Screen name="Stress" component={StressScreen}/>
                <Stack.Screen name="AddTime" component={UntrackedScreen}/>
                <Stack.Screen name="Home" component={HomeScreen} />
                {/* <Stack.Screen name="Evaluation" component={EvaluationScreen}/> */}
                
                <Stack.Screen name="Timer" component={TimerScreen}/>
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
                <Stack.Screen name="ChooseEvaluateCourse" component={ChooseEvaluateCourseScreen}/>
                <Stack.Screen name="Test" component={TestScreen}/>
                
                <Stack.Screen name="CourseEvaluations" component={CourseEvaluationsScreen}/>
                <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
                <Stack.Screen name="Profile" component={ProfileScreen}/>
                <Stack.Screen name="OldYourReports" component={OldYourReportsScreen}/>

                
            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation