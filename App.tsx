import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';

import {
  Easing,
  runTiming,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';

import {getCurrentDate, handleDate} from './src/utils/handleDate';
import {makeGraph} from './src/utils/makeGraph';
import {fetchDataByCurrency} from './src/utils/fetchDataByCurrency';

import Selection from './src/components/Selection';
import {CurrencyItem} from './src/components/CurrencyItem';
import ListHeader from './src/components/ListHeader';

import useCurrencyDynamicsFetch from './src/hooks/useCurrencyDynamicsFetch';
import useCurrencyInfo from './src/hooks/useCurrencyInfo';

import {CURRENCIES} from './src/data/currencies';

import {GraphPeriods} from './src/constants/time';
import GraphCanvas from './src/components/GraphCanvas';

const ListSeparator = () => {
  return <View style={styles.separator} />;
};

const App = () => {
  const {width, height} = useWindowDimensions();
  const currentDate = getCurrentDate();

  //month/day/year
  const [startDate, setStartDate] = useState(handleDate(GraphPeriods.oneWeek));
  const [currencyId, setCurrencyId] = useState(CURRENCIES[0].id); //USD by default

  const {
    data,
    isLoading,
    error: dynamicsError,
  } = useCurrencyDynamicsFetch(currencyId, startDate, currentDate);

  const {data: currencyInfo, error: infoError} = useCurrencyInfo(currencyId);

  const graph = data.length > 0 ? makeGraph(data, width, height / 2) : null;

  //store current graph and next one to make transition betweeen them
  const graphs = useValue({
    current: graph,
    next: graph,
  });
  const isTransitionCompleted = useValue(1);

  //write new graph on first load or graphs period change
  useEffect(() => {
    if (graph) {
      graphs.current = {
        current: graph,
        next: graph,
      };
    }
  }, [data.length]);

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

  if (dynamicsError || infoError) {
    return (
      <LinearGradient colors={['#1F0121', '#000000']} style={styles.loading}>
        <Text style={{fontSize: 36, color: white}}>Network error</Text>
      </LinearGradient>
    );
  }

  if (isLoading && data.length <= 0) {
    return (
      <LinearGradient colors={['#1F0121', '#000000']} style={styles.loading}>
        <ActivityIndicator size={'large'} color={'#F3DFBF'} />
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />
      <LinearGradient colors={['#1F0121', '#000000']} style={styles.container}>
        {graphs.current.current && currencyInfo && (
          <GraphCanvas
            currentPath={currentPath}
            currentGraph={graphs.current.current}
            todaysRate={data[data.length - 1].Cur_OfficialRate}
            currencyInfo={currencyInfo}
          />
        )}
        <Selection setStartDate={setStartDate} />
        <FlatList
          data={CURRENCIES}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.currencyListContent}
          ListHeaderComponent={<ListHeader />}
          ListHeaderComponentStyle={styles.currencyListHeader}
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
  currencyListContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  currencyListHeader: {
    marginBottom: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#606060',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
