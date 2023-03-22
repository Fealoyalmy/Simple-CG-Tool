var divWork;
var workW = 800, workH = 800; // 画布 width，height
var posX = 100, posY = 100; // 画布x, y
var cors = new Array(); // 鼠标打点坐标Array
var imgx, imgy; // img左上角x, y
var imgx2, imgy2;
var imgw1 = 534; // img width
var imgh1 = 300; // img height
var imgw2 = 534; // img width
var imgh2 = 300; // img height
var color_glob = "#ffffff"; // 全局color
var choice = 0; // 功能选择器

function main() {
    var cvs = initWorkArea(workW, workH, posX, posY, "#1f1f1f");  
    //setPixel(10, 10, "#ff0000", 3);//测试工作区写像素
    //var c = getPixel(150, 150); //测试工作区获得像素的颜色值

    
    document.addEventListener("mousemove", function(e){
        var x = e.clientX - posX;
        var y = e.clientY - posY; 
        $("#xcor").empty();
        $("#ycor").empty();
        $("#xcor").append("x：" + str(x));
        $("#xcor").append(" &nbsp;y：" + str(y));
        $("#color").empty();
        $("#color").append("HEX：" + getPixel(x, y) + " RGB：" + getRGB(getPixel(x, y)));
    })
    // 鼠标点击监听
    document.addEventListener("click", function(e){
        var x = e.clientX - posX;
        var y = e.clientY - posY;  
        $("#array").empty();
        $("#array").append(cors);    
        color_glob = "#" + $("#colorinput").val();
        if(!(x > 0 && y > 0 && x < workW && y < workH)){
            // if(y < 0)
            //     alert("点超出画布区域！");
            return;
        }
        if(choice == 1){
            setPixel(x, y, color_glob, 3); 
        }
        if(choice == 2){
            connectLine(x, y, color_glob);
        }
        if(choice == 3){           
            storeRectpixel(x, y, color_glob);
        }
        if(choice == 4){
            drawBeziern(cors, color_glob, 1);
        }
        if(choice == 5){
            BFSFill4(x, y, "#ffffff", color_glob);
        }
        if(choice == 6){        
            var res = arcLengthaccumlation([x, y], cors);
            setPixelbyALA([x, y], res, 1, 3);
        }
        if(choice == 7){
            for(var i = x - 200; i < x + 200; i += 2)
                for(var j = y - 200; j < y + 200; j += 2){
                    var res = arcLengthaccumlation([i, j], cors);
                    setPixelbyALA([i, j], res, 0, 1);
                }  
        }
        if(choice == 8){
            createCircle(x, y, 50, color_glob, 1);
        }
        if(choice == 9){
            var c = document.getElementById("mycvs");
            var ctx = c.getContext("2d");
            // ctx.globalAlpha = 0.5;
            var img = document.getElementById("img3");
            ctx.drawImage(img, x, y, imgw1, imgh1); 
            var img = document.getElementById("img4");
            // ctx.globalAlpha = 0.5;
            ctx.drawImage(img, x, y + 350, imgw2, imgh2); 
            imgx = x;
            imgy = y;     
            imgx2 = x;
            imgy2 = y + 350;   
        }
        if(choice == 10){
            createRGB(x, y, 50, 1);
        }
    });

    // 键盘按钮监听
    document.addEventListener("keydown", function(e){
        if(e.keyCode == 68)
            for(var i = 0; i < 400; i += 2)
                for(var j = 0; j < 300; j += 2){
                    var res = arcLengthaccumlation([i, j], cors);
                    setPixelbyALA([i, j], res, 0, 1);
                }                 
    })

    // 界面按钮监听
    $(function(){
        $(".btn").click(function(){
            $(".btn").removeClass("active");
            $(this).addClass("active");
            var c = $(this).val();
            choice = c;
            $("#choice").empty();
            $("#choice").append("当前功能：" + str(choice));
            if(c == 3)
                alert("打点连接首尾即可画出多边形！");
            else if(c == 5)
                alert("写入颜色点击多边形内部即可填充颜色！");
            else if(c == 6)
                alert("绘制完多边形后再次打点，即可判断点是否位于多边形内！");
            else if(c == 7)
                alert("绘制完多边形后点击其中心，即可进行覆盖式打点判断多边形内外部分！");
            else if(c == 9)
                alert("该功能需要web服务器支持才能正常工作\n点击画板靠近左上角的区域绘制两张图片，可测试灰度转换与图像融合！");
        })
        $("#greyimg").click(function(){
            transform2grey(); 
            alert("正在进行灰度转换，请稍等！");
        })
        $("#imgcomb").click(function(){
            var transparency = prompt("请输入图像融合的透明度(0-1)：");
            imgcombine(transparency);
        })
        $("#clearCanvas").click(function(){
            cors.length = 0;
            background("#1f1f1f");
        })
        $("#clearArray").click(function(){
            cors.length = 0;
        })       
    })
}

