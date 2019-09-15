import { Component, OnInit } from '@angular/core';
import TweenMax from '../../assets/js/TweenMax.min.js';
import * as paper from 'paper';
import {Color} from 'paper';
// import * as paper from '../../assets/js/paper-core.min.js';  // Run `npm install --save
import * as SimplexNoise from '../../assets/js/simplex-noise.min.js';  // Run `npm install --save
@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.css']
})
export class CursorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let clientX = -100;
    let clientY = -100;
    const innerCursor = (document.querySelector('.cursor--small') as HTMLDivElement);
    // this.loadScript('../assets/js/TweenMax.min.js');
    const initCursor = () => {
      // add listener to track the current mouse position
      document.addEventListener('mousemove', e => {
        clientX = e.clientX;
        clientY = e.clientY;
      });

      // transform the innerCursor to the current mouse position
      // use requestAnimationFrame() for smooth performance
      const render = () => {
        // innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
        // if you are already using TweenMax in your project, you might as well
        // use TweenMax.set() instead
        TweenMax.set(innerCursor, {
          x: clientX,
          y: clientY
        });

        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    };

    initCursor();
    let lastX = 0;
    let lastY = 0;
    let isStuck = false;
    let showCursor = false;
    let group, stuckX, stuckY, fillOuterCursor;

    const initCanvas = () => {
      const canvas = (document.querySelector('.cursor--canvas') as HTMLCanvasElement);
      const shapeBounds = {
        width: 75,
        height: 75
      };
      paper.setup(canvas);
      const strokeColor = "'#000000'";
      const strokeWidth = 1;
      const segments = 8;
      const radius = 10;

      // we'll need these later for the noisy circle
      const noiseScale = 150; // speed
      const noiseRange = 4; // range of distortion
      let isNoisy = true; // state

      // the base shape for the noisy circle
      const polygon = new paper.Path.RegularPolygon(
        new paper.Point(1, 1),
        segments,
        radius
      );
      polygon.strokeColor = new Color(0, 0, 0);
      polygon.strokeWidth = strokeWidth;
      polygon.smooth();
      group = new paper.Group([polygon]);
      group.applyMatrix = false;

      const noiseObjects = polygon.segments.map(() => new SimplexNoise());
      let bigCoordinates = [];
      
      // function for linear interpolation of values
      const lerp = (a, b, n) => {
        return (1 - n) * a + n * b;
      };

      // function to map a value from one range to another range
      const map = (value, in_min, in_max, out_min, out_max) => {
        return (
          ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
      };

      // the draw loop of Paper.js 
      // (60fps with requestAnimationFrame under the hood)
      paper.view.onFrame = event => {
        // using linear interpolation, the circle will move 0.2 (20%)
        // of the distance between its current position and the mouse
        // coordinates per Frame
        lastX = lerp(lastX, clientX, 0.2);
        lastY = lerp(lastY, clientY, 0.2);
        group.position = new paper.Point(lastX, lastY);
      }
    }


    initCanvas();
  }



}
