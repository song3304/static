if (!math) var math = {};
//坐标2,与坐标1的x轴正方向的弧度(顺时针)
math.range = function(x1, y1, x2, y2)
{
	var angle = Math.atan2(y2 - y1, x2 - x1); //角度

	if (angle < 0) angle = angle + Math.PI;
	return angle;
}
//两个坐标之间的距离(勾股定理，求斜边长)
math.distance = function(x1, y1, x2, y2)
{
	var r = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2),2));//两点距离
	return r;
}
if (!color) var color = {};
/**
 * 使用canvas的createLinearGradient 创建一个渐变色彩的圆形画笔
 * 如果gradient.colors = ['#FF0000','#FF8800','#FFFF00','#77FF00','#00FF99','#0066FF','#9900FF','#660077']，可以创建一个彩虹渐变的画笔
 * 
 * @param  {Number} size     圆形直径
 * @param  {object} gradient 
 *         @param {Array} colors 颜色的数组
 *         @param {Number} angle 每个颜色占比的弧度，默认为Math.PI / 颜色数量，这样可以均分颜色
 *         @param {Number} direction 颜色渐变的方向，默认通过angle来计算
 * @param  {Context} ctx     Canvas的Context
 * @return {Gradient}        Canvas的渐变画笔
 */
color.circleGradient = function(size, gradient, ctx)
{
	var gradientColors = gradient.colors || ['red', 'green', 'blue'];
	var gradientAngle = gradient.angle || Math.PI / gradientColors.length;
	var gradientDirection = gradient.direction;
	var grad = gradientColors[0];
	ctx = ctx || LGlobal.canvas;
	if (gradientColors.length > 1) {
		var ga = gradientAngle, // gradient direction angle; 0 by default
			gd = gradientDirection || [
				size / 2 * (1 - Math.cos(ga)), // x0
				size / 2 * (1 + Math.sin(ga)), // y0
				size / 2 * (1 + Math.cos(ga)), // x1
				size / 2 * (1 - Math.sin(ga))  // y1
			];
		grad = ctx.createLinearGradient.apply(ctx, gd);

		for (var i = 0; i < gradientColors.length; i++) {
			var color = gradientColors[i],
				pos = i / (gradientColors.length - 1);

			if (color instanceof Array) {
				pos = color[1];
				color = color[0];
			}

			grad.addColorStop(pos, color);
		}
	}
	return grad;
}
/*HSV to RGB h, s, v (0 ~ 1) */
color.getHSVColor = function(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (h && s === undefined && v === undefined) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	var rgb='#'+toHex(r * 255)+toHex(g * 255)+toHex(b * 255);
	return rgb;
}
if (!bitmap) var bitmap = {};
//读取一个bitmap，
/**
 * [to description]
 * @param  {String/LBitmapData}   data    图片数据源，LBitmapData或者路径都可以
 * @param  {Number}   width    拉升至宽度，為空則代表圖片實際寬度
 * @param  {Number}   height   拉升至高度，為空則代表圖片實際高度
 * @param  {Function} callback 
 *         @param {ImageElement} imgObj 等同于<img />
 *         @param  {Number}   width 最终宽度
 *         @param  {Number}   height 最终高度
 *         @param {LBitmap} LImg 
 *         @param {CanvasElement} imgObj 等同于加载了本图片的<canvas>对象
 *         
 */
bitmap.to = function(data, width, height, options, callback)
{
	if (typeof data == 'string')
	{
		loader = new LLoader();
		loader.addEventListener(LEvent.COMPLETE, loadBitmapData); 
		loader.load(data, "bitmapData");
	} else {
		var event = {target: data};
		loadBitmapData(event);
	}
	function loadBitmapData (event) {
		var imgObj = event.target;
		if (!width) width = imgObj.width;
		if (!height) height = imgObj.height;

		var returnLBitmap = options.bitmap || true;
		var returnCanvas = options.canvas || false;
		var LImg,tempCanvas;

		if (returnLBitmap)
		{
			var bitmapdata = new LBitmapData(imgObj);
			LImg = new LBitmap(bitmapdata);
			LImg.scaleX = width / LImg.getWidth(); //设置放大倍数
			LImg.scaleY = height / LImg.getHeight();
		}
		
		if (returnCanvas)
		{
			tempCanvas = document.createElement("canvas"),
			tCtx = tempCanvas.getContext("2d");
			tempCanvas.width = width; tempCanvas.height = height;
			tCtx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, 0, 0, width, height);
		}
		

		if (callback) callback.apply(this, [imgObj, width, height, LImg, tempCanvas]);
	}	

}