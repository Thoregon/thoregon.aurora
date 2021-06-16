/*
 * Copyright (c) 2021.
 */

/*
 *
 * @author: Martin Neitz
 */

export default class AuroraColors {

    static asColorCSS( colorDefinitions ) {
        let colorCSS = '';
        let colors   = Object.assign(
            {},
            {
                primaryColor     : '#1976d2',
                primaryLightColor: '#63a4ff',
                primaryDarkColor : '#004ba0',
                primaryTextColor : '#ffffff',

                secondaryColor     : colorDefinitions['primaryColor'] || '#1976d2',
                secondaryLightColor: colorDefinitions['primaryLightColor'] || '#63a4ff',
                secondaryDarkColor : colorDefinitions['primaryDarkColor'] || '#004ba0',
                secondaryTextColor : colorDefinitions['primaryTextColor'] || '#ffffff',
                textColor          : '#00000099',
            },
            colorDefinitions
        );


        colorCSS = 'div {' + '\n';

        Object.entries(colors).forEach(([name, color]) => {
                colorCSS += '--' + name + ': ' + color + ';' + '\n';
                colorCSS += '--' + name + 'RGB: ' + this.hex2rgb(color) + ';' + '\n';
            }
        )

        colorCSS += '}' + '\n';
        return colorCSS;
    }

    static hex2rgb( hex ) {
        let r,g,b,a="";

        if( hex=="" ) hex="000000";
        if( hex.charAt(0)=="#" ) hex=hex.substring(1,hex.length);
        if( hex.length!=6 && hex.length!=8 && hex.length!=3 )
        {
            return;
        }
        if( hex.length==3 )
        {
            r = hex.substring(0,1);
            g = hex.substring(1,2);
            b = hex.substring(2,3);
            r=r+r;
            g=g+g;
            b=b+b;
        }
        else
        {
            r = hex.substring(0,2);
            g = hex.substring(2,4);
            b = hex.substring(4,6);
        }
        if( hex.length==8 )
        {
            a = hex.substring(6,8);
            a = (parseInt(a, 16)/255.0).toFixed(2);
        }
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        let css=r+", "+g+", "+b;
        if( hex.length==8 )
            css="rgba("+r+", "+g+", "+b+", "+a+")";

        return css;
    }

}
