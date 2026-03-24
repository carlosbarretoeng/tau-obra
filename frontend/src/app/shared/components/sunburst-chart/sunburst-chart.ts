import { Component, input, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';

interface SunburstItem {
  label: string;
  value: number;
  color: string;
  children?: SunburstItem[];
}

interface ArcSegment {
  path: string;
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-sunburst-chart',
  standalone: true,
  imports: [CommonModule, ShortNumberPipe],
  templateUrl: './sunburst-chart.html',
  styleUrl: './sunburst-chart.css'
})
export class SunburstChartComponent implements OnInit {
  selectedSegment = signal<ArcSegment | null>(null);
  data = input<SunburstItem[]>([]);

  centralValue = computed(() => this.data().reduce((sum, item) => sum + item.value, 0));
  innerArcs = computed(() => this.calculateArcs(this.data(), 40, 65));
  outerArcs = computed(() => {
    const parentData = this.data();
    const childrenFlat: SunburstItem[] = [];
    parentData.forEach(p => {
      if (p.children) {
        childrenFlat.push(...p.children);
      } else {
        // Dummy child if no children
        childrenFlat.push({ label: '', value: p.value, color: 'transparent' });
      }
    });
    return this.calculateArcs(childrenFlat, 68, 90);
  });

  ngOnInit() { }

  selectSegment(segment: ArcSegment) {
    if (this.selectedSegment()?.label === segment.label) {
      this.selectedSegment.set(null);
    } else {
      this.selectedSegment.set(segment);
    }
  }

  private calculateArcs(items: SunburstItem[], innerRadius: number, outerRadius: number): ArcSegment[] {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    return items.map(item => {
      const angle = (item.value / total) * 360;
      const arc = this.describeArc(100, 100, innerRadius, outerRadius, startAngle, startAngle + angle);
      const segment: ArcSegment = { path: arc, label: item.label, value: item.value, color: item.color };
      startAngle += angle;
      return segment;
    });
  }

  private describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
    const startInner = this.polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = this.polarToCartesian(x, y, innerRadius, startAngle);
    const startOuter = this.polarToCartesian(x, y, outerRadius, startAngle);
    const endOuter = this.polarToCartesian(x, y, outerRadius, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
      "L", startInner.x, startInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, endInner.x, endInner.y,
      "Z"
    ].join(" ");
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
}
