import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromDashboard from '../reducers';

@Component({
  selector: 'app-bubble-chart',
  template:
  `
    <div class="row justify-content-center">
      <svg class="bubble"></svg>
    </div>
  `,
  styles: [
    `
    `,
  ],
})
export class BubbleChartComponent implements OnInit, OnDestroy {
  @Input() height = 932;
  @Input() width = 932;
  @Output() navigate = new EventEmitter();

  dataSubscription!: Subscription;
  private svg: any;
  private root: any;
  private count = 0;
  private format = d3.format(',d');
  private color: any;

  constructor(private computerStore: Store<fromDashboard.State>) {

    this.dataSubscription = computerStore.select(fromDashboard.selectAllKeywords).pipe(
      map((wordlist) => {
        return wordlist.map((ele: any) => {
          return {
            name: ele.text,
            value: ele.weight,
            title: '',
            group: ''
          };
        });
      })
    ).subscribe((data: any) => {
      if (data.length !== 0) {
        this.color = d3.scaleOrdinal(data.map((d: any) => d.group), d3.schemeCategory10);
        this.root = this.pack(data);
        this.svg = d3.select('svg.bubble')
                      .attr('width', this.width)
                      .attr('height', this.height)
                      .attr('viewBox', `0,0,${this.width},${this.height}`)
                      .attr('font-size', '20px')
                      .attr('fill', '#fff')
                      .attr('font-family', 'sans-serif')
                      .attr('text-anchor', 'middle');
        this.building();
      }
    });
  }

  ngOnInit() {}

  pack(data: any) {
    return d3.pack()
              .size([this.width - 2, this.height - 2])
              .padding(3)
              (d3.hierarchy({ children: data })
              .sum((d: any) => d.value));
  }

  building() {
    const leaf = this.svg.selectAll('g')
                          .data(this.root.leaves())
                          .join('g')
                          .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    leaf.append('circle')
        .attr('id', (d: any) => (d.leafUid = this.getUid('leaf')))
        .attr('r', (d: any) => d.r)
        .attr('fill-opacity', 0.8)
        .attr('fill', (d: any) => this.color(d.data.group));
    this.count = 0;
    leaf.append('clipPath')
        .attr('id', (d: any) => (d.clipUid = this.getUid('clip')))
        .append('use')
        .attr('xlink:href', (d: any) => d.leafUid.href);

    leaf.append('text')
        .attr('clip-path', (d: any) => d.clipUid)
        .selectAll('tspan')
        .data((d: any) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
        .join('tspan')
        .attr('x', 0)
        .attr('y', (d: any, i: any, nodes: any) => `${i - nodes.length / 2 + 0.8}em`)
        .text((d: any) => d);

    leaf.append('title')
        .text((d: any) => `${d.data.title === undefined ? '' : `${d.data.title}`} ${this.format(d.value)}`);
    return this.svg.node();
  }

  getUid(name: string) {
    this.count++;
    return `O-${name}-${this.count}`;
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}

