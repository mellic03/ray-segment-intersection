"use strict";

class vec2
{
    x;
    y;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
};

function vec2_add(u, v)
{
    return new vec2(u.x+v.x, u.y+v.y);
}

function vec2_sub(u, v)
{
    return new vec2(u.x-v.x, u.y-v.y);
}

function vec2_mul(u, s)
{
    return new vec2(u.x*s, u.y*s);
}

function vec2_div(u, s)
{
    return new vec2(u.x/s, u.y/s);
}

function vec2_mag(u)
{
    return sqrt(u.x**2 + u.y**2);
}

function vec2_normalize(u)
{
    return vec2_div(u, vec2_mag(u));
}

function vec2_dot(u, v)
{
    return u.x*v.x + u.y*v.y;
}

function vec2_cross(u, v)
{
    return u.x*v.y - v.x*u.y;
}

function vec2_rotate(u, theta)
{
    return new vec2(
        cos(theta)*u.x - sin(theta)*u.y,
        sin(theta)*u.x + cos(theta)*u.y,
    );
}


function vec2_line(a, b)
{
    line(a.x, a.y, b.x, b.y);
}


function ray_line_intersection(origin, dir, a, b)
{
    let u = vec2_sub(a, origin);
    let v = vec2_sub(b, origin);

    let m = vec2_add(vec2_normalize(u), vec2_normalize(v));
        m = vec2_div(m, 2);
        m = vec2_normalize(m);

    if (vec2_dot(dir, m) < 0.0)
    {
        return false;
    }

    const sign_a = Math.sign(vec2_cross(u, dir));
    const sign_b = Math.sign(vec2_cross(dir, v));

    if (sign_a != sign_b)
    {
        return false;
    }

    return true;
}


let lines = [];

let P1 = [];
let P2 = [];
let P3 = [
    [new vec2(1.5*250, 1.5*150), new vec2(1.5*350, 1.5*120)],
    [new vec2(1.5*350, 1.5*120), new vec2(1.5*300, 1.5*200)],
    [new vec2(1.5*300, 1.5*200), new vec2(1.5*340, 1.5*225)],
    [new vec2(1.5*340, 1.5*225), new vec2(1.5*400, 1.5*150)],
    [new vec2(1.5*400, 1.5*150), new vec2(1.5*400, 1.5*300)],
    [new vec2(1.5*400, 1.5*300), new vec2(1.5*300, 1.5*300)],
    [new vec2(1.5*300, 1.5*300), new vec2(1.5*250, 1.5*150)]
];

let P1Theta = Math.PI/2.0;
let P2Theta = Math.PI/2.0;

let P1NGon = 4;
let P2NGon = 4;

let xmin;
let xmax;
let ymin;
let ymax;


function setup()
{
    createCanvas(1000, 500);
    // P2Theta = radians(45.0);


    /*
        Bounding region:

        xmin = max( min(red x),  min(blue x) )
        xmax = min( max(red x),  max(blue x) )
        ymin = max( min(red y),  min(blue y) )
        ymax = min( max(red y),  max(blue y) )
    */

    // let bounds1 = generateNGon(P1, P1NGon, A, 150, P1Theta);
    // let bounds2 = generateNGon(P2, P2NGon, B, 150, P2Theta);
    
    
    generateNGon(P2, P2NGon, B, 150, P2Theta);

    // xmin = max(bounds1[0], bounds2[0]);
    // xmax = min(bounds1[1], bounds2[1]);
    // ymin = max(bounds1[2], bounds2[2]);
    // ymax = min(bounds1[3], bounds2[3]);
}


let origin     = new vec2(256, 256);
let dir        = new vec2(1.0, 0.01);
let A          = new vec2(200, 300);
let B          = new vec2(600, 300);
let overlapRes = 8.0;
let rayStroke  = 0;

function draw()
{
    background(220);
    strokeWeight(2);

    origin.x = mouseX;
    origin.y = mouseY;
    dir = vec2_normalize(dir);


    P1 = [];
    P2 = [];

    generateNGon(P1, P1NGon, A, Math.sqrt(200*200 + 200*200), P1Theta);
    generateNGon(P2, P2NGon, B, Math.sqrt(200*200 + 200*200), P2Theta);


    strokeWeight(2);
    rayStroke = 0;

    drawLines(P1);
    drawLines(P2);

    overlapRes = max(overlapRes, 1.0);
    overlapRes = min(overlapRes, 512.0);
    let area = overlapArea(P1, P2, overlapRes);


    strokeWeight(1);
    stroke(0);

    for (let i=100; i<1000; i+=100)
    {
        text(i/100, i, 20);
    }

    for (let i=100; i<500; i+=100)
    {
        text(i/100, 1000-20, i);
    }

    strokeWeight(1);
    stroke(0, 0, 0, 50);

    for (let i=100; i<1000; i+=100)
    {
        line(i, 30, i, 512);
    }

    for (let i=100; i<500; i+=100)
    {
        line(0, i, 1000-30, i);
    }


    strokeWeight(1);
    fill(0);
    noStroke();
    textSize(16)

    text("Increase/decrease resolution: up/down arrow keys", 20, 50);
    text("Cycle through polygons: left/right arrow keys", 20, 80);
    text("Rotate: q/e and u/o", 20, 110);
    text("Move A: wasd", 20, 140);
    text("Move B: ijkl", 20, 170);

    text("Overlap area: " + area, 20, 200);

    keyInput();
}


