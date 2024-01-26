(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.configMapDemFunction = {
        calcHeightForDem: function(pixel, invalidValue) {
            var u = 0.01;
            var x = ((2**16) * pixel.r) + ((2**8) * pixel.g) + pixel.b;
            if (x < (2**23)) {
                return x * u;
            }else if (x > (2**23)) {
                return (x - (2**24)) * u;
            }else{
                return invalidValue;
            }
        },
    
        calcAllColorForDem: function(h, invalidValue) {
    
            if (h === invalidValue) {
                return {r: 0, g: 0, b: 0, a: 0};
    
            }else if (h <= -2) {
                return {r: 0, g: 0, b: 255};
            }else if (-2 < h && h <= 0) {
                return {r: 0, g: 55, b: 255};
            }else if (0 < h && h <= 3) {
                return {r: 37, g: 243, b: 192};
            }else if (3 < h && h <= 6) {
                return {r: 73, g: 247, b: 128};
            }else if (6 < h && h <= 10) {
                return {r: 108, g: 251, b: 64};
            }else if (10 < h && h <= 50) {
                return {r: 128, g: 253, b: 32};
    
            }else if (50 < h && h <= 100) {
                return {r: 145, g: 255, b: 0};
            }else if (100 < h && h <= 250) {
                return {r: 200, g: 255, b: 0};
    
            }else if (250 < h && h <= 350) {
                return {r: 255, g: 255, b: 0};
            }else if (350 < h && h <= 500) {
                return {r: 255, g: 200, b: 0};
            }else if (500 < h && h <= 750) {
                return {r: 255, g: 170, b: 0};
    
            }else if (750 < h && h <= 1000) {
                return {r: 255, g: 140, b: 0};
            }else if (1000 < h && h <= 1500) {
                return {r: 255, g: 102, b: 0};
    
            }else if (1500 < h && h <= 2000) {
                return {r: 255, g: 68, b: 0};
            }else if (2000 < h && h <= 2500) {
                return {r: 255, g: 34, b: 0};
            }else if (h > 2500) {
                return {r: 255, g: 17, b: 0};
            }
        },

        aboveSeaSurface: function(h, seaSurfaceHeight, invalidValue) {
            if (h === invalidValue) {
                return true;
            }
            if (h >= seaSurfaceHeight) {
                return true;
            }
            return false;
        },

        calcSeaColorForDem: function(h, seaSurfaceHeight) {
            var buffer1 = 2;
            var buffer2 = 4;
            if (seaSurfaceHeight - buffer1 <= h && h < seaSurfaceHeight) {
                return {r: 0, g: 160, b: 255};
            }else if (seaSurfaceHeight - buffer2 <= h && h < seaSurfaceHeight - buffer1) {
                return {r: 0, g: 96, b: 255};
            }else {
                return {r: 0, g: 0, b: 255};
            }
        },

    };

}(this));
