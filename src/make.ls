make = do
  head: (viewBox) ->
    """
    <?xml version="1.0" encoding="utf-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="#viewBox">
    """
  gradient: (dir = 45, dur = 1, ...colors) ->
    ret = [@head "0 0 100 100"]
    len = colors.length * 4 + 1
    dir = dir * Math.PI / 180
    gx = Math.cos(dir) ** 2
    gy = Math.sqrt(gx - gx ** 2)
    if dir > Math.PI * 0.25 =>
      gy = Math.sin(dir) ** 2
      gx = Math.sqrt(gy - gy ** 2)
    [x,y] = [gx * 100, gy * 100]
    ret.push """<defs><linearGradient id="gradient" x1="0" x2="#gx" y1="0" y2="#gy">"""
    for i from 0 til len =>
      idx = i * 100 / (len - 1)
      ret.push """<stop offset="#{idx}%" stop-color="#{colors[i % colors.length]}"/>"""
    ret.push """
      </linearGradient></defs>
      <rect x="0" y="0" width="400" height="400" fill="url(\#gradient)">
      <animateTransform attributeName="transform" type="translate" from="-#x,-#y"
      to="0,0" dur="#{dur}s" repeatCount="indefinite"/></rect></svg>
      """
    wrap ret.join("")
  stripe: (c1=\#b4b4b4, c2=\#e6e6e6, dur = 1) ->
    ret = [@head "0 0 100 100"]
    p = ["""
    <polygon fill="#c1" points="#{-90 + i * 20},100 #{-100 + i * 20},100 #{-60 + i * 20},0 #{-50 + i * 20},0 "/>
    """ for i from 0 til 13].join("")
    ret = """
    #{@head '0 0 100 100'}
    <rect fill="#c2" width="100" height="100"/>
    <g>
      <g>#p</g>
      <animateTransform attributeName="transform" type="translate"
      from="0,0" to="20,0" dur="#{dur}s" repeatCount="indefinite"/>
    </g></svg>"""
    wrap ret
  bubble: (c1 = \#39d, c2 = \#9cf, count = 15, dur = 1, size = 6, sw=1) ->
    ret = [@head("0 0 200 200"), """<rect x="0" y="0" width="200" height="200" fill="#c1"/>"""]
    for i from 0 til count =>
      idx = -(i / count) * dur
      x = Math.random! * 184 + 8
      r = ( Math.random! * 0.7 + 0.3 ) * size
      d = dur * (1 + Math.random! * 0.5)
      ret.push [
        """<circle cx="#x" cy="0" r="#r" fill="none" stroke="#c2" stroke-width="#sw">
        <animate attributeName="cy" values="190;-10" times="0;1" 
        dur="#{d}s" begin="#{idx}s" repeatCount="indefinite"/>
        </circle>
        <circle cx="#x" cy="0" r="#r" fill="none" stroke="#c2" stroke-width="#sw">
        <animate attributeName="cy" values="390;190" times="0;1" 
        dur="#{d}s" begin="#{idx}s" repeatCount="indefinite"/>
        </circle>"""
      ].join("")
    wrap(ret.join("") + "</svg>")

