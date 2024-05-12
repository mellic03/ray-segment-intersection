"use strict";


let cx, cy;
let r = 50.0;

let rx = 500;
let ry = 250;
let rw = 100;
let rh = 200;
let theta = 0.0;


function vec2_translate( x, y, dx, dy )
{
    return [x + dx, y + dy];
}

function vec2_rotate( x, y, theta )
{
    return [
        x*cos(-theta) - y*sin(-theta),
        x*sin(-theta) + y*cos(-theta)
    ];
}


function clamp(n, a, b)
{
    return max(a, min(n, b));
}


function intersects()
{
    let p = [rx, ry];
        p = vec2_translate (...p, -cx, -cy);
        p = vec2_rotate    (...p, -theta);

    let x = p[0];
    let y = p[1];

    let nx = clamp(x, -rw/2, rw/2);
    let ny = clamp(y, -rh/2, rh/2);

    let distSq = (nx-x)*(nx-x) + (ny-y)*(ny-y);

    if (distSq < r*r)
    {
        return true;
    }

    return false;
}


function drawRect( cx, cy, w, h, theta )
{
    w /= 2;
    h /= 2;


    let points = [
        [cx-w, cy-h],
        [cx-w, cy+h],
        [cx+w, cy+h],
        [cx+w, cy-h]
    ];

    for (let i=0; i<4; i++)
    {
        let p0 = points[i];
            p0 = vec2_translate(...p0, -cx, -cy);
            p0 = vec2_rotate(...p0, theta);
            p0 = vec2_translate(...p0, cx, cy);

        let p1 = points[(i+1)%4];
            p1 = vec2_translate(...p1, -cx, -cy);
            p1 = vec2_rotate(...p1, theta);
            p1 = vec2_translate(...p1, cx, cy);
    
        line(...p0, ...p1);
    }


    // for (let i=cy-h; i<cy+h; i++)
    // {
    //     for (let j=cx-w; j<cx+w; j++)
    //     {
    //         let p = vec2_translate(j, i, -cx, -cy);
    //             p = vec2_rotate(...p, theta);
    //             p = vec2_translate(...p, cx, cy);
    //         rect(...p, 1, 1);
    //     }
    // }
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


    drawRect(rx, ry, rw, rh, theta);

    theta += 0.002;
}
