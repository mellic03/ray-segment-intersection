
class QuadNode
{
    value    = 0;
    span     = 0.0;
    children = [null, null, null, null];

    constructor(x, y, span, value=0)
    {
        this.x = x;
        this.y = y;
        this.span  = span;
        this.value = value;
    };
};



function getQuadrant( px, py, cx, cy )
{
    let quadrant = 0;

    if (px < cx) { quadrant |= 1; };
    if (py < cy) { quadrant |= 2; };

    return quadrant;
}


function shiftX( quadrant, cx, span )
{
    let offset_x = ((quadrant & 1) == 0) ? +span/4.0 : -span/4.0;
    return cx + offset_x;
};


function shiftY( quadrant, cy, span )
{
    let offset_y = ((quadrant & 2) == 0) ? +span/4.0 : -span/4.0;
    return cy + offset_y;
};


function hasChildren( node )
{
    for (let i=0; i<4; i++)
    {
        if (node.children[i] != null)
        {
            return true;
        }
    }

    return false;
}


function hasAllChildren( node )
{
    for (let i=0; i<4; i++)
    {
        if (node.children[i] == null)
        {
            return false;
        }
    }

    return true;
}


function isLeaf( node )
{
    for (let i=0; i<4; i++)
    {
        if (node.children[i] != null)
        {
            return false;
        }
    }

    return true;
}


function childrenAreLeaves( node )
{
    for (let i=0; i<4; i++)
    {
        if (isLeaf(node.children[i]) == false)
        {
            return false;
        }
    }

    return true;
}


function childrenAreSame( node )
{
    // If any children have children, return false
    for (let i=0; i<4; i++)
    {
        if (node.children[i] == null || hasChildren(node.children[i]))
        {
            return false;
        }
    }

    // If any two children are not the same, return false
    for (let i=0; i<3; i++)
    {
        const b1 = node.children[i].value;
        const b2 = node.children[i+1].value;

        if (b1 != b2)
        {
            return false;
        }
    }

    return true;

    // if (hasAllChildren(node) == false)
    // {
    //     return false;
    // }

    // for (let i=0; i<3; i++)
    // {
    //     if (node.children[i].value != node.children[i+1].value)
    //     {
    //         return false;
    //     }
    // }

    // return true;
}


const QuadRED  = 1;
const QuadBLUE = 2;
const QuadColors = [ [0, 0, 0], [0, 0, 255], [255, 0, 0] ];


class QuadTree
{
    root = null;
    x = 0;
    y = 0;
    MAX_DEPTH = 1;

    constructor( span, max_depth )
    {
        this.root = new QuadNode(span/2, span/2, span);
        this.MAX_DEPTH = max_depth;
    };

    _insert( x, y, value, current, cx, cy, depth )
    {
        if (current.value == value)
        {
            return;
        }

        else if (depth >= this.MAX_DEPTH)
        {
            current.value = value;
            current.span *= 2.0;
            return;
        }


        let quadrant = getQuadrant(x, y, cx, cy);

        if (current.children[quadrant] == null)
        {
            current.children[quadrant] = new QuadNode(cx, cy, current.span/2, 0);
        }

        const CX = shiftX(quadrant, cx, current.span);
        const CY = shiftY(quadrant, cy, current.span);

        this._insert(x, y, value, current.children[quadrant], CX, CY, depth+1);
    };


    insert( x, y, value )
    {
        this._insert(x, y, value, this.root, this.root.span/2, this.root.span/2, 0);

        for (let i=0; i<4; i++)
        {
            this._cleanup(this.root, i);
        }
    };


    _cleanup( parent, quadrant )
    {
        let node = parent.children[quadrant];

        if (node == null || isLeaf(node))
        {
            return;
        }

        for (let i=0; i<4; i++)
        {
            this._cleanup(node, i)
        }
    
        if (childrenAreSame(node) == false)
        {
            return;
        }

        console.log(node.value);
        node.value = node.children[0].value;
        node.span *= 2;
        console.log(node.value);
        console.log("\n");

        node.children = [null, null, null, null];

    };


    _insert_line_dy(value, x0, y0, x1, y1, step, dy, dx)
    {
        const m = dy/dx;
        const b = y0 - m*x0;

        const ymin = min(y0, y1);
        const ymax = max(y0, y1);

        if (x0 == x1)
        {
            for (let y=ymin; y<=ymax; y+=step)
            {
                this.insert(x0, y, value);
            }

            return;
        }

        for (let y=ymin; y<=ymax; y+=step)
        {
            let x = (y - b) / m;

            this.insert(x, y, value);
        }
    }