function pointInPolygon( x, y, P )
{
    let total = 0;

    for (let line of P)
    {
        if (ray_line_intersection(new vec2(x, y), new vec2(0.999, 0.0001), line[0], line[1]))
        {
            total += 1;
        }
    }

    if (total % 2 == 1)
    {
        return true;
    }

    return false;
}


/**
 * @param {*} A 
 * @param {*} B 
 * @returns (xmin, xmax, ymin, ymax)
*/
function minMaxIntersections( A, B )
{
    for (let l1 of A)
    {
        for (let l2 of B)
        {

        }
    }
}


function _overlapArea( A, B, size )
{

}


function overlapArea( A, B, width )
{
    let xmin = +999999999999.0;
    let xmax = -999999999999.0;
    let ymin = +999999999999.0;
    let ymax = -999999999999.0;

    for (let line of A)
    {
        xmin = min(xmin, line[0].x);
        xmax = max(xmax, line[0].x);
        ymin = min(ymin, line[0].y);
        ymax = max(ymax, line[0].y);
    }
    let bounds1 = [xmin, xmax, ymin, ymax];

    xmin = +999999999999.0;
    xmax = -999999999999.0;
    ymin = +999999999999.0;
    ymax = -999999999999.0;

    for (let line of B)
    {
        xmin = min(xmin, line[0].x);
        xmax = max(xmax, line[0].x);
        ymin = min(ymin, line[0].y);
        ymax = max(ymax, line[0].y);  
    }
    let bounds2 = [xmin, xmax, ymin, ymax];


    xmin = max(bounds1[0], bounds2[0]);
    xmax = min(bounds1[1], bounds2[1]);
    ymin = max(bounds1[2], bounds2[2]);
    ymax = min(bounds1[3], bounds2[3]);


    rectMode(CENTER);
    noStroke();

    let area = 0.0;
    let step = max(ymax-ymin, xmax-xmin) / width;

    for (let y=ymin; y<=ymax; y+=step)
    {
        for (let x=xmin; x<=xmax; x+=step)
        {
            fill(255, 100, 100, 50);

            if (pointInPolygon(x, y, A) && pointInPolygon(x, y, B))
            {
                area += (step)**2;

                fill(100, 255, 100, 50);
            }

            rect(x, y, step*0.95);
        }
    }

    return area;
}


function generateNGon( output, sides, position, radius, rotation )
{
    let bearing = new vec2(0.0, -radius);

    const total_angle = (sides - 2) * (180/sides);
    const internal_angle = radians(0.5 * total_angle);

    let x = radius * (cos(2.0 * Math.PI));
    let y = radius * (sin(2.0 * Math.PI));

    for (let i=1; i<=sides; i++)
    {
        let new_x = radius * (cos(2.0 * Math.PI * (i/sides)));
        let new_y = radius * (sin(2.0 * Math.PI * (i/sides)));

        output.push([
            vec2_add(position, vec2_rotate(new vec2(x, y), rotation)),
            vec2_add(position, vec2_rotate(new vec2(new_x, new_y), rotation))
        ]);

        x = new_x;
        y = new_y;
    }
}


function drawLines( lines )
{
    strokeWeight(2);
    stroke(0);

    let total = 0;

    for (let L of lines)
    {
        vec2_line(L[0], L[1]);
    }

    return total;
}


function keyPressed()
{
    if (keyIsDown(37))
    {
        P1NGon += 1;

        if (P1NGon > 7)
        {
            P1NGon = 3;
        }
    }

    if (keyIsDown(39))
    {
        P2NGon += 1;

        if (P2NGon > 7)
        {
            P2NGon = 3;
        }
    }

    if (keyIsDown(38))
    {
        overlapRes *= 2;
    }

    if (keyIsDown(40))
    {
        overlapRes /= 2;
    }
}


function keyInput()
{
    if (keyIsDown(65))
    {
        A.x -= 5;
    }

    if (keyIsDown(68))
    {
        A.x += 5;
    }

    if (keyIsDown(87))
    {
        A.y -= 5;
    }

    if (keyIsDown(83))
    {
        A.y += 5;
    }


    if (keyIsDown(74))
    {
        B.x -= 5;
    }

    if (keyIsDown(76))
    {
        B.x += 5;
    }

    if (keyIsDown(73))
    {
        B.y -= 5;
    }

    if (keyIsDown(75))
    {
        B.y += 5;
    }


    if (keyIsDown(81))
    {
        P1Theta -= 0.03;
    }

    if (keyIsDown(69))
    {
        P1Theta += 0.03;
    }

    if (keyIsDown(85))
    {
        P2Theta -= 0.03;
    }

    if (keyIsDown(79))
    {
        P2Theta += 0.03;
    }

}


