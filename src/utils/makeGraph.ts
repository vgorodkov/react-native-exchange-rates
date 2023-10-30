import {Skia} from '@shopify/react-native-skia';
import {curveBumpX, line, scaleLinear, scaleTime} from 'd3';
import {DataPoint} from '../data/mock';
import {LAYOUT} from '../constants/layout';

export const makeGraph = (data: DataPoint[], width: number, height: number) => {
  if (data) {
    const max = Math.max(...data.map(val => val.Cur_OfficialRate));
    const min = Math.min(...data.map(val => val.Cur_OfficialRate));
    const maxDate = data[data.length - 1].Date;
    const minDate = data[0].Date;
    const y = scaleLinear()
      .domain([min, max])
      .range([
        height - LAYOUT.spacing.GRAPH_VERTICAL,
        LAYOUT.spacing.GRAPH_VERTICAL,
      ]);

    const x = scaleTime()
      .domain([new Date(minDate), new Date(maxDate)])
      .range([0, width]);

    const curvedLine = line<DataPoint>()
      .x(d => x(new Date(d.Date)))
      .y(d => y(d.Cur_OfficialRate))
      .curve(curveBumpX)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
    return {
      max,
      min,
      curve: skPath!,
      maxDate,
      minDate,
      timeFrames: data.length,
    };
  }
};
