import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

interface IBottomAxis {
  scale: d3.ScaleBand<string>;
  transform: string;
}

export const BottomAxis: React.FC<IBottomAxis> = ({ scale, transform }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const bottomAxis = d3
        .select(ref!.current)
        .call(d3.axisBottom(scale).tickSize(0).tickPadding(25));
      bottomAxis
        .selectAll('text')
        .style('font-size', 13)
        .style('color', '#6E6E6E')
        .style('overflow', 'hidden');
      bottomAxis.selectAll('path').style('color', '#A1A1A1');
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
};