//以下代码无需改动，用于构建一个基本的工作环境，调用initWorkArea()函数即可，5个参数分别代表工作区的宽度，高度，左上角位置（x,y）和背景颜色
function initWorkArea(w, h, posx, posy, color) {
    divWork = createMyDiv(null, "divWork", w, h, posx, posy, "#000000"); //居中
    var bkcolor = color;
    noCanvas();

    defaultcvs = createCanvas(workW, workH);
    defaultcvs.id("mycvs");
    background(bkcolor);
    defaultcvs.parent(divWork);
    return defaultcvs;
}
// 画点
function setPixel(x, y, color, size) {
    stroke(color);
    strokeWeight(size);
    point(x, y);
}
// 获取点Hex颜色
function getPixel(x, y) {
    var clr;
    clr = get(x, y);
    var colorstr = "#";
    for(var i = 0; i < 3; i++)
    {
        if(clr[i] <= 15)
            colorstr += "0";
        colorstr += clr[i].toString(16);
    }
    // console.log("a=", clr[3]);
    return colorstr;//[clr[0], clr[1], clr[2],clr[3]];
}
// 设置点rgb颜色
function rgbColor(color) {
    var colorstr = "#";
    for(var i = 0; i < 3; i++){
        if(color[i] < 16)
            colorstr += "0";
        colorstr += color[i].toString(16);
    }      
    return colorstr;
}
// 获取点颜色array
function getRGB(color) {
    var r = parseInt(color[1] + color[2], 16);
    var g = parseInt(color[3] + color[4], 16);
    var b = parseInt(color[5] + color[6], 16);
    return [r, g, b];
}
function drawPixel(x, y, color, size) {
    point(x, y);
}
// 创建div
function createMyDiv(parentele, id, w, h, posx, posy, bkstr) {
    var key, val;
    if (bkstr.match("#") || bkstr.match("rgb")) {
        key = "background-color";
        val = bkstr;
    }
    if (bkstr.match("url")) {
        key = "background";
        val = bkstr;
    }
    var div = createDiv();
    div.size(w, h);
    div.style(key, val);
    div.position(posx, posy);
    div.id(id);
    if (parentele != null) div.parent(parentele);
    return div;
}
// 连续画线首尾可连接
function connectLine(x, y, color){
    cors.push([x, y]);
    if(cors.length > 1){
        if(Math.abs(x - cors[0][0]) <= 5 && Math.abs(y - cors[0][1]) <= 5){
            cors.pop();
            Bresenhamline(cors[cors.length - 1][0], cors[cors.length - 1][1], cors[0][0], cors[0][1], color, 1);
        }
        else{
            setPixel(x, y, color, 3);   
            Bresenhamline(cors[cors.length - 2][0], cors[cors.length - 2][1], x, y, color, 1);
        }                
    }
    else{
        setPixel(x, y, color, 3);              
    }
}
// 取点Array画多边形
function drawRect(cors, color, size){
    x0 = cors[cors.length - 1][0];
    y0 = cors[cors.length - 1][1];       
    for(var i = 0; i < cors.length; i++){
        x1 = cors[i][0];
        y1 = cors[i][1];
        Bresenhamline(x0, y0, x1, y1, color, size);
        x0 = x1;
        y0 = y1;
    }
}
// 存多边形点Array
function storeRectpixel(x, y, color){
    cors.push([x, y]);
    if(cors.length > 2 && Math.abs(x - cors[0][0]) <= 5 && Math.abs(y - cors[0][1]) <= 5){
        cors.pop();
        drawRect(cors, color, 1);  // 首尾连接即画多边形             
        //cors.length = 0;
    }
    else{
        setPixel(x, y, color, 3);              
    }
}
// 数值微分法画线
function DDALine(x0, y0, x1, y1, color, size) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var k = dy / dx;
    if (k > 1 || k < -1) {
        k = dx / dy;
        if (k >= 0)
            x = Math.min(x0, x1);
        else
            x = Math.max(x0, x1);
        for (var y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
            setPixel(int(x + 0.5), y, color, size);
            x += k;
        }
    }
    else {
        if (k >= 0)
            y = Math.min(y0, y1);
        else
            y = Math.max(y0, y1);
        for (var x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
            setPixel(x, int(y + 0.5), color, size);
            y += k;
        }
    }
}
// BresenHam算法画线
function Bresenhamline(x0, y0, x1, y1, color, size) {
    stroke(color);
    strokeWeight(size);
    var dx = x1 - x0;
    var dy = y1 - y0;
    var k = dy / dx;
    var e = -0.5;
    if (k >= -1 && k <= 1) {
        var x = Math.min(x0, x1);
        if (k >= 0) {
            y = Math.min(y0, y1);
            var t = 1;
        }
        else {
            y = Math.max(y0, y1);
            var t = -1;
        }
        for (var i = 0; i <= Math.abs(dx); i++) {
            setPixel(x, y, color, size);
            x++;
            e += Math.abs(k);
            if (e >= 0) {
                y += t;
                e--;
            }
        }
    }
    else {
        var y = Math.min(y0, y1);
        k = dx / dy;
        if (k >= 0) {
            x = Math.min(x0, x1);
            var t = 1;
        }
        else {
            x = Math.max(x0, x1);
            var t = -1;
        }
        for (var i = 0; i <= Math.abs(dy); i++) {
            setPixel(x, y, color, size);
            y++;
            e += Math.abs(k);
            if (e >= 0) {
                x += t;
                e--;
            }
        }
    }
}
// 种子递归填充
function FloodFill4(x, y, boundarycolor, newcolor){
    if(getPixel(x, y) != boundarycolor && getPixel(x, y) != newcolor)
    {
        setPixel(x, y, newcolor, 1);
        FloodFill4(x + 1, y, boundarycolor, newcolor);
        FloodFill4(x - 1, y, boundarycolor, newcolor);
        FloodFill4(x, y + 1, boundarycolor, newcolor);
        FloodFill4(x, y - 1, boundarycolor, newcolor);       
    }
}
// 广度遍历填充
function BFSFill4(x, y, boundarycolor, newcolor){
    stroke(newcolor);
    strokeWeight(1);
    var list = new Array();
    if(getPixel(x, y) != newcolor && getPixel(x , y) != boundarycolor){
        list.push([x, y]);
        drawPixel(x, y, newcolor, 1);
    }
    while(list.length > 0){
        var xycor = list.shift();
        var x = xycor[0];
        var y = xycor[1];
        ifDrawpixel(x + 1, y);
        ifDrawpixel(x - 1, y);
        ifDrawpixel(x, y + 1);
        ifDrawpixel(x, y - 1);
        function ifDrawpixel(x, y){
            if(x > 0 && y > 0 && x < workW && y < workH && getPixel(x, y) != newcolor && getPixel(x, y) != boundarycolor){
                drawPixel(x, y, newcolor, 1);
                list.push([x, y]);
            }
        }
    }
}
// 连接多边形 cors为点Array
function drawRect(cors, color, size){
    x0 = cors[cors.length - 1][0];
    y0 = cors[cors.length - 1][1];       
    for(var i = 0; i < cors.length; i++){
        x1 = cors[i][0];
        y1 = cors[i][1];
        Bresenhamline(x0, y0, x1, y1, color, size);
        x0 = x1;
        y0 = y1;
    }
}
// 弧长累加法求点与多边形关系
function arcLengthaccumlation(p0, pa){
    var xii, yii, res = 0;
    var xi = pa[pa.length - 1][0] - p0[0];
    var yi = pa[pa.length - 1][1] - p0[1];
    for(var i = 0; i < pa.length; i++){
        xii = pa[i][0] - p0[0];
        yii = pa[i][1] - p0[1];
        if(xii == 0 && yii == 0)
            return 2;
        if(!((xi*xii > 0 || (xi*xii == 0 && (xi > 0 || xii > 0))) && (yi*yii > 0 || (yi*yii == 0 && (yi > 0 || yii > 0))))){
            var f = yii*xi - xii*yi;
            if(f == 0 && (xi*xii < 0 || (xi*xii == 0 && (xi < 0 || xii < 0 || (xi == 0 && xii == 0))) && (yi*yii < 0 || (yi*yii == 0 && (yi < 0 || yii < 0 || (yi == 0 && yii == 0))))))
                return 2;
            if(f > 0){
                if(((xi*xii < 0 || (xi*xii == 0 && (xi < 0 || xii < 0))) && (yi*yii < 0 || (yi*yii == 0 && (yi < 0 || yii < 0)))))
                    res += 2;
                else
                    res += 1;
            }
            if(f < 0){
                if(((xi*xii < 0 || (xi*xii == 0 && (xi < 0 || xii < 0))) && (yi*yii < 0 || (yi*yii == 0 && (yi < 0 || yii < 0)))))
                    res -= 2;
                else
                    res -= 1;
            }  
        }
        xi = xii;
        yi = yii;
    }
    return Math.abs(res);
}
// 由弧长累加法反馈结果打点
function setPixelbyALA(p0, res, alt, size){
    if(res == 0){
        setPixel(p0[0], p0[1], "#ff0000", size);
        if(alt)
            alert("点P（" + str(p0) + "）在多边形外部");
    }
    else if(res == 2){           
        setPixel(p0[0], p0[1], "#0000ff", size);
        if(alt)
            alert("点P（" + str(p0) + "）在多边形边上");
    }
    else if(res == 4){
        setPixel(p0[0], p0[1], "#00ff00", size);
        if(alt)
            alert("点P（" + str(p0) + "）在多边形内部");
    }
}
// 2次Bezier曲线
function drawBezier2(cors, size){
    var x0, y0, x1, y1, x, y;
    for(var t = 0; t <= 1; t += 0.001){
        x0 = (1 - t)*cors[0][0] + t*cors[1][0];
        y0 = (1 - t)*cors[0][1] + t*cors[1][1];
        x1 = (1 - t)*cors[1][0] + t*cors[2][0];
        y1 = (1 - t)*cors[1][1] + t*cors[2][1];
        x = (1 - t)*x0 + t*x1;
        y = (1 - t)*y0 + t*y1;
        setPixel(x, y, "#00ff00", size);
    }
}
// n次Bezier曲线
function drawBeziern(cor, color, size){
    for(var t = 0; t <= 1; t += 0.001)
        Bezier(cor, t, color, size);

    // Bezier曲线
    function Bezier(cor, t, color, size){
        var ncor = new Array();
        for(var i = 0; i < cor.length - 1; i++){
            var x = (1 - t)*cor[i][0] + t*cor[i + 1][0];
            var y = (1 - t)*cor[i][1] + t*cor[i + 1][1];
            if(cor.length > 2)
                ncor.push([x, y]);
            else{
                setPixel(x, y, color, size);
                return;
            }
        }
        Bezier(ncor, t, color, size);       
    }
}
// 创建RGB圆形
function createCircle(x, y, r, color, size){
    for(var i = x - r; i < x + r; i++)
        for(var j = y - r; j < y + r; j++)
            if((i - x)*(i - x) + (j - y)*(j - y) <= r*r){                
                if(getPixel(i, j) == "#1f1f1f")
                    setPixel(i, j, color, size);
                else{
                    var pcolor = getRGB(color);
                    var ocolor = getRGB(getPixel(i, j));
                    var R = pcolor[0] + ocolor[0] < 255 ? pcolor[0] + ocolor[0]: 255;
                    var G = pcolor[1] + ocolor[1] < 255 ? pcolor[1] + ocolor[1]: 255;
                    var B = pcolor[2] + ocolor[2] < 255 ? pcolor[2] + ocolor[2]: 255;
                    setPixel(i, j, rgbColor([R, G, B]), size);
                }               
            }          
}
// 创建RGB正方形
function createSquare(x, y, r, color, size){
    for(var i = x; i < x + r; i++)
        for(var j = y; j < y + r; j++){
            if(getPixel(i, j) == "#1f1f1f")
                setPixel(i, j, color, size);               
            else{
                var pcolor = getRGB(color);
                var ocolor = getRGB(getPixel(i, j));
                var R = pcolor[0] + ocolor[0] < 255 ? pcolor[0] + ocolor[0]: 255;
                var G = pcolor[1] + ocolor[1] < 255 ? pcolor[1] + ocolor[1]: 255;
                var B = pcolor[2] + ocolor[2] < 255 ? pcolor[2] + ocolor[2]: 255;
                setPixel(i, j, rgbColor([R, G, B]), size);
            }
        }
}
// 创建RGB三原色图案
function createRGB(x, y, r, size){
    createCircle(x, y - r / 2, r, "#ffff00", size);
    createCircle(x + r / 2, y + r / 5, r, "#00ffff", size);
    createCircle(x - r / 2, y + r / 5, r, "#ff00ff", size);
}
// img图像灰度化
function transform2grey(){
    for(var x = imgx; x < imgx + imgw1; x++)
        for(var y = imgy; y < imgy + imgh1; y++){
            var ocolor = getRGB(getPixel(x, y));
            var rgb_grey = int(ocolor[0] * 0.3 + ocolor[1] * 0.6 + ocolor[2] * 0.1);
            //console.log(rgb_grey);
            setPixel(x, y, rgbColor([rgb_grey, rgb_grey, rgb_grey]), 1);
        }
    console.log("转换完成！");
}
// img图像融合
function imgcombine(A){
    var dx = imgx2 - imgx;
    var dy = imgy2 - imgy;
    for(var x = imgx; x < imgx + imgw1; x++)
        for(var y = imgy; y < imgy + imgh1; y++){                            
            var pcolor = getRGB(getPixel(x + dx, y + dy));
            var ocolor = getRGB(getPixel(x, y));
            var R = pcolor[0] + ocolor[0] < 255 ? pcolor[0] + ocolor[0]: 255;
            var G = pcolor[1] + ocolor[1] < 255 ? pcolor[1] + ocolor[1]: 255;
            var B = pcolor[2] + ocolor[2] < 255 ? pcolor[2] + ocolor[2]: 255;
            // console.log('rgba(' + R + ',' + G + ',' + B + ',' + A + ')');
            setPixel(x, y, 'rgba(' + R + ',' + G + ',' + B + ',' + A + ')', 1);                        
        }  
}
// 渐变色矩阵打点
function mixcolor(){
    for(var i = 0; i < 255; i++){
        for(var j = 0; j < 255; j++){
            setPixel(i, j, `rgb(${255 - i}, ${i}, ${j})`, 1)
        }
    }
}

function setup() {
    main();
}