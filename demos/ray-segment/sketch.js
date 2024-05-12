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
    let v0 = vec2_sub(origin, a);
    let v1 = vec2_sub(b, a);
    let v2 = new vec2(-dir.y, dir.x);

    let t0 = vec2_cross(v1, v0) / vec2_dot(v1, v2);
    let t1 = vec2_dot(v0, v2) / vec2_dot(v1, v2);

    return (t0 > 0.0) && (0.0 <= t1 && t1 <= 1.0);

    // let u = vec2_sub(a, origin);
    // let v = vec2_sub(b, origin);

    // let m = vec2_add(vec2_normalize(u), vec2_normalize(v));
    //     m = vec2_div(m, 2);
    //     m = vec2_normalize(m);

    // if (vec2_dot(dir, m) < 0.0)
    // {
    //     return false;
    // }

    // const sign_a = Math.sign(vec2_cross(u, dir));
    // const sign_b = Math.sign(vec2_cross(dir, v));

    // if (sign_a != sign_b)
    // {
    //     return false;
    // }

    // return true;
}


function setup()
{
    createCanvas(1024, 512);
}


let origin = new vec2(256, 256);
let dir    = new vec2(1.0, 1.0);
let A = new vec2(450, 350);
let B = new vec2(700, 400);

function draw()
{
    background(220);
    strokeWeight(2);

    let mouse = new vec2(mouseX, mouseY);
    dir = vec2_normalize(dir);

    origin = mouse;

    vec2_line(A, B);


    let u = vec2_sub(A, origin);
    let v = vec2_sub(B, origin);

    stroke("red");
    vec2_line(origin, vec2_add(origin, u));

    stroke("green");
    vec2_line(origin, vec2_add(origin, v));


    let m = vec2_add(vec2_normalize(u), vec2_normalize(v));
        m = vec2_div(m, 2);
        m = vec2_normalize(m);
        m = vec2_mul(m, 1000.0);

    let mp = new vec2(-m.y, m.x);

    stroke("orange");
    vec2_line(origin, vec2_add(origin, m));

    vec2_line(origin, vec2_add(origin, mp));
    vec2_line(origin, vec2_add(origin, vec2_mul(mp, -1.0)));
    
    stroke(0);

    if (ray_line_intersection(origin, dir, A, B))
    {
        strokeWeight(4);
        stroke("#007ACC");
    }

    vec2_line(origin, vec2_add(origin, vec2_mul(dir, 1000.0)));
    strokeWeight(0);

    textSize(18)
    stroke(255);
    text("Move origin: mouse", 10, 20);
    text("Rotate direction: Q/E", 10, 50);
    text("Move A: WASD", 10, 80);
    text("Move B: arrow keys", 10, 110);

    textAlign(CENTER, CENTER);
    circle(A.x, A.y, 25);
    circle(B.x, B.y, 25);
    text("A", A.x, A.y);
    text("B", B.x, B.y);

    keyInput();
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


