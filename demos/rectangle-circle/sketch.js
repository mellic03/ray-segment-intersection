"use strict";


let cx, cy;
let r = 50.0;

let rx = 500;
let ry = 250;
let rw = 100;
let rh = 200;
let theta = 0.0;


function clamp(n, a, b)
{
    return max(a, min(n, b));
}


function intersects()
{
    // de-translate
    let x = cx - rx;
    let y = cy - ry;

    // de-rotate
    x = x*cos(-theta) - y*sin(-theta);
    y = x*sin(-theta) + y*cos(-theta);

    let nx = clamp(x, 0, rw);
    let ny = clamp(y, 0, rh);

    // circle(iix, iiy, 10);
    // line(cx, cy, iix, iiy);
    let distSq = (nx-x)*(nx-x) + (ny-y)*(ny-y);

    if (distSq < r*r)
    {
        return true;
    }

    return false;
}


function setup()
{
    createCanvas(1000, 500);
}


function draw()
{
    background(220);

    cx = mouseX;
    cy = mouseY;


    if (intersects())
    {
        fill(100, 255, 100);
    }
    else
    {
        fill(255);
    }

    circle(cx, cy, r*2);

    fill(0);
    text("clamp(cx, rx, rx+rw) = " + clamp(cx, rx, rx+rw), 20, 30);


    let xmin = -rw;
    let xmax = +rw;
    let ymin = -rh;
    let ymax = +rh;

    const S = sin(theta);
    const C = cos(theta);

    let x0 = (xmin)*C - (ymin)*S + rx;
    let y0 = (ymin)*S + (xmin)*C + ry;

    let x1 = (xmax)*C - (ymin)*S + rx;
    let y1 = (ymin)*S + (xmax)*C + ry;

    let x2 = (xmax)*C - (ymax)*S + rx;
    let y2 = (ymax)*S + (xmax)*C + ry;

    let x3 = (xmin)*C - (ymax)*S + rx;
    let y3 = (ymax)*S + (xmin)*C + ry;


    line(x0, y0, x1, y1);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x0, y0);


    fill(255, 0, 0);
    circle(x0, y0, 10);

    fill(0, 255, 0);
    circle(x1, y1, 10);

    fill(0, 0, 255);
    circle(x2, y2, 10);

    fill(255, 255, 0);
    circle(x3, y3, 10);





    // translate(rx, ry);
    // rotate(theta);
    // noFill();
    // rect(rx, ry, rw, rh);

    theta += 0.01;
}
