// 由于 ts 编译期间 html会出现问题，（WebPack没有问题），所以先以能支持ts编译的模块进行开发，后续换回HTML
// 另外 ： 后续使用 utils 当前theme 适配不同皮肤 


let html = `
 <filter id="_vc_def_map_shadow">
  <feColorMatrix type="matrix" values ="
    0 0 0 0  0
    0 0 0 .1 0
    0 0 0 .9 0
    0 0 0 .2 0
  "></feColorMatrix>
  <feGaussianBlur stdDeviation="1" result="colorBlur1" ></feGaussianBlur>

  <feOffset result="offsetBlur0" in="colorBlur1" dx="1"  dy="1" />
  <feOffset result="offsetBlur1" in="colorBlur1" dx="2"  dy="2" />
  <feOffset result="offsetBlur2" in="colorBlur1" dx="3"  dy="3" />
  <feOffset result="offsetBlur3" in="colorBlur1" dx="4"  dy="4" />
  <feMerge>
    <feMergeNode in="offsetBlur0" />
    <feMergeNode in="offsetBlur1" />
    <feMergeNode in="offsetBlur2" />
    <feMergeNode in="offsetBlur3" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>


<filter id="_vc_def_map_shadow_hover">
  <feColorMatrix type="matrix" values="
    0 0 0 .8 0
    0 0 0 .3 0
    0 0 0 .3 0
    0 0 0 0.5 0
  "></feColorMatrix>
  <feGaussianBlur stdDeviation="1" result="colorBlur1" ></feGaussianBlur>

  <feOffset result="offsetBlur0" in="colorBlur1" dx="1"  dy="1" />
  <feOffset result="offsetBlur1" in="colorBlur1" dx="2"  dy="2" />
  <feOffset result="offsetBlur2" in="colorBlur1" dx="4"  dy="4" />

  <feSpecularLighting in="SourceGraphic" lighting-color="#ffb8b8" surfaceScale="1" specularConstant="1" specularExponent="115" result="light">
    <feDistantLight elevation="1" azimuth="1"></feDistantLight>
  </feSpecularLighting>
  <feComposite in="light" in2="SourceGraphic" operator="in" result="light-effect"></feComposite>
  
  <feBlend in="light" in2="SourceGraphic" mode="screen"></feBlend>
  <feMerge>
    <feMergeNode in="offsetBlur0" />
    <feMergeNode in="offsetBlur1" />
    <feMergeNode in="offsetBlur2" />
    <feMergeNode in="SourceGraphic" /> 
    <feMergeNode in="light-effect" />
  </feMerge>
</filter>

<linearGradient id="_vc_def_map_border" spreadMethod="repeat">
    <stop offset="0%" style="stop-color: red;"/>
    <stop offset="10%" style="stop-color: blue"/>
    <stop offset="20%" style="stop-color: yellow"/>
    <stop offset="30%" style="stop-color: green"/>
    <stop offset="40%" style="stop-color: silver"/>
    <stop offset="50%" style="stop-color: gold"/>
    <stop offset="60%" style="stop-color: aqua"/>
    <stop offset="70%" style="stop-color: gray"/>
    <stop offset="80%" style="stop-color: hotpink"/>
    <stop offset="90%" style="stop-color: blue"/>
    <stop offset="100%" style="stop-color: red;"/>
</linearGradient>

<!--渐变圆点-->
<radialGradient id="_vc_def_map_point">
  <stop offset="0%" style="stop-color: transparent;"/>
  <stop offset="40%" style="stop-color: transparent;"/>
  <stop offset="100%" style="stop-color: #00F6FF;"/>
</radialGradient>
`

export default html;