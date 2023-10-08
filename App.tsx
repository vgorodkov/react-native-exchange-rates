import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import {DataPoint, weekData, monthData} from './src/data/mock';
import {Canvas, Line, Path, Skia, vec} from '@shopify/react-native-skia';

const GRAPH_HEIGHT = 400;
const GRAPH_WIDTH = 370;

const makeGraph = (data: DataPoint[]) => {
  const max = Math.max(...data.map(val => val.Cur_OfficialRate));
  const min = Math.min(...data.map(val => val.Cur_OfficialRate));
  const maxDate = data[data.length - 1].Date;
  const minDate = data[0].Date;
  const y = scaleLinear().domain([min, max]).range([GRAPH_HEIGHT, 35]);

  const x = scaleTime()
    .domain([new Date(minDate), new Date(maxDate)])
    .range([10, GRAPH_WIDTH - 10]);

  const curvedLine = line<DataPoint>()
    .x(d => x(new Date(d.Date)))
    .y(d => y(d.Cur_OfficialRate))
    .curve(curveBasis)(data);

  const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
  console.log(skPath);

  return {
    max,
    min,
    curve: skPath!,
  };
};

const App = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const graphData = [weekData, monthData];
  const graph = makeGraph(graphData[selectedPeriod]);

  return (
    <View style={styles.container}>
      <Canvas style={{width: GRAPH_WIDTH, height: GRAPH_HEIGHT}}>
        <Line
          p1={vec(10, 130)}
          p2={vec(400, 130)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 250)}
          p2={vec(400, 250)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 370)}
          p2={vec(400, 370)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Path
          style="stroke"
          path={graph.curve}
          strokeWidth={4}
          color="#6231ff"
        />
      </Canvas>
      <View style={styles.btnContainer}></View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