    _insert_line_dx(value, x0, y0, x1, y1, step, dy, dx)
    {
        const m = dx/dy;
        const b = x0 - m*y0;

        const xmin = min(x0, x1);
        const xmax = max(x0, x1);

        if (y0 == y1)
        {
            for (let x=xmin; x<=xmax; x+=step)
            {
                this.insert(x, y0, value);
            }

            return;
        }

        for (let x=xmin; x<=xmax; x+=step)
        {
            let y = (x - b) / m;

            this.insert(x, y, value);
        }
    }

    insert_line( value, x0, y0, x1, y1, step )
    {
        const dx = x1 - x0;
        const dy = y1 - y0;

        if (abs(dy) > abs(dx))
        {
            this._insert_line_dy(value, x0, y0, x1, y1, step, dy, dx);
        }

        else
        {
            this._insert_line_dx(value, x0, y0, x1, y1, step, dy, dx);
        }
    };

    /**
     * @param {*} value 
     * @param {*} lines 
     * @param {*} step 
     * @returns (xmin, xmax, ymin, ymax)
    */
    insert_polygon( value, lines, step )
    {
        let xmin = +9999999.0;
        let xmax = -9999999.0;
        let ymin = +9999999.0;
        let ymax = -9999999.0;

        for (let L of lines)
        {
            xmin = min(xmin, L[0].x);
            xmax = max(xmax, L[0].x);
            ymin = min(ymin, L[0].y);
            ymax = max(ymax, L[0].y);

            this.insert_line(value, L[0].x, L[0].y, L[1].x, L[1].y, step);
        }

        return [xmin, xmax, ymin, ymax];
    }

    _query( x, y, cx, cy, node, depth, maxdepth )
    {
        if (hasChildren(node) == false)
        {
            return node;
        }

        if (depth > maxdepth)
        {
            return node;
        }

        let quadrant = getQuadrant(x, y, cx, cy);

        if (node.children[quadrant] == null)
        {
            return node;
        }

        const CX = shiftX(quadrant, cx, node.span);
        const CY = shiftY(quadrant, cy, node.span);

        return this._query(x, y, CX, CY, node.children[quadrant], depth+1, 8);
    };

    query( x, y )
    {
        return this._query(x, y, this.root.span/2, this.root.span/2, this.root, 0, 8);

        // let cx = 500;
        // let cy = 250;
        // let span  = this.root.span;
        // let value = 0;

        // let quadrant = getQuadrant(x, y, cx, cy);

        // let parent = null;
        // let node   = this.root;

        // span /= 2.0;

        // while (node != null)
        // {
        //     quadrant = getQuadrant(x, y, cx, cy);
        //     value    = node.value;

        //     parent = node;
        //     node = node.children[quadrant];

        //     cx = shiftX(quadrant, cx, span);
        //     cy = shiftY(quadrant, cy, span);
        //     span /= 2.0;
        // }

        // return node;
    };

    _draw( node, cx, cy, span )
    {
        if (isLeaf(node))
        {
            fill(QuadColors[node.value][0], 0.0, QuadColors[node.value][2], 50);

            const x1 = cx - span/2;
            const y1 = cy - span/2;
            const x2 = cx + span/2;
            const y2 = cy + span/2;

            rect(x1, y1, x2, y2);

            return;
        }

        for (let i=0; i<4; i++)
        {
            const CX = shiftX(i, cx, span);
            const CY = shiftY(i, cy, span);

            const x1 = CX - span/4;
            const y1 = CY - span/4;
        
            const x2 = CX + span/4;
            const y2 = CY + span/4;

            noFill();
            rect(x1, y1, x2, y2);

            if (node.children[i] != null)
            {
                this._draw(node.children[i], CX, CY, span/2);
            }
        }
    };

    draw()
    {
        stroke(100);
        strokeWeight(1);
        fill(0);
        rectMode(CORNERS);

        this._draw(this.root, this.root.span/2, this.root.span/2, this.root.span);
    };


    // _drawArea( node, cx, cy, span )
    // {
    //     // if (isLeaf(node))
    //     {
    //         let result = this.nearest_intersection(node.x, node.y + 0.1*node.span, 1,0, 0.0);

