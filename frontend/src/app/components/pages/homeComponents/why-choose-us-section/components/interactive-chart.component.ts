import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

@Component({
  selector: 'app-interactive-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #chartCanvas></canvas>',
  styles: ['canvas { width: 100% !important; height: 100% !important; }']
})
export class InteractiveChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Experience', 'Customization', 'Timeliness', 'Support', 'Innovation'],
          datasets: [{
            label: 'Our Performance',
            data: [95, 90, 85, 92, 88],
            fill: true,
            backgroundColor: 'rgba(255, 107, 53, 0.2)',
            borderColor: 'rgb(255, 107, 53)',
            pointBackgroundColor: 'rgb(255, 107, 53)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 107, 53)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: false
              },
              suggestedMin: 50,
              suggestedMax: 100,
              ticks: {
                stepSize: 10,
                font: {
                  size: 10
                }
              },
              pointLabels: {
                font: {
                  size: 12
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
}