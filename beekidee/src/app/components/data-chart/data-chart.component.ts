import { Component, OnInit, inject } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { ConsoleService } from "../../services/console.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend?: ApexLegend;
};

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements OnInit {
  public chartOptions!: ChartOptions;

  private console = inject(ConsoleService);

  ngOnInit() {
    // sensible defaults to avoid undefined bindings during first render
    this.chartOptions = {
      series: [
        { name: 'Session 001', data: [] },
        { name: 'Session 002', data: [] }
      ],
      chart: {
        type: "bar",
        height: 700,
        toolbar: { show: true }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "85%",
          dataLabels: { position: "center" }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => (val === null || val === undefined ? "" : `${val}`),
        offsetY: -10
      },
      title: { text: "Session-wise Marks Comparison", align: "center" },
      xaxis: {
        categories: [],
        title: { text: "Student Name" },
        labels: { rotate: -45 }
      },
      yaxis: {
        title: { text: "Marks" },
        min: 0,
        max: 4,
      },
      legend: { position: "top" }
    };

    this.console.getAllResults().subscribe((results: any[]) => {
      // Build category list (union of student names across both sessions)
      const namesSet = new Set<string>();
      const s1Map: Record<string, number> = {};
      const s2Map: Record<string, number> = {};

      results.forEach((r: any) => {
        const name = r.studentName ?? "Unknown";
        const marks = Number(r.marks ?? 0);
        namesSet.add(name);

        if (r.sessionId === "001") s1Map[name] = marks;
        else if (r.sessionId === "002") s2Map[name] = marks;
      });

      const categories = Array.from(namesSet);
      const session1Data = categories.map(n => (n in s1Map ? s1Map[n] : null));
      const session2Data = categories.map(n => (n in s2Map ? s2Map[n] : null));

      this.chartOptions = {
        ...this.chartOptions,
        series: [
          { name: "Session 001", data: session1Data },
          { name: "Session 002", data: session2Data }
        ],
        xaxis: {
          ...this.chartOptions.xaxis,
          categories
        }
      };
    });
  }
}
