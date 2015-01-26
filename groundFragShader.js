//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}


vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }



//-----------------------------------//
uniform float time;
varying vec2 vUv;
varying float h;
varying vec2 p;
void main() {
    vec2 position = vUv;
    float t = time;
    float red = abs(sin(position.x * position.y + time / 5.0));
    float green = abs(sin(position.x * position.y + time / 4.0));
    float blue = abs(sin(position.x * position.y + time / 3.0));
    
    float 	r = 70.0	/255.0;
    float 	g = 170.0  	/255.0;
    float	b = 70.0   	/255.0;
    
    //g = sin(500.*vUv.x);
    //b = 1.5*sin(500.*vUv.y);

    vec3 green1 = vec3(r, g, b);

    float	a = 100.0   	/100.0;
    
    float noise = snoise(vec2(90.0*position.x,5.*position.y));    
    noise = (noise > 0.0) ? noise : 0.7;

    // green1 = snoise(vec2(100.*vUv.x,100.*vUv.y))*vec3(r,g,b);//*sin(11.*t*vUv.y);

       r = 245.0    /255.0;
       g = 235.0   /255.0;
       b = 170.0    /255.0;

    vec3 lightSand = vec3(r,g,b);
    vec3 grass = vec3(0.1, 0.3, 0.0);
    vec3 dirtySand = vec3(0.6,0.5,0.4);//vec3(0.9*r,0.9*g,0.8*b);
    vec3 dessertSand = vec3(0.92, 0.73, 0.53);
    vec3 darkSand = 0.99*vec3(140.0/255.0, 70.0/255.0, 20.0/255.0);
    vec3 bottomSand = dirtySand * max(snoise(vec3(144.*position.x,189.*position.y,1.)), 0.1);
    vec3 sand = mix(lightSand,dirtySand,0.5*snoise(10.*vec3(10.*position.x,2.*position.y,1.5*h)));//snoise(vec2(25.*vUv.x,50.*vUv.y))
    vec3 sand2 = mix(lightSand,dirtySand,0.5*snoise(10.*vec3(10.*position.x,2.*position.y,0.1*t*h)));//snoise(vec2(25.*vUv.x,50.*vUv.y))
    // sand = sand * snoise(vec3(position.x,position.y,t));
    grass = mix(grass,1.5*grass,max(snoise(10.*(0.0+h)*vec2(15.*position.x,5.*position.y))-0.2,0.0));
    vec3 grassMix = mix(grass,darkSand, 5.*(1.0 - h) * max(snoise(10.*(0.0+h)*vec2(10.*position.x,5.*position.y))-0.1,0.0));

    vec3 dirtMix = mix(darkSand,grass, max(0.7*snoise(10.*(0.0+h)*vec2(6.*position.x,2.*position.y))-0.2,0.0));
    vec3 mediumMix = mix(darkSand,lightSand,  max(0.5*snoise(10.*(0.0+h)*vec2(12.*position.x,4.*position.y))-0.2,0.0));
    vec3 lightMix = mix(lightSand,darkSand, max(0.5*snoise(10.*(0.0+h)*vec2(20.*position.x,20.*position.y))-0.1,0.0));
    float noise2 = 0.5 * snoise(vec3(vUv.x*0.3, vUv.y*0.1,1.0));
    // vec3 sand = (1.0 - noise2*2.0) * dirtySand + noise2*2.0*lightSand;
    float h2 = (max(h,0.8) - 0.8 ) * 5.0;
    float h3 = min(h,0.8) * 1.25;
    //vec3 finalColor = (h > 0.8) ? mix(darkSand, grass, h2): (h > 0.2) ? mix(lightSand, darkSand, smoothstep(0.85,0.95,h3)) : sand;//min((snoise(50.*h*position)+0.5),1.0)*dessertSand;
    float tx = smoothstep(0.45,0.6,h);
    float l0 = 0.7;
    float l1 = 0.5;
    float l2 = 0.35;
    float l3 = 0.100;
    vec3 finalColor = (h>l0) ? grassMix : (h>l1) ? mix(dirtMix,grassMix,smoothstep(l1,l0,h)) : 
    (h>l2) ? mix(lightMix, mediumMix,smoothstep(l2,l1,h)) : (h>l3) ? mix(sand,lightMix,smoothstep(l3,l2,h)) : (h>0.09) ? sand : sand;
    //finalColor = dessertSand * h;
    //float lvl1 = 0.8;

    gl_FragColor = vec4(finalColor,a);
}

