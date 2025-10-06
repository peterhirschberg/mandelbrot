
const FULLVIEW_ACORNER = -2.0;
const FULLVIEW_BCORNER = -1.245288;
const FULLVIEW_SIDE = 2.53866;

let aCorner = FULLVIEW_ACORNER;
let bCorner = FULLVIEW_BCORNER;
let side = FULLVIEW_SIDE;

const RENDERSTEPS = 50;
const RENDERINCREMENT = 5;

const zoomFactor = 2;
const zoomDir = 1;

let renderStep;

let canvas;
let ctx;

let fps, fpsInterval, startTime, now, then, elapsed;

(function init() {
    initTimer(60);

    canvas = document.getElementById("myCanvas");
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        renderStep = RENDERSTEPS;
        zoom(x, y);
    })
    canvas.addEventListener('touchend', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.touches[0].clientX - rect.left;
        const y = event.touches[0].clientY - rect.top;

        renderStep = RENDERSTEPS;
        zoom(x, y);
    })
})();


function initTimer(fps) {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d"); // Get the 2D rendering context
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    renderStep = RENDERSTEPS;
    tick();
}

function tick() {
    requestAnimationFrame(tick);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        if (renderStep >= 0) {
            renderStep -= RENDERINCREMENT;
            juliaRender(renderStep)
        }
    }
}

function juliaRender(step) {

    const maxIter = 100;

    // Assume canvas dimensions are the client rect
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Define the number of rendering steps and increment
    const RENDERSTEPS = 10;
    const RENDERINCREMENT = 2;

    // Helper: Plot a rectangle of RGB pixels
    function plot(x, y, w, h, r, g, b) {
        ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        ctx.fillRect(x, y, w, h);
    }

    let hRes = width / (step ? step : 1);
    let vRes = height / (step ? step : 1);

    let dGapH = side / vRes;
    let dGapL = side / hRes;

    let pixelWidth = width / hRes;
    let pixelHeight = height / vRes;

    for (let down = 0; down < vRes; ++down) {
        for (let across = 0; across < hRes; ++across) {
            let bc = (down * dGapH) + bCorner;
            let ac = (across * dGapL) + aCorner;

            let az = 0;
            let bz = 0;

            let count = 1;
            let az2, bz2, size;

            do {
                az2 = (az * az) - (bz * bz) + ac;
                bz2 = 2 * az * bz + bc;

                az = az2;
                bz = bz2;

                size = az2 * az2 + bz2 * bz2;

                if (size > (2 * 2)) {
                    break;
                }

                ++count;
            } while (count <= maxIter);

            if (count >= maxIter) {
                // Inside the set, plot black
                plot(across * pixelWidth, down * pixelHeight, pixelWidth, pixelHeight, 0, 0, 0);
            } else {
                // Outside the set, color based on iteration count
                let c = (count / maxIter) * 255;
                plot(across * pixelWidth, down * pixelHeight, pixelWidth, pixelHeight, c * 0.5, c * 0.5, c);
            }
        }
    }
}


function zoom(x, y) {
	// zoom to the area clicked
    const portWidth = ctx.canvas.width;
    const portHeight = ctx.canvas.height;
	
	const hOffset = side * (x / portWidth);
	const vOffset = side * (y / portHeight);

	if (zoomDir == 1)
	{
		// zoom in
		side /= zoomFactor;
	} else {
		// zoom out
		side *= zoomFactor;
	}	

	aCorner = aCorner + (hOffset - (side / 2));
	bCorner = bCorner + (vOffset - (side / 2));
}