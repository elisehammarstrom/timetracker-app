import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
    LineChart,
  } from "react-native-chart-kit";

const YourReportsScreen = () => {
    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          },
          {
            data: [2, 40, 50, 70, 66, 12],
            color: (opacity = 1) => `rgba(100, 12, 44, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Rainy Days"] // optional
      };

    return (
        <View style={styles.container}>
            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                withDots={false}
            />
        </View>
    )
};

const styles=StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
    },
})

export default YourReportsScreen;