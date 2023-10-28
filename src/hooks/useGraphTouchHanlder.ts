import {type SharedValue, withTiming} from 'react-native-reanimated';

import {Gesture} from 'react-native-gesture-handler';
import {useMemo} from 'react';

export const useGraphTouchHandler = (
  x: SharedValue<number>,
  width: number,
  timeFrame: number,
) => {
  const dayPositions = Array.from(
    {length: timeFrame},
    (_, index) => (width * index) / (timeFrame - 1),
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange(pos => {
          const nearestDayPosition = dayPositions.reduce((closest, dayPos) => {
            return Math.abs(dayPos - (x.value + pos.x)) <
              Math.abs(closest - (x.value + pos.x))
              ? dayPos
              : closest;
          });
          x.value = withTiming(nearestDayPosition, {duration: 300});
        })
        .onEnd(() => {}),
    [x, dayPositions],
  );
  return gesture;
};
