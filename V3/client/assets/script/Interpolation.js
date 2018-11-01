function bicubic(srcImg, destImg, scale) {

    let BicubicInterpolation = (function(){
        return function(x, y, values){
            let i0, i1, i2, i3;

            i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
            i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
            i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
            i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
            return TERP(y, i0, i1, i2, i3);
        };
        function TERP(t, a, b, c, d){
            return 0.5 * (c - a + (2.0*a - 5.0*b + 4.0*c - d + (3.0*(b - c) + d - a)*t)*t)*t + b;
        }
    })();

    let ivect = function (ix, iy, w) {
        return((ix + w * iy) * 4);
    };

    let i, j;
    let dx, dy;
    let repeatX, repeatY;
    let offset_row0, offset_row1, offset_row2, offset_row3;
    let offset_col0, offset_col1, offset_col2, offset_col3;
    let red_pixels, green_pixels, blue_pixels, alpha_pixels;
    for (i = 0; i < destImg.height; ++i) {
        let iyv = i / scale;
        let iy0 = Math.floor(iyv);
        repeatY = 0;
        if(iy0 < 1) repeatY = -1;
        else if(iy0 > srcImg.height - 3) repeatY = iy0 - (srcImg.height - 3);
        for (j = 0; j < destImg.width; ++j) {
            let ixv = j / scale;
            let ix0 = Math.floor(ixv);
            repeatX = 0;
            if(ix0 < 1) repeatX = -1;
            else if(ix0 > srcImg.width - 3) repeatX = ix0 - (srcImg.width - 3);
            offset_row1 = ((iy0)   * srcImg.width + ix0) * 4;
            offset_row0 = repeatY < 0 ? offset_row1 : ((iy0-1) * srcImg.width + ix0) * 4;
            offset_row2 = repeatY > 1 ? offset_row1 : ((iy0+1) * srcImg.width + ix0) * 4;
            offset_row3 = repeatY > 0 ? offset_row2 : ((iy0+2) * srcImg.width + ix0) * 4;
            offset_col1 = 0;
            offset_col0 = repeatX < 0 ? offset_col1 : -4;
            offset_col2 = repeatX > 1 ? offset_col1 : 4;
            offset_col3 = repeatX > 0 ? offset_col2 : 8;
            red_pixels =
                [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            green_pixels =
                [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            blue_pixels =
                [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            alpha_pixels =
                [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];

            dx = ixv - ix0; dy = iyv - iy0;
            let idxD = ivect(j, i, destImg.width);
            destImg.data[idxD] = BicubicInterpolation(dx, dy, red_pixels);
            destImg.data[idxD+1] =  BicubicInterpolation(dx, dy, green_pixels);
            destImg.data[idxD+2] = BicubicInterpolation(dx, dy, blue_pixels);
            destImg.data[idxD+3] = BicubicInterpolation(dx, dy, alpha_pixels);

        }
    }
}

module.exports = bicubic;