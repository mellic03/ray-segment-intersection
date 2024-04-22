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
let hexagon = [];
let hexagon2 = [];


function setup()
{
    createCanvas(1024, 512);

    for (let i=3; i<=7; i++)
    {
        generateNGon(lines, new vec2(100 + (i-3)*200, 150), 90, i);
    }

    for (let i=8; i<=12; i++)
    {
        generateNGon(lines, new vec2(100 + (i-8)*200, 350), 90, i);
    }

    // generateNGon(lines, new vec2(100, 255), 90, 3);
    // generateNGon(lines, new vec2(300, 255), 90, 4);
    // generateNGon(lines, new vec2(500, 255), 90, 5);
    // generateNGon(lines, new vec2(700, 255), 90, 6);
    // generateNGon(lines, new vec2(900, 255), 90, 7);
}


let origin = new vec2(256, 256);
let dir    = new vec2(1.0, 1.0);
let rayStroke = 0;
let A = new vec2(450, 350);
let B = new vec2(700, 400);

function draw()
{
    background(220);
    strokeWeight(2);

    origin.x = mouseX;
    origin.y = mouseY;
    dir = vec2_normalize(dir);


    strokeWeight(2);
    rayStroke = 0;

    let num_intersected = drawLines(lines);

    if (num_intersected % 2 == 1)
    {
        text("Inside!", 10, 20);
    }

    else
    {
        text("Outside!", 10, 20);
    }

    stroke(rayStroke);
    vec2_line(origin, vec2_add(origin, vec2_mul(dir, 1000.0)));


    strokeWeight(0);
    // textSize(18)
    // stroke(255);
    // text("Move origin: mouse", 10, 20);
    // text("Rotate direction: Q/E", 10, 50);
    // text("Move A: WASD", 10, 80);
    // text("Move B: arrow keys", 10, 110);

    // textAlign(CENTER, CENTER);
    // circle(A.x, A.y, 25);
    // circle(B.x, B.y, 25);
    // text("A", A.x, A.y);
    // text("B", B.x, B.y);



    keyInput();
}



function generateNGon( output, position, radius, sides )
{
    let bearing = new vec2(0.0, -radius);

    const total_angle = (sides - 2) * (180/sides);
    const internal_angle = radians(0.5 * total_angle);

    let x;
    let y;

    console.log(internal_angle);

    for (let i=0; i<=sides; i++)
    {
        let new_x = radius * cos(2.0 * Math.PI * (i/sides));
        let new_y = radius * sin(2.0 * Math.PI * (i/sides));

        output.push([
            vec2_add(position, new vec2(x, y)),
            vec2_add(position, new vec2(new_x, new_y))
        ]);

        x = new_x;
        y = new_y;
    }
}


function genHexagon( position, radius )
{
    let lines = [];
    let bearing = new vec2(0.0, -radius);

    for (let i=0; i<6; i++)
    {
        let new_bearing = vec2_rotate(bearing, radians(60.0));

        lines.push([
            vec2_add(position, bearing),
            vec2_add(position, new_bearing),
        ]);

        bearing = new_bearing;
    }

    return lines;
}


function genLines( n )
{
    lines = [];

    for (let i=0; i<n; i++)
    {
        lines.push([
            new vec2(random(0, 1024), random(0, 512)),
            new vec2(random(0, 1024), random(0, 512))
        ]);
    }

    return lines;
}

function drawLines( lines )
{
    let total = 0;

    for (let L of lines)
    {
        strokeWeight(2);
        stroke(0);
    
        if (ray_line_intersection(origin, dir, L[0], L[1]))
        {
            strokeWeight(4);
            stroke("#007ACC");
            rayStroke = "#007ACC";

            total += 1;
        }
    
        vec2_line(L[0], L[1]);
    
        strokeWeight(2);
        stroke(0);
    }

    return total;
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

    if (keyIsDown(37))
    {
        B.x -= 5;
    }

    if (keyIsDown(39))
    {
        B.x += 5;
    }

    if (keyIsDown(38))
    {
        B.y -= 5;
    }

    if (keyIsDown(40))
    {
        B.y += 5;
    }


    if (keyIsDown(81))
    {
        // dir = vec2_
        dir = vec2_rotate(dir, -0.03);
    }

    if (keyIsDown(69))
    {
        dir = vec2_rotate(dir, +0.03);
    }
}


