var color_result = document.getElementById('color_result');
var color_palette = document.getElementById('color_palette');

//デフォルト（HSB値）
var h = 200; var s = 100; var v = 100;
var hsb = new Array(Math.round(h * 300 / 360) , Math.round(s * 300 / 100), Math.round(v * 300 / 100));  //デフォルト

var preview = document.getElementById('preview');

//デフォルト

var slider_h = document.getElementById('slider_h');
var slider_s = document.getElementById('slider_s');
var slider_b = document.getElementById('slider_b');

color_result.onkeyup = function(e){ colorResultPressed(e, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, 1); };

var value_h = document.getElementById('value_h');
var value_s = document.getElementById('value_s');
var value_b = document.getElementById('value_b');

window.onload = function(){
    slide(slider_h, hsb[0], 0, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, 1);
    slide(slider_s, hsb[1], 1, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, 1);
    slide(slider_b, hsb[2], 2, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, 1);
}

//スライダ管理
function slide(slider,default_location, nowHSB, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, palette_type){
    var input = slider.getElementsByTagName('input')[0];
    var root = document.documentElement;
    var dragging = false;
    var nowdragging = slider;
    hsb[nowHSB] = default_location * slider.clientWidth / 300;// 初期位置
    var width = input.clientWidth / 2;

    var set_value = function(){
        // つまみのサイズ(input.clientWidth)だけ位置を調整
        input.style.left = (hsb[nowHSB] - input.clientWidth/2) + 'px';

        var h = hsb[0] * 360 / slider_h.clientWidth;
        var s = hsb[1] * 100 / slider_s.clientWidth;
        var v = hsb[2] * 100 / slider_b.clientWidth;
      
        var result = HSBtoRGB(h, s, v);

        var r = result[0].toString(16);
        var g = result[1].toString(16);
        var b = result[2].toString(16);

        if(r.length == 1) r = "0" + r;
        if(g.length == 1) g = "0" + g;
        if(b.length == 1) b = "0" + b;

        //文字色を設定
        if(v > 70 && (255 * 3 - result[0] - result[1] - result[2]) < 350){
            color_result.style.color = "#000";
        } else {
            color_result.style.color = "#fff";
        }

        value_h.value = Math.round(h);
        value_s.value = Math.round(s);
        value_b.value = Math.round(v);

        color_result.value = r + g + b;
        color_result.style.backgroundColor = '#' + r + g + b;

        doSomething(r+g+b);

        showGradient(h,s,v, slider_h, slider_s, slider_b);
    };
    set_value();

    // ドラッグ開始
    input.onmousedown = function(evt){
        dragging = true;

        document.onmousemove = function(evt){
            if(dragging){
                // ドラッグ途中
                if(!evt){
                    evt = window.event;
                }
                var left = evt.clientX;
                var rect = slider.getBoundingClientRect();
                // マウス座標とスライダーの位置関係で値を決める
                hsb[nowHSB] = Math.round(left - rect.left - width);
                // スライダーからはみ出したとき
                if (hsb[nowHSB] < 0) {
                    hsb[nowHSB] = 0;
                } else if (hsb[nowHSB] > slider.clientWidth) {
                    hsb[nowHSB] = slider.clientWidth;
                }
                set_value();
                return false;
            }
        };
          
        // ドラッグ終了
        document.onmouseup = function(evt){
            if (dragging) {
                dragging = false;
            }
        };
          
        return false;
    };

    // 目盛り部分をクリックしたとき
    slider.onclick = function(evt){
        dragging = true;

        document.onmousemove = function(evt){
            if(dragging){
                // ドラッグ途中
                if(!evt){
                    evt = window.event;
                }
                var left = evt.clientX;
                var rect = slider.getBoundingClientRect();
                // マウス座標とスライダーの位置関係で値を決める
                hsb[nowHSB] = Math.round(left - rect.left - width);
                // スライダーからはみ出したとき
                if (hsb[nowHSB] < 0) {
                    hsb[nowHSB] = 0;
                } else if (hsb[nowHSB] > slider.clientWidth) {
                    hsb[nowHSB] = slider.clientWidth;
                }
                set_value();
                return false;
            }
        };

    // ドラッグ終了
        document.onmouseup = function(evt){
            if (dragging) {
                dragging = false;
            }
        };

        document.onmousemove(evt);
        document.onmouseup();
    };

}

