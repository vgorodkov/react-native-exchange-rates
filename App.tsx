import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {DataPoint} from './src/data/mock';
import {Canvas, Group, Paint, Path} from '@shopify/react-native-skia';
import {Label} from './src/components/Label';
import axios from 'axios';
import {getCurrentDate, handleDate} from './src/utils/handleDate';
import {makeGraph} from './src/utils/makeGraph';
import Selection from './src/components/Selection';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {useGraphTouchHandler} from './src/hooks/useGraphTouchHanlder';
import Cursor from './src/components/Cursor';
import {getYForX} from './src/utils/math';

const cursorSize = 42;

const App = () => {
  const window = useWindowDimensions();
  const {width, height} = window;

  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState<DataPoint[] | null>(null);

  //month/day/year
  const [startDate, setStartDate] = useState(handleDate('1week'));
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  const graph = makeGraph(graphData!, width, height / 2);

  const dates = graphData?.map(item => item.Date);

  const x = useSharedValue(width);
  const y = useDerivedValue(() => {
    if (graph?.curve) {
      return getYForX(graph.curve.toCmds(), x.value);
    } else {
      return 0;
    }
  });

  const gesture = useGraphTouchHandler(x, width, graphData!?.length);
  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: cursorSize,
      height: cursorSize,
      left: x.value - cursorSize / 2,
      top: y.value - cursorSize / 2 + 64 + 16, //graphPadding+canvasPadding
    };
  });

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://api.nbrb.by/ExRates/Rates/Dynamics/431?startDate=${startDate}&endDate=${currentDate}`, //change end Date to current Date. Now api not working for current Day
      )
      .then(({data}) => {
        setGraphData(data);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [startDate, currentDate]);

  if (isLoading && !graphData) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size={'large'} color={'cyan'} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar hidden />
      <View style={styles.container}>
        {graph && graphData && (
          <View style={styles.graphContainer}>
            <Canvas style={{width: width, height: height / 2 + 64}}>
              <Label
                max={graph.max}
                min={graph.min}
                y={y}
                x={x}
                dates={dates}
              />
              <Group transform={[{translateY: 64}]}>
                <Path
                  style="stroke"
                  path={graph.curve}
                  strokeWidth={3}
                  color="cyan"
                />
                <Cursor x={x} y={y} />
              </Group>
            </Canvas>
            <GestureDetector gesture={gesture}>
              <Animated.View style={[style]} />
            </GestureDetector>
          </View>
        )}
        <Selection setStartDate={setStartDate} />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031926',
  },
  graphContainer: {
    paddingTop: 16,
  },
  circle: {
    borderWidth: 1,
  },
});
