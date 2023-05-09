import React from 'react'
import { View, Text, Dimensions } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

const GraphScreen = () => {
    const line = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
          {
            data: [25, 12, 20, 10, 13],
            strokeWidth: 2, // optional
          },
          {
            data: [20, 15, 13, 16, 19],
            strokeWidth: 2, // optional
          },
        ],
      };
    return (
        <View>
            <LineChart
                data={line}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                chartConfig={{
                backgroundColor: '#313131',
                backgroundGradientFrom: '#313131',
                backgroundGradientTo: '#313131',
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16
                }}
            />
            <StackedBarChart
            data={{
                labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'],
                legend: ['Mekanik', 'Miljöteknik', 'Envariabelanalys'],
                data: [[5, 3, 0], [3, 2, 3], [1, 2, 5], [0, 0, 8], [2, 4, 1]],
                barColors: ['#66C7FD', '#5987CC', '#AC7CE4'],
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
                // backgroundColor: '#1cc910',
                // backgroundGradientFrom: '#eff3ff',
                // backgroundGradientTo: '#efefef',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                style: {
                borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            />

</View>
    );
}





export default GraphScreen