function changeSlider(obj){
    console.log(obj);
    var rgb_hex = obj.value;
    rgb_hex = rgb_hex.replace("#","");

    //文字数が足りなかったら
    var rgb_hex_length = rgb_hex.length;
    if(rgb_hex_length < 6){
        var rgb_hex_tmp = rgb_hex;
        rgb_hex = "";
        obj.value = "";
        for(var i=0; i < (6 - rgb_hex_length); i++){
            rgb_hex += "0";
            obj.value += "0";
        }
        rgb_hex += rgb_hex_tmp;
        obj.value += rgb_hex_tmp;
    }

    //文字数が多かったら
    if(rgb_hex_length > 6){
        rgb_hex = rgb_hex.substring(0, 6);
        obj.value = rgb_hex.substring(0, 6);
    }

    //不正な文字が含まれていないか
    if(!rgb_hex.match(/^[0-9|a-f]+$/)){
        rgb_hex = "f7f7f7";
        obj.value = "f7f7f7";
    }

    var r_string = rgb_hex.substring(0, 2);
    var g_string = rgb_hex.substring(2, 4);
    var b_string = rgb_hex.substring(4, 6);

    if(r_string.substring(0, 1) == "0") r_string = r_string.substring(1, 2);
    if(g_string.substring(0, 1) == "0") g_string = g_string.substring(1, 2);
    if(b_string.substring(0, 1) == "0") b_string = b_string.substring(1, 2);

    var r = parseInt(r_string, 16);
    var g = parseInt(g_string, 16);
    var b = parseInt(b_string, 16);

    var hsb_result = RGBtoHSB(r, g, b);

    var h = hsb_result[0];
    var s = hsb_result[1];
    var v = hsb_result[2];

    hsb[0] = h * slider_h.clientWidth / 360;
    var input = slider_h.getElementsByTagName('input')[0];
    input.style.left = (hsb[0] - input.clientWidth / 2) + 'px';

    hsb[1] = s * slider_s.clientWidth / 100;
    var input = slider_s.getElementsByTagName('input')[0];
    input.style.left = (hsb[1] - input.clientWidth / 2) + 'px';

    hsb[2] = v * slider_b.clientWidth / 100;
    var input = slider_b.getElementsByTagName('input')[0];
    input.style.left = (hsb[2] - input.clientWidth / 2) + 'px';

    value_h.value = Math.round(hsb_result[0]);
    value_s.value = Math.round(hsb_result[1]);
    value_b.value = Math.round(hsb_result[2]);

    color_result.style.background = "#" + rgb_hex;

    showGradient(h,s,v, slider_h, slider_s, slider_b);

    //文字色を設定
    if(v > 70 && (255 * 3 - r - g - b) < 350){
        color_result.style.color = "#000";
    } else {
        color_result.style.color = "#fff";
    }

    doSomething(rgb_hex);

    return false;
}

//色結果表示ウィンドウにenter
function colorResultPressed(e, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, palettetype){
	var obj = color_result;
	if(e.keyCode == 13){
        changeSlider(obj, color_result, hsb, slider_h, slider_s, slider_b, value_h, value_s, value_b, palettetype);
	}

}

//HSB→RGB
function HSBtoRGB(h, s, v){
	var r = 0;
	var g = 0;
	var b = 0;
	
	//色相
	if(h <= 60){
		//0°〜60°
		r = 255;
		g = h * 255 / 60;
		b = 0;
	} else if(h > 60 && h <= 120){
		//60°〜120°
		r = 255 * 2 - h * 255 / 60;
		g = 255;
		b = 0;
	} else if(h > 120 && h <= 180){
		//60°〜120°
		r = 0;
		g = 255;
		b = (h - 120) * 255 / 60;
	} else if(h > 180 && h <= 240){
		//60°〜120°
		r = 0;
		g = 255 * 2 - (h - 120) * 255 / 60;
		b = 255;
	} else if(h > 240 && h <= 300){
		//60°〜120°
		r = (h - 120 * 2) * 255 / 60;
		g = 0;
		b = 255;
	} else if(h > 300 && h <= 360){
		//60°〜120°
		r = 255;
		g = 0;
		b = 255 * 2 - (h - 120 * 2) * 255 / 60;
	}
	
	//彩度
	r += (255 - r) * (1 - s / 100);
	g += (255 - g) * (1 - s / 100);
	b += (255 - b) * (1 - s / 100);
	
	//明度
	r *= v / 100;
	g *= v / 100;
	b *= v / 100;
	
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	
	return new Array (r, g, b);
}

