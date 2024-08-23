xmlns = xlink: \http://www.w3.org/1999/xlink, svg: \http://www.w3.org/2000/svg

utils =
  attrs: (n, o = {}) ->
    for k,v of o => n.setAttribute k, v
  parse-res: (v) ->
    if !(r = /data:ldbar\/res,([^()]+)\(([^)]+)\)/.exec(v)) => return v
    return make[r.1].apply make, r.2.split(\,)
  dom: (n, o) ->
    n = document.createElementNS xmlns.svg, n
    for k,v of o => if k != \attr => n.appendChild utils.dom(k, v or {})
    utils.attrs n, o.attr
    n
  # this should be called with ldbar as this arg, e.g., utils.basedom.apply(new ldbar!)
  basedom: ->
    {id, cfg} = @
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
        feColorMatrix: attr: {values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0', result: "cm"}
      mask:
        attr: id: id.mask
        image: attr:
          "xlink:href": cfg.img
          filter: "url(\##{id.filter})"
          x: 0, y: 0, width: 100, height: 100, preserveAspectRatio: cfg["aspect-ratio"]
      g:
        mask:
          attr: id: id.maskpath
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

