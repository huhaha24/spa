let html = `<linearGradient id="f-bar" x1="0%" y1="100%" x2="0%" y2="0%"><!-- 条形图样式 -->
    <stop offset="0%" stop-color="#02CBFE"></stop>
    <stop offset="100%" stop-color="#0D365D"></stop>
</linearGradient>
<linearGradient id="f-bar-hover" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stop-color="#C94BC3"></stop>
    <stop offset="100%" stop-color="#0D365D"></stop>
</linearGradient>

<!-- 连线样式 -->
<linearGradient id="f-line" gradientUnits="objectBoundingBox">
    <stop offset="0" stop-color="#C91A2C" />
    <stop offset=".33" stop-color="#A17095" />
    <stop offset=".67" stop-color="#D04DC1" />
    <stop offset="1" stop-color="#C91A2C" />
</linearGradient>
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
<!-- 连线点样式 -->
<radialGradient id="f-line-point">
    <stop offset="0%" style="stop-color: transparent;" />
    <stop offset="40%" style="stop-color: #FF7770;" />
    <stop offset="100%" style="stop-color: #D1F9D6;" />
</radialGradient>

<!-- 飞线样式 -->
<linearGradient id="f-fly" gradientUnits="objectBoundingBox">
    <stop offset="0" stop-color="#0e374f" />
    <stop offset=".33" stop-color="#069a2b" />
    <stop offset=".67" stop-color="#d6f252" />
    <stop offset="1" stop-color="#ffffff" />
</linearGradient>

<!-- 扩散点样式 -->
<radialGradient id="f-point">
    <stop offset="0%" style="stop-color: transparent;" />
    <stop offset="40%" style="stop-color: transparent;" />
    <stop offset="100%" style="stop-color: #00F6FF;" />
</radialGradient>


<!-- 地图伪3D阴影效果 -->
<filter id="f-shadow">
    <feColorMatrix type="matrix" values = "
      0 0 0 .0  0
      0 0 0 .8 0
      0 0 0 .8 0
      0 0 0 .5 0
    "></feColorMatrix>
    <feGaussianBlur stdDeviation="2" result="colorBlur1"></feGaussianBlur>

    <feOffset result="offsetBlur0" in="colorBlur1" dx="1" dy="1"/>
    <feOffset result="offsetBlur1" in="colorBlur1" dx="2" dy="2"/>
    <feOffset result="offsetBlur2" in="colorBlur1" dx="3" dy="3"/>

    <feSpecularLighting in="SourceGraphic" lighting-color="#ffb8b8" surfaceScale="1" specularConstant="1" specularExponent="115"
        result="light">
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

<filter id="shadow">
    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
    <feOffset in="blur" dx="13" dy="13" result="offsetBlur"/>
    <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="SourceGraphic"/>
    </feMerge>
</filter>

<filter id="shadow-1">

    <feColorMatrix type="matrix" values = "
      0 0 0 .0  0
      0 0 0 .1 0
      0 0 0 .1 0
      0 0 0 .2 0
    "></feColorMatrix>
    <feGaussianBlur stdDeviation="1" result="colorBlur1" ></feGaussianBlur>
  
    <feOffset result="offsetBlur0" in="colorBlur1" dx="1"  dy="2" />
    <feOffset result="offsetBlur1" in="colorBlur1" dx="2"  dy="4" />
    <feOffset result="offsetBlur2" in="colorBlur1" dx="3"  dy="6" />
    <feOffset result="offsetBlur3" in="colorBlur1" dx="4"  dy="8" />
    <feOffset result="offsetBlur4" in="colorBlur1" dx="5"  dy="10" />
    <feOffset result="offsetBlur5" in="colorBlur1" dx="6"  dy="12" />
    <feOffset result="offsetBlur6" in="colorBlur1" dx="7"  dy="14" />
    <feOffset result="offsetBlur7" in="colorBlur1" dx="8"  dy="16" />
    <feOffset result="offsetBlur8" in="colorBlur1" dx="9"  dy="18" />
  
    <feMerge>
      <feMergeNode in="offsetBlur0" />
      <feMergeNode in="offsetBlur1" />
      <feMergeNode in="offsetBlur2" />
      <feMergeNode in="offsetBlur3" />
      <feMergeNode in="offsetBlur4" />
      <feMergeNode in="offsetBlur5" />
      <feMergeNode in="offsetBlur6" />
      <feMergeNode in="offsetBlur7" />
      <feMergeNode in="offsetBlur8" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
  `
export default html;