function showGradient(h, s, v, slider_h, slider_s, slider_b){
	//色相グラデーション
	var color16x = new Array();
	
	var n = 0;
	for(var i = 0; i < 8; i++){
		var result = HSBtoRGB(n, s, v);
	
		var r = result[0].toString(16);
  		var g = result[1].toString(16);
  		var b = result[2].toString(16);
	  
		if(r.length == 1) r = "0" + r;
  		if(g.length == 1) g = "0" + g;
  		if(b.length == 1) b = "0" + b;
	
		color16x[i] = "#" + r + g + b;
		
		n += 45;
	}

	slider_h.getElementsByTagName('div')[0].style.background = "-moz-linear-gradient(left 45deg, "+color16x[0]+", "+color16x[1]+", "+color16x[2]+", "+color16x[3]+", "+color16x[4]+", "+color16x[5]+", "+color16x[6]+", "+color16x[7]+", "+color16x[0]+")";
    slider_h.getElementsByTagName('div')[0].style.background = "-webkit-gradient(linear, left top, right bottom, from("+color16x[0]+"), color-stop(0.125, "+color16x[1]+"), color-stop(0.25, "+color16x[2]+"), color-stop(0.375, "+color16x[3]+"), color-stop(0.5, "+color16x[4]+"), color-stop(0.625, "+color16x[5]+"), color-stop(0.75, "+color16x[6]+"), color-stop(0.875, "+color16x[7]+"), to("+color16x[0]+"))";

	//彩度グラデーション
	var color16x = new Array();
	
	var result = HSBtoRGB(h, 0, v);
	
	var r = result[0].toString(16);
  	var g = result[1].toString(16);
  	var b = result[2].toString(16);
	  
	if(r.length == 1) r = "0" + r;
  	if(g.length == 1) g = "0" + g;
	if(b.length == 1) b = "0" + b;
	
	color16x[0] = "#" + r + g + b;
		
	var result = HSBtoRGB(h, 100, v);
	
	var r = result[0].toString(16);
  	var g = result[1].toString(16);
  	var b = result[2].toString(16);
	  
	if(r.length == 1) r = "0" + r;
  	if(g.length == 1) g = "0" + g;
	if(b.length == 1) b = "0" + b;
	
	color16x[1] = "#" + r + g + b;
	
	slider_s.getElementsByTagName('div')[0].style.background = "-moz-linear-gradient(left 45deg, "+color16x[0]+", "+color16x[1]+")";
    slider_s.getElementsByTagName('div')[0].style.background = "-webkit-gradient(linear, left top, right bottom, from("+color16x[0]+"), to("+color16x[1]+"))";
  
    //明度グラデーション
	var color16x = new Array();
	
	var result = HSBtoRGB(h, s, 0);
	
	var r = result[0].toString(16);
  	var g = result[1].toString(16);
  	var b = result[2].toString(16);
	  
	if(r.length == 1) r = "0" + r;
  	if(g.length == 1) g = "0" + g;
	if(b.length == 1) b = "0" + b;
	
	color16x[0] = "#" + r + g + b;
		
	var result = HSBtoRGB(h, s, 100);
	
	var r = result[0].toString(16);
  	var g = result[1].toString(16);
  	var b = result[2].toString(16);
	  
	if(r.length == 1) r = "0" + r;
  	if(g.length == 1) g = "0" + g;
	if(b.length == 1) b = "0" + b;
	
	color16x[1] = "#" + r + g + b;
	
    slider_b.getElementsByTagName('div')[0].style.background = "-moz-linear-gradient(left 45deg, "+color16x[0]+", "+color16x[1]+")";
    slider_b.getElementsByTagName('div')[0].style.background = "-webkit-gradient(linear, left top, right bottom, from("+color16x[0]+"), to("+color16x[1]+"))";
}

