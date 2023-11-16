import {StyleSheet, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {Canvas, Group, Path, SkiaValue} from '@shopify/react-native-skia';
import {Label} from './Label';
import {LAYOUT} from '../constants/layout';
import {Cursor} from './Cursor';
import {DateIndicator} from './DateIndicator';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {findClosestValue} from '../utils/findClosestValue';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {getYForX} from '../utils/math';
import {CurrencyInfo} from '../hooks/useCurrencyInfo';

interface GraphCanvasProps {
  currentPath: SkiaValue<string>;
  currentGraph: any;
  todaysRate: number;
  currencyInfo: CurrencyInfo;
}

const GraphCanvas = ({
  currentPath,
  currentGraph,
  todaysRate,
  currencyInfo,
}: GraphCanvasProps) => {
  const {width, height} = useWindowDimensions();

  const isGraphTouched = useSharedValue(false);

  const x = useSharedValue(width); //start pos = right because current date is the last one on graph
  const y = useDerivedValue(() => {
    return getYForX(currentGraph.curve.toCmds(), x.value);
  });

  const graphGesture = Gesture.Pan()
    .onBegin(e => {
      isGraphTouched.value = true;
      const dayPositions = Array.from(
        {length: currentGraph.timeFrames},
        (_, index) => (width * index) / (currentGraph.timeFrames - 1),
      );
      const closest = findClosestValue(e.x, dayPositions);
      x.value = withTiming(closest!, {duration: 300});
    })
    .onChange(e => {
      const dayPositions = Array.from(
        {length: currentGraph.timeFrames},
        (_, index) => (width * index) / (currentGraph.timeFrames - 1),
      );
      const closest = findClosestValue(e.x, dayPositions);
      x.value = withTiming(closest!, {duration: 300});
    })
    .onEnd(() => {
      isGraphTouched.value = false;
    });

  return (
    <View style={styles.canvasContainer}>
      <GestureDetector gesture={graphGesture}>
        <Canvas
          style={{
            width: width,
            height: height / 2 + LAYOUT.spacing.GRAPH_TOP,
          }}>
          <Label
            max={currentGraph.max}
            min={currentGraph.min}
            y={y}
            todaysRate={todaysRate}
            currencyQuotName={currencyInfo.Cur_QuotName_Eng.toUpperCase()}
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
              dates={currentGraph.dates}
              isGraphTouched={isGraphTouched}
            />
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default GraphCanvas;

const styles = StyleSheet.create({
  canvasContainer: {
    paddingTop: LAYOUT.spacing.CANVAS_TOP,
  },
});