    //         if ((result[1] % 2 == 1) && (result[2] % 2 == 1))
    //         {
    //             fill(100, 255, 100);
    //             const x1 = cx - span/2;
    //             const y1 = cy - span/2;
    //             const x2 = cx + span/2;
    //             const y2 = cy + span/2;
    
    //             circle(cx, cy, 13);

    //             // rect(x1, y1, x2, y2);
    //         }

    //     }

    //     for (let i=0; i<4; i++)
    //     {
    //         const CX = shiftX(i, cx, span);
    //         const CY = shiftY(i, cy, span);

    //         if (node.children[i] != null)
    //         {
    //             this._drawArea(node.children[i], CX, CY, span/2);
    //         }
    //     }
    // };


    drawArea( xmin, xmax, ymin, ymax )
    {
        noStroke();
        fill(0);
        rectMode(CORNERS);
        fill(100, 255, 100);

        for (let y=ymin; y<=ymax; y+=8)
        {
            for (let x=xmin; x<=xmax; x+=8)
            {
                let node = this.query(x, y);

                if (node.value == 0)
                {
                    let result = this.nearest_intersection(x, y-0.1, 0.70710678137, -0.70710678137 );

                    if ((result[1] % 2 == 1) && (result[2] % 2 == 1))
                    {
            
                        circle(x, y-0.1, 13);
        
                        // rect(x1, y1, x2, y2);
                    }
                }
            }
        }

        // this._drawArea(this.root, this.root.span/2, this.root.span/2, this.root.span);

        noFill();
        stroke(0);
    };


    __next_step( x, y, xdir, ydir, cx, cy, span )
    {
        const mx = ydir / xdir;
        const my = xdir / ydir;

        let nx = -xdir;
        let ny = -ydir;

        const Ax = x - (span * Math.floor(x / span));
        const Ay = y - (span * Math.floor(y / span));

        let dx, dy;
        if (xdir <= 0) { dx = Ax;        };
        if (xdir >  0) { dx = span - Ax; };
        if (ydir <= 0) { dy = Ay;        };
        if (ydir >  0) { dy = span - Ay; };


        const hdx = dx;
        const hdy = dx*mx;

        const vdy = dy;
        const vdx = dy*my;

        const length_h = Math.sqrt(hdx**2 + hdy**2);
        const length_v = Math.sqrt(vdx**2 + vdy**2);
        const EPSILON = 0.01;

        if (length_h < length_v)
        {
            const sign_h = Math.sign(xdir);
            return [ sign_h*(hdx+EPSILON), sign_h*(hdy+EPSILON) ];
        }

        else
        {
            const sign_v = Math.sign(ydir);
            nx = 0.0;
            ny = 1.0;

            return [ sign_v*(vdx+EPSILON), sign_v*(vdy+EPSILON) ];
        }
    };


    _out_of_bounds(px, py)
    {
        return px < 0 || px > 1000 || py < 0 || py > 500;
    }


    /** Given a position and direction, determine the nearest intersection with a block of blocktype > 0
     * 
     * @param {*} x starting x position
     * @param {*} y starting y position
     * @param {*} xdir x direction
     * @param {*} ydir y direction
     * @returns [ x, y, node.value ] intersection point
     */
    nearest_intersection( x, y, xdir, ydir )
    {
        let result  = [0, 0, 0];
        let current = 0;

        let node = this.query(x, y);
        let cx   = node.x;
        let cy   = node.y;
        let span = node.span;

        let px = 1.0*x;
        let py = 1.0*y;

        if (node.value > 0)
        {
            result[node.value] += 1;
            return result;
        }
        
        // noStroke();
        // fill(255, 255, 0.0);

        for (let i=0; i<64; i++)
        {
            const step = this.__next_step(px, py, xdir, ydir, cx, cy, span/2);

            px += step[0];
            py += step[1];

            // circle(px, py, 5);

            node = this.query(px, py);
            cx   = node.x;
            cy   = node.y;
            span = node.span;

            if (this._out_of_bounds(px, py))
            {
                break;
            }

            if (node.value != current)
            {
                result[current] += 1;
                current = node.value;
            }

            if (node.value > 0)
            {
                // fill(QuadColors[node.value][0], 0.0, QuadColors[node.value][2]);
                // circle(px, py, 5);
                // fill(255, 255, 0.0);

            }
        }

        // stroke(0);
        // fill(0);

        // console.log(result);
        return result;
    };

};