//色バーを移動
function moveTo(obj, hsbtype){
	var hsb_value = obj.value;
	switch(hsbtype){
		case 0:
			if(hsb_value > 360){
				hsb_value = 360; value_h.value = "360";
			}
			hsb[0] = hsb_value * slider_h.clientWidth / 360;
			var input = slider_h.getElementsByTagName('input')[0];
			// つまみのサイズ(input.clientWidth)だけ位置を調整
  			input.style.left = (hsb[0] - input.clientWidth / 2) + 'px';
  
  			var s = Math.round(hsb[1] * 100 / slider_s.clientWidth);
  			var v = Math.round(hsb[2] * 100 / slider_b.clientWidth);

  			var result = HSBtoRGB(hsb_value, s, v);
			break;
		case 1:
			if(hsb_value > 100){
				hsb_value = 100; value_s.value = "100";
			}
			hsb[1] = hsb_value * slider_s.clientWidth / 100;
			var input = slider_s.getElementsByTagName('input')[0];
			// つまみのサイズ(input.clientWidth)だけ位置を調整
  			input.style.left = (hsb[1] - input.clientWidth / 2) + 'px';
  
  			var h = Math.round(hsb[0] * 360 / slider_h.clientWidth);
  			var v = Math.round(hsb[2] * 100 / slider_b.clientWidth);

  			var result = HSBtoRGB(h, hsb_value, v);
			break;
		case 2:
			if(hsb_value > 100){
				hsb_value = 100; value_b.value = "100";
			}
			hsb[2] = hsb_value * slider_b.clientWidth / 100;
			var input = slider_b.getElementsByTagName('input')[0];
			// つまみのサイズ(input.clientWidth)だけ位置を調整
  			input.style.left = (hsb[2] - input.clientWidth / 2) + 'px';
  			
			var h = Math.round(hsb[0] * 360 / slider_h.clientWidth);
  			var s = Math.round(hsb[1] * 100 / slider_s.clientWidth);
  			

  			var result = HSBtoRGB(h, s, hsb_value);
			break;
		}
  		var r = result[0].toString(16);
  		var g = result[1].toString(16);
  		var b = result[2].toString(16);
  
  		if(r.length == 1) r = "0" + r;
 		 if(g.length == 1) g = "0" + g;
  		if(b.length == 1) b = "0" + b;
  
  		//文字色を設定
  		if(v > 70 && (255 * 3 - result[0] - result[1] - result[2]) < 350){
  			color_result.style.color = "#000";
  		} else {
  			color_result.style.color = "#fff";
  		}
		  
        doSomething(r+g+b);
  
  	    showGradient(h,s,v, slider_h, slider_s, slider_b);
	
}

//RGB→HSB
function RGBtoHSB(r, g, b){
    var h = 0;
    var s = 0;
    var v = 0;
     
    var rgb_max = Math.max(r, g, b);    //最大値
    var rgb_min = Math.min(r, g, b);    //最小値
     
    //彩度
    s = Math.round((rgb_max - rgb_min) / rgb_max * 100);
     
    //明度
    v = Math.round(rgb_max / 255 * 100);
     
    //彩度100・明度100にする
    var pure_r = Math.round(((r / (v / 100)) + 255 * (s / 100) - 255) / (s / 100));
    var pure_g = Math.round(((g / (v / 100)) + 255 * (s / 100) - 255) / (s / 100));
    var pure_b = Math.round(((b / (v / 100)) + 255 * (s / 100) - 255) / (s / 100));
     
    if(pure_r > 255) pure_r = 255;
    if(pure_g > 255) pure_g = 255;
    if(pure_b > 255) pure_b = 255;
     
    if(pure_r < 0) pure_r = 0;
    if(pure_g < 0) pure_g = 0;
    if(pure_b < 0) pure_b = 0;
     
    var pure_rgb_max = Math.max(pure_r, pure_g, pure_b);    //最大値
    var pure_rgb_min = Math.min(pure_r, pure_g, pure_b);    //最小値
     
    //色相
    switch(pure_rgb_max){
        case pure_r:
            //最大値がR…0≦H≦60,300≦H≦360
            if(pure_rgb_min == pure_b){
                //最小値がB…0≦H≦60
                h = pure_g * (60 / 255);
            } else {
                //最小値がG…300≦H≦360
                h = (pure_b - 255) * (-60 / 255) + 300;
            }
            break;
        case pure_g:
            //最大値がG…60≦H≦180
            if(pure_rgb_min == pure_r){
                //最小値がR…120≦H≦180
                h = pure_b * (60 / 255) + 120;
            } else {
                //最小値がB…60≦H≦120
                h = (pure_r - 255) * (-60 / 255) + 60;
            }
            break;
        case pure_b:
            //最大値がB…180≦H≦300
            if(pure_rgb_min == pure_r){
                //最小値がR…180≦H≦240
                h = (pure_g - 255) * (-60 / 255) + 180;
            } else {
                //最小値がG…240≦H≦300
                h = pure_r * (60 / 255) + 240;
            }
            break;
    }
     
    if(pure_rgb_max == pure_r && pure_rgb_max == pure_g && pure_rgb_max == pure_b){
        h = 0;
    }
     
    h = Math.round(h);

    if(!s) s = 100;

    return new Array (h, s, v);
}

//ここに色を変更した後の処理を書く（rgbhexは"cf562d"など）
function doSomething(rgbhex){
    create();
}
