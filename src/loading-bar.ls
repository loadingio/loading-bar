simple-str = (arr) -> arr.join ''
wrap = (content) -> "data:image/svg+xml;base64," + btoa(content)
xmlns = xlink: \http://www.w3.org/1999/xlink, svg: \http://www.w3.org/2000/svg

domTree = (n,o) ->
  n = document.createElementNS xmlns.svg, n
  for k,v of o => if k != \attr => n.appendChild domTree(k, v or {})
  attrs n, (o.attr or {})
  n

parse-res = (v) ->
  if !(r = /data:ldbar\/res,([^()]+)\(([^)]+)\)/.exec(v)) => return v
  return make[r.1].apply make, r.2.split(\,)

txt = (n,t) -> n.appendChild document.createTextNode(t)
styles = (n,o) -> for k,v of o => n.style[k] = v
append = (n,v) -> n.appendChild r = document.createElementNS xmlns.svg, v
attr = (n,k,v) -> if v? => n.setAttribute k, v else n.getAttribute k
attrs = (n,o) -> for k,v of o =>
  r = /([^:]+):([^:]+)/.exec(k)
  if !r or !xmlns[r.1] => n.setAttribute k, v
  else n.setAttributeNS xmlns[ret.1], k, v

do ->
  # raf - RequestAnimationFrame until nothing is in the queue.
  raf = do
    q: {}    # q: queue, as a hash object, stores functions to be run
    r: false # r: is raf running
    m: -> requestAnimationFrame (t) ~>
      # nx: true if there should be a next raf call
      # rm: keys for funcs to be excluded in next round.
      [nx,rm] = [false, []]
      for k,f of @q => if !(ret = f(t)) => delete @q[k] else nx = true
      if nx => @m! else @r = false
    # key: use to identify which ldBar this f belongs to
    # f:   function to be run. dequeue f if f returns false.
    add: (key, f) ->
      if !@q[key] => @q[key] = f
      if @r => return else @r = true
      @m!

  ldBar = (root, opt = {}) ->
    root = if typeof(root) == \string => document.querySelector root else root
    if root.ldBar => return that else root.ldBar = @
    root.classList.add \ldBar # must contains ldBar class for every ldBar node.

    # id for injected svg nodes
    id = "ldBar-#{Math.random!toString 16 .substring 2}"
    id = do
      key: id
      clip: "#{id}-clip"
      filter: "#{id}-filter"
      pattern: "#{id}-pattern"
      mask: "#{id}-mask"
      mask-path: "#{id}-mask-path"

    # Prepare cfg.
    cfg = do # default values
      "type": 'stroke'
      "img": ''
      "path": 'M10 10L90 10M90 8M90 12'
      "fill-dir": \btt
      "fill": \#25b
      "fill-background": \#ddd
      "fill-background-extrude": 3
      "pattern-size": null
      "stroke-dir": \normal
      "stroke": \#25b
      "stroke-width": \3
      "stroke-trail": \#ddd
      "stroke-trail-width": 0.5
      "duration": 1
      "easing": \linear
      "value": 0
      "img-size": null
      "bbox": null
      "set-dim": true
      "aspect-ratio": "xMidYMid"
      "transition-in": false
      "min": 0
      "max": 100
      "precision": 0
      "padding": undefined
    # config priority: attr in js opt > data-attr > attr in preset > default value
    cfg.preset = attr(root,\data-preset) or opt.preset
    if cfg.preset? => cfg <<< presets[cfg.preset] # load config from preset
    # overwrite if there are arguments passed via data-* attributes
    for a of cfg => if attr(root, "data-#a") => cfg[a] = that
    cfg <<< opt

    # Normalize cfg
    if cfg.img => cfg.path = null
    cfg.fill = parse-res cfg.fill
    cfg.stroke = parse-res cfg.stroke
    if cfg["set-dim"] == \false => cfg["set-dim"] = false
    is-stroke = cfg.type == \stroke

    # Prepare SVG DOM
    dom = do
        attr:
            "xmlns:xlink": xmlns.xlink
            preserveAspectRatio: cfg["aspect-ratio"]
            width: "100%", height: "100%"
        defs:
            filter:
                attr: id: id.filter, x: -1, y: -1, width: 3, height: 3
                feMorphology: attr:
                    operator: (if +cfg["fill-background-extrude"]>=0 => \dilate else \erode)
                    radius: Math.abs(+cfg["fill-background-extrude"])
                feColorMatrix: attr: {values: '0 0 0 0 1    0 0 0 0 1    0 0 0 0 1    0 0 0 1 0', result: "cm"}
            mask:
                attr: id: id.mask
                image: attr:
                    "xlink:href": cfg.img
                    filter: "url(\##{id.filter})"
                    x: 0, y: 0, width: 100, height: 100, preserveAspectRatio: cfg["aspect-ratio"]

            g:
                mask:
                    attr: id: id.mask-path
                    path: attr:
                        d: cfg.path or ""
                        fill: \#fff
                        stroke: \#fff
                        filter: "url(\##{id.filter})"

            clipPath:
                attr: id: id.clip
                rect: {attr: class: \mask, fill: \#000}
            pattern:
                attr:
                    id: id.pattern, patternUnits: \userSpaceOnUse
                    x:0, y: 0, width: 300, height: 300
                image: attr: x: 0, y: 0, width: 300, height: 300

    root.appendChild(svg = domTree \svg, dom)
    root.appendChild(text = document.createElement \div)
    text.setAttribute \class, \ldBar-label

    # group:
    #   0: <g> for base / frame elements
    #   1: <g> for foreground path elements
    # len:   TODO
    [group,len] = [[0,0],0]

    @fit = ~>
      if cfg.bbox =>
        box = that.split(' ').map(->+(it.trim!))
        box = {x: box.0, y: box.1, width: box.2, height: box.3}
      else box = group.1.getBBox!
      # TODO: 就是這邊把 bbox 搞爛
      if !box or !box.width or !box.height => box = {x: 0, y: 0, width: 100, height: 100}
      # TODO padding 要怎麼算?
      d = (Math.max.apply(
        null, <[stroke-width stroke-trail-width fill-background-extrude]>.map(->cfg[it]))
      ) * 1.5
      if cfg["padding"]? => d = +cfg["padding"]
      attrs svg, viewBox: [box.x - d, box.y - d, box.width + d * 2, box.height + d * 2].join(" ")
      if cfg["set-dim"] => <[width height]>.map ~> if !root.style[it] or @fit[it] =>
        root.style[it] = "#{box[it] + d * 2}px"
        @fit[it] = true
      rect = group.0.querySelector \rect
      if rect => attrs rect, do
        x: box.x - d, y: box.y - d, width: box.width + d * 2, height: box.height + d * 2

    # Deal with path / image bar separately
    if cfg.path => # Path Type Bar
      if is-stroke => group.0 = domTree \g, path: attr: {d: cfg.path, fill: \none, class: \baseline}
      else group.0 = domTree \g, rect: attr:
        x: 0, y: 0, width: 100, height: 100
        mask: "url(\##{id.mask-path})", fill: cfg["fill-background"]
        class: \frame
      svg.appendChild group.0
      group.1 = domTree \g, path: attr:
        d: cfg.path, class: if is-stroke => \mainline else \solid
        "clip-path": if cfg.type == \fill => "url(\##{id.clip})" else ''
      svg.appendChild group.1
      # p0 / p1 - main visual elements in group0 and group1
      p0 = group.0.querySelector (if is-stroke => \path else \rect)
      p1 = group.1.querySelector \path
      if is-stroke => attrs p1, fill: \none

      pimg = svg.querySelector 'pattern image'
      img = new Image!
      img.addEventListener \load, ->
        box = if cfg["pattern-size"] => {width: +that, height: +that}
        else if img.width and img.height => {width: img.width, height: img.height}
        else {width: 300, height: 300}
        attrs svg.querySelector(\pattern), {width: box.width, height: box.height}
        attrs pimg, {width: box.width, height: box.height}
      if /.+\..+|^data:/.exec(if !is-stroke => cfg.fill else cfg.stroke) =>
        img.src = if !is-stroke => cfg.fill else cfg.stroke
        attr pimg.attrs, \xlink:href, img.src

      if is-stroke =>
        attrs p0, {stroke: cfg["stroke-trail"], "stroke-width": cfg["stroke-trail-width"]}
        attrs p1, do
          "stroke-width": cfg["stroke-width"]
          stroke: if /.+\..+|^data:/.exec(cfg.stroke) => "url(\##{id.pattern})" else cfg.stroke
      else if cfg.fill =>
        attr p1, \fill, (if /.+\..+|^data:/.exec(cfg.fill) => "url(\##{id.pattern})" else cfg.fill)

      len = p1.getTotalLength!
      @fit!
      @inited = true

    else if cfg.img =>
      size = if cfg["img-size"] => ret = cfg["img-size"].split(\,); {width: +ret.0, height: +ret.1}
      group.0 = domTree \g, rect: attr:
        x: 0, y: 0, width: 100, height: 100, mask: "url(\##{id.mask})", fill: cfg["fill-background"]
      attrs svg.querySelector('mask image'), {width: size.width, height: size.height}
      group.1 = domTree \g, image: attr:
        width: size.width, height: size.height, x: 0, y: 0, preserveAspectRatio: cfg["aspect-ratio"]
        "clip-path": if cfg.type == \fill => "url(\##{id.clip})" else ''
        "xlink:href": cfg.img, class: \solid
      img = new Image!
      img.addEventListener \load, ~>
        if !size =>
          if img.width and img.height => size = {width: img.width, height: img.height}
          else size = {width: 100, height: 100}
        attrs svg.querySelector('mask image'), size
        attrs group.1.querySelector('image'), size
        @fit!
        @set undefined, false
        @inited = true
      img.src = cfg.img
      svg.appendChild group.0
      svg.appendChild group.1

    attrs svg, {width: \100%, height: \100%}

    transition = do
      v: { src: 0, des: 0 }, t: {}
      ease: (t,b,c,d) ->
        t = t / (d * 0.5)
        if t < 1 => return c * 0.5 * t * t + b
        t = t - 1
        return -c * 0.5 * (t*(t - 2) - 1) + b

      # t: current time.  ani: do transition if ani = true
      handler: (t, ani = true) ->
        if !@t.src? => @t.src = t
        [min,max,prec] = [cfg.min, cfg.max,1/cfg.precision]
        [dv, dt, dur] = [@v.des - @v.src, (t - @t.src) * 0.001, +cfg.duration or 1]
        @v.cur = v = if ani => @ease(dt, @v.src, dv, dur) else @v.des
        if cfg.precision => v = Math.round(v * prec) / prec
        else if ani => v = Math.round(v)
        v = v <? max >? min
        text.textContent = v
        p = 100.0 * (v - min ) / ( max - min )
        if is-stroke =>
          node = p1
          style =
            "stroke-dasharray": (
              if cfg["stroke-dir"] == \reverse =>
                "0 #{len * (100 - p) * 0.01} #{len * p * 0.01} 0"
              else => "#{p * 0.01 * len} #{(100 - p) * 0.01 * len + 1}"
            )
        else
          box = group.1.getBBox!
          dir = cfg["fill-dir"]
          style = {
            y: box.y, height: box.height
            x: box.x, width: box.width
          } <<< if dir == \btt or !dir => do
            y: box.y + box.height * (100 - p) * 0.01
            height: box.height * p * 0.01
          else if dir == \rtl => do
            x: box.x + box.width * (100 - p) * 0.01
            width: box.width * p * 0.01
          else if dir == \ttb => { height: box.height * p * 0.01 }
          else if dir == \ltr => { width: box.width * p * 0.01 }
          node = svg.querySelector \rect
        attrs node, style
        # return true if we are still doing transition
        if dt >= dur => delete @t.src; return false
        return true

      start: (src, des, ani) ->
        @v <<< {src, des}
        if !ani or !( root.offsetWidth || root.offsetHeight || root.getClientRects!length ) =>
          @t.src = 0
          @handler 1000, false
        else raf.add id.key, (time) ~> return @handler time

    # set value to v. animate if ani is true
    @set = (v, ani = true) -> transition.start (@v.cur or @v.src or 0), (if v? => v else @v.des), ani
    @set (+cfg.value or 0), cfg["transition-in"] or false
    @

  window.addEventListener \load, (->
    for n in document.querySelectorAll(\.ldBar) => if !n.ldBar => new ldBar n
  ), false

if module? => module.exports = ldBar
if window? => window.ldBar = ldBar
