import {Skia} from '@shopify/react-native-skia';
import {curveBumpX, line, scaleLinear, scaleTime} from 'd3';
import {DataPoint} from '../data/mock';
import {LAYOUT} from '../constants/layout';

export const makeGraph = (data: DataPoint[], width: number, height: number) => {
  if (data) {
    if (data.length > 180) {
      data = data.filter(item => {
        const date = new Date(item.Date);
        if (date.getDay() === 0) {
          return item;
        }
      });
    }
    const dates = data.map(item => item.Date);

    const max = Math.max(...data.map(val => val.Cur_OfficialRate));
    const min = Math.min(...data.map(val => val.Cur_OfficialRate));
    const maxDate = dates[dates.length - 1];
    const minDate = dates[0];
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
      timeFrames: dates.length,
      dates,
    };
  }
};
