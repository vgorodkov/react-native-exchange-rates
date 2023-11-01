import {
  StyleSheet,
  View,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {
  Canvas,
  Easing,
  Group,
  Path,
  runTiming,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import {Label} from './src/components/Label';

import {getCurrentDate, handleDate} from './src/utils/handleDate';
import {makeGraph} from './src/utils/makeGraph';
import Selection from './src/components/Selection';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Cursor from './src/components/Cursor';
import {getYForX} from './src/utils/math';
import {CurrencyItem} from './src/components/CurrencyItem';
import useCurrencyDynamicsFetch from './src/hooks/useCurrencyDynamicsFetch';

import {CURRENCIES} from './src/data/currencies';
import {fetchDataByCurrency} from './src/utils/fetchDataByCurrency';
import {LAYOUT} from './src/constants/layout';
import {GraphPeriods} from './src/constants/time';
import ListHeader from './src/components/ListHeader';
import LinearGradient from 'react-native-linear-gradient';
import {DateIndicator} from './src/components/DateIndicator';

const ListSeparator = () => {
  return <View style={styles.separator} />;
};

function findClosestValue(input: number, array: number[]): number | null {
  'worklet';
  if (array.length === 0) {
    return null; // Handle the case when the array is empty.
  }

  let closestValue = array[0];
  let minDifference = Math.abs(input - closestValue);

  for (let i = 1; i < array.length; i++) {
    const currentDifference = Math.abs(input - array[i]);
    if (currentDifference < minDifference) {
      closestValue = array[i];
      minDifference = currentDifference;
    }
  }

  return closestValue;
}

const App = () => {
  const {width, height} = useWindowDimensions();
  const currentDate = getCurrentDate();

  //month/day/year
  const [startDate, setStartDate] = useState(handleDate(GraphPeriods.oneWeek));
  const [currencyId, setCurrencyId] = useState(431); //431 - default to USD

  const {data, isLoading} = useCurrencyDynamicsFetch(
    currencyId,
    startDate,
    currentDate,
  );

  const graph = data.length > 0 ? makeGraph(data, width, height / 2) : null;
  const dates = data?.map(item => item.Date);

  //store current graph and next one to make transition betweeen them
  const graphs = useValue({
    current: graph,
    next: graph,
  });
  const isTransitionCompleted = useValue(1);

  //write new graph if first load or graphs period change
  useEffect(() => {
    if (data.length > 0) {
      graphs.current = {
        current: graph,
        next: graph,
      };
    }
  }, [data.length]);

  const x = useSharedValue(width); //start pos = right because current date is the last one on graph
  const y = useDerivedValue(() => {
    if (graphs.current.current?.curve) {
      return getYForX(graphs.current.current.curve.toCmds(), x.value);
    } else {
      return 0;
    }
  }, [graphs.current.current?.curve]);

  const transitionChartAnimation = () => {
    isTransitionCompleted.current = 0;

    runTiming(isTransitionCompleted, 1, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const changeCurrency = useCallback(
    async (id: number) => {
      const newGraphData = await fetchDataByCurrency(
        id,
        startDate,
        currentDate,
      );
      const newGraph = makeGraph(newGraphData, width, height / 2);
      graphs.current = {
        current: newGraph,
        next: graphs.current.current,
      };
      transitionChartAnimation();
      setCurrencyId(id);
    },
    [startDate],
  );

  const currentPath = useComputedValue(() => {
    const start = graphs.current.current?.curve;
    const end = graphs.current.next?.curve;
    const result = start?.interpolate(end!, isTransitionCompleted.current);

    return result?.toSVGString() ?? '';
  }, [isTransitionCompleted, graphs.current.current, graphs.current]);

  const newGesture = Gesture.Pan()
    .onBegin(e => {
      if (graph) {
        const dayPositions = Array.from(
          {length: graph?.timeFrames},
          (_, index) => (width * index) / (graph?.timeFrames - 1),
        );
        const closest = findClosestValue(e.x, dayPositions);
        x.value = withTiming(closest!, {duration: 300});
      }
    })
    .onChange(e => {
      if (graph) {
        const dayPositions = Array.from(
          {length: graph?.timeFrames},
          (_, index) => (width * index) / (graph?.timeFrames - 1),
        );
        const closest = findClosestValue(e.x, dayPositions);
        x.value = withTiming(closest!, {duration: 300});
      }
    });

  if (isLoading && data.length <= 0) {
    return (
      <LinearGradient colors={['#1F0121', '#000000']} style={styles.container}>
        <ActivityIndicator size={'large'} color={'#F3DFBF'} />
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />
      <LinearGradient colors={['#1F0121', '#000000']} style={styles.container}>
        {graphs.current.current && (
          <View style={styles.canvasContainer}>
            <GestureDetector gesture={newGesture}>
              <Canvas
                style={{
                  width: width,
                  height: height / 2 + LAYOUT.spacing.GRAPH_TOP,
                }}>
                <Label
                  max={graphs.current.current.max}
                  min={graphs.current.current.min}
                  y={y}
                  todaysRate={data[data.length - 1].Cur_OfficialRate}
                />
                <Group transform={[{translateY: LAYOUT.spacing.GRAPH_TOP}]}>
                  <Path
                    style="stroke"
                    path={currentPath}
                    strokeWidth={3}
                    color="#F3DFBF"
                  />
                  <Cursor x={x} y={y} />
                  <DateIndicator
                    x={x}
                    height={height / 2}
                    width={width}
                    dates={dates}
                  />
                </Group>
              </Canvas>
            </GestureDetector>
          </View>
        )}
        <Selection setStartDate={setStartDate} />

        <FlatList
          data={CURRENCIES}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.currencyListContent}
          ListHeaderComponent={<ListHeader />}
          ListHeaderComponentStyle={{marginBottom: 16}}
          ItemSeparatorComponent={<ListSeparator />}
          renderItem={({item}) => (
            <CurrencyItem
              img={item.img}
              name={item.name}
              id={item.id}
              key={item.id}
              changeCurrency={changeCurrency}
              isActive={item.id === currencyId}
            />
          )}
        />
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {flex: 1},

  container: {
    flex: 1,
  },
  canvasContainer: {
    paddingTop: LAYOUT.spacing.CANVAS_TOP,
  },
  centeredView: {justifyContent: 'center', alignItems: 'center'},
  currencyListContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#606060',
  },
});
