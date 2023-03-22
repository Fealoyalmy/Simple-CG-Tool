var divWork;
var workW=800,workH=800;
var posX=100,posY=100;
function main() {
	initWorkArea(workW, workH, posX, posY,"#1f1f1f");
	setPixel(10,10,"#ff0000",3);//测试工作区写像素
	var c=getPixel(100,100); //测试工作区获得像素的颜色值
    // DDALine(0, 0, 300, 500, "000000");
    // DDALine(300, 500, 100, 0, "000000");
    // DDALine(0, 0, 600, 500, "000000");
    // DDALine(700, 500, 0, 0, "000000");

    // DDALine(300, 0, 0, 500, "000000");
    // DDALine(0, 500, 200, 0, "000000");
    // DDALine(600, 0, 0, 500, "000000");
    // DDALine(0, 500, 700, 0, "000000");

    // DDALine(400, 0, 400, 500, "000000");
    // DDALine(0, 400, 700, 400, "000000");

    Bresenhamline(0, 0, 500, 400, "000000");
    Bresenhamline(0, 0, 500, 300, "000000");
    Bresenhamline(0, 400, 500, 0, "000000");
    Bresenhamline(0, 300, 500, 0, "000000");

    Bresenhamline(0, 0, 500, 600, "000000");
    Bresenhamline(0, 0, 500, 700, "000000");
    Bresenhamline(0, 700, 500, 0, "000000");
    Bresenhamline(0, 700, 500, 100, "000000");

    Bresenhamline(0, 500, 500, 500, "000000");
    Bresenhamline(400, 0, 400, 700, "000000");
}


//以下代码无需改动，用于构建一个基本的工作环境，调用initWorkArea()函数即可，5个参数分别代表工作区的宽度，高度，左上角位置（x,y）和背景颜色
function initWorkArea(w,h,posx, posy, color){
	divWork = createMyDiv(null, "divWork", w, h, posx, posy, "#000000"); //居中
	var bkcolor = color;
	noCanvas();
	 
	defaultcvs = createCanvas(workW, workH);
	background(bkcolor);
	defaultcvs.parent(divWork);
}
function setPixel(x,y,color,size) {
    stroke(color);
    strokeWeight(size);
    point(x, y);
}
function getPixel(x, y) {
    var clr;
    clr = get(x, y);
    return [clr[0], clr[1], clr[2],clr[3]];
}

function createMyDiv(parentele, id, w, h, posx, posy, bkstr) {
    var key,val;
    if(bkstr.match("#") || bkstr.match("rgb")){
        key="background-color";
        val=bkstr;
    }
    if(bkstr.match("url")){
        key="background";
        val=bkstr;
    }
    var div = createDiv();
    div.size(w, h);
    div.style(key, val);
    div.position(posx, posy);
    div.id(id);
    if(parentele!=null)  div.parent(parentele);
    return div;
}

function DDALine(x0, y0, x1, y1, color){ 
	var dx = x1 - x0;
	var dy = y1 - y0;
	var k = dy / dx;
	if(k > 1 || k < -1)
	{	
		k = dx / dy;
        if(k >= 0)
		    x = Math.min(x0, x1);
        else
            x = Math.max(x0, x1);
		for(var y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
		{
			setPixel(int(x + 0.5), y, color);
			x += k;
		}
	}
	else
	{
		if(k >= 0)
		    y = Math.min(y0, y1);
        else
            y = Math.max(y0, y1);
		for(var x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
		{
			setPixel(x, int(y + 0.5), color);
			y += k;
		}
	}	
}

function Bresenhamline(x0, y0, x1, y1, color){
	var dx = x1 - x0;
	var dy = y1 - y0;
	var k = dy / dx;
    var e = -0.5;
    if(k >= -1 && k <= 1)
    {
        console.log("k<1");
        var x = Math.min(x0, x1);
        if(k >= 0)
        {
            y = Math.min(y0, y1);
            var t = 1;
        }		    
        else
        {
            y = Math.max(y0, y1);
            var t = -1;
        }         
        for (var i = 0; i <= Math.abs(dx); i++) 
        {
            setPixel(x, y, color);
            x++;
            e += Math.abs(k);
            if(e >= 0) 
            {
                y += t;
                e--;
            }
        }
    }
    else
    {
        console.log("k>1");
        var y = Math.min(y0, y1);
        k = dx / dy;
        if(k >= 0)
        {
            x = Math.min(x0, x1);
            var t = 1;
        }		    
        else
        {
            x = Math.max(x0, x1);
            var t = -1;
        } 
        for (var i = 0; i <= Math.abs(dy); i++) 
        {
            setPixel(x, y, color);
            y++;
            e += Math.abs(k);
            if(e >= 0) 
            {
                x += t;
                e--;
            }
        }
    }
}

function setup() {
    main();
}