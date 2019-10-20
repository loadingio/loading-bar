require! "./presets": {presets}

simple-str = (arr) -> arr.join ''
wrap = (content) -> "data:image/svg+xml;base64," + btoa(content)

do ->
    make =
        head: (viewBox) -> """
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
            x = gx * 100
            y = gy * 100
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
            ret ++= [
                """<rect fill="#c2" width="100" height="100"/>"""
                """<g><g>"""
                ["""<polygon fill="#c1" """ +
                 """points="#{-90 + i * 20},100 #{-100 + i * 20},""" +
                 """100 #{-60 + i * 20},0 #{-50 + i * 20},0 "/>""" for i from 0 til 13].join("")
                """</g><animateTransform attributeName="transform" type="translate" """
                """from="0,0" to="20,0" dur="#{dur}s" repeatCount="indefinite"/></g></svg>"""
            ].join("")
            wrap ret

        bubble: (c1 = \#39d, c2 = \#9cf, count = 15, dur = 1, size = 6, sw=1) ->
            ret = [@head("0 0 200 200"), """<rect x="0" y="0" width="200" height="200" fill="#c1"/>"""]
            for i from 0 til count =>
                idx = -(i / count) * dur
                x = Math.random! * 184 + 8
                r = ( Math.random! * 0.7 + 0.3 ) * size
                d = dur * (1 + Math.random! * 0.5)
                ret.push [
                    """<circle cx="#x" cy="0" r="#r" fill="none" stroke="#c2" stroke-width="#sw">"""
                    """<animate attributeName="cy" values="190;-10" times="0;1" """
                    """dur="#{d}s" begin="#{idx}s" repeatCount="indefinite"/>"""
                    """</circle>"""
                    """<circle cx="#x" cy="0" r="#r" fill="none" stroke="#c2" stroke-width="#sw">"""
                    """<animate attributeName="cy" values="390;190" times="0;1" """
                    """dur="#{d}s" begin="#{idx}s" repeatCount="indefinite"/>"""
                    """</circle>"""
                ].join("")
            wrap(ret.join("") + "</svg>")

    handler =
        queue: {}
        running: false
        main: (timestamp) ->
            keepon = false
            removed = []
            for k,func of @queue =>
                ret = func timestamp
                if !ret => removed.push func
                keepon = keepon or ret
            for k,func of @queue => if removed.indexOf(func) >= 0 => delete @queue[k]
            if keepon => requestAnimationFrame (~> @main it)
            else @running = false
        add: (key, f) ->
            if !@queue[key] => @queue[key] = f
            if !@running =>
                @running = true
                requestAnimationFrame (~> @main it)


    window.ldBar = ldBar = (selector, option = {}) ->
        xmlns = xlink: "http://www.w3.org/1999/xlink"
        root = if typeof! selector is \String
            document.querySelector selector
        else
            selector

        if !root.ldBar => root.ldBar = @
        else return root.ldBar

        cls = root.getAttribute(\class) or ''
        if !~cls.indexOf('ldBar') => root.setAttribute \class, "#cls ldBar"
        id-prefix = "ldBar-#{Math.random!toString 16 .substring 2}"
        id =
            key: id-prefix
            clip: "#{id-prefix}-clip"
            filter: "#{id-prefix}-filter"
            pattern: "#{id-prefix}-pattern"
            mask: "#{id-prefix}-mask"
            mask-path: "#{id-prefix}-mask-path"
        domTree = (n,o) ->
            n = newNode n
            for k,v of o => if k != \attr => n.appendChild domTree(k, v or {})
            n.attrs(o.attr or {})
            n
        newNode = (n) -> document.createElementNS "http://www.w3.org/2000/svg", n
        document.body.__proto__.__proto__.__proto__
            ..text = (t) -> @appendChild document.createTextNode(t)
            ..attrs = (o) -> for k,v of o =>
                ret = /([^:]+):([^:]+)/.exec(k)
                if !ret or !xmlns[ret.1] => @setAttribute k, v
                else @setAttributeNS xmlns[ret.1], k, v
            ..styles = (o) -> for k,v of o => @style[k] = v
            ..append = (n) -> @appendChild r = document.createElementNS "http://www.w3.og/2000/svg", n
            ..attr = (n,v) -> if v? => @setAttribute n, v else @getAttribute n
        config =
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

        config["preset"] = root.attr("data-preset") or option["preset"]

        if config.preset?
            # use the default preset
            config <<< presets[config.preset]

        # overwrite if there are arguments passed via data-* attributes
        for attr of config
            if that = root.attr "data-#{attr}"
                config[attr] = that

        config <<< option
        if config.img => config.path = null

        is-stroke = config.type == \stroke
        parse-res = (v) ->
            parser = /data:ldbar\/res,([^()]+)\(([^)]+)\)/
            ret = parser.exec(v)
            if !ret => return v
            ret = make[ret.1].apply make, ret.2.split(\,)
        config.fill = parse-res config.fill
        config.stroke = parse-res config.stroke
        if config["set-dim"] == \false => config["set-dim"] = false

        dom =
            attr:
                "xmlns:xlink": \http://www.w3.org/1999/xlink
                preserveAspectRatio: config["aspect-ratio"]
                width: "100%", height: "100%"
            defs:
                filter:
                    attr: id: id.filter, x: -1, y: -1, width: 3, height: 3
                    feMorphology: attr:
                        operator: (if +config["fill-background-extrude"]>=0 => \dilate else \erode)
                        radius: Math.abs(+config["fill-background-extrude"])
                    feColorMatrix: attr: {values: '0 0 0 0 1    0 0 0 0 1    0 0 0 0 1    0 0 0 1 0', result: "cm"}
                mask:
                    attr: id: id.mask
                    image: attr:
                        "xlink:href": config.img
                        filter: "url(\##{id.filter})"
                        x: 0, y: 0, width: 100, height: 100, preserveAspectRatio: config["aspect-ratio"]

                g:
                    mask:
                        attr: id: id.mask-path
                        path: attr:
                            d: config.path or ""
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

        svg = domTree \svg, dom
        text = document.createElement \div
        text.setAttribute \class, \ldBar-label
        root.appendChild svg
        root.appendChild text

        group = [0,0]
        length = 0

        @fit = ~>
            if config["bbox"] =>
              box = that.split(' ').map(->+(it.trim!))
              box = {x: box.0, y: box.1, width: box.2, height: box.3}
            else box = group.1.getBBox!
            if !box or box.width == 0 or box.height == 0 => box = {x: 0, y: 0, width: 100, height: 100}
            d = (Math.max.apply(
              null, <[stroke-width stroke-trail-width fill-background-extrude]>.map(->config[it]))
            ) * 1.5
            if config["padding"]? => d = +config["padding"]

            svg.attrs viewBox: [box.x - d, box.y - d, box.width + d * 2, box.height + d * 2].join(" ")
            if config["set-dim"] => <[width height]>.map ~> if !root.style[it] or @fit[it] =>
              root.style[it] = "#{box[it] + d * 2}px"
              @fit[it] = true

            rect = group.0.querySelector \rect
            if rect => rect.attrs do
                x: box.x - d, y: box.y - d, width: box.width + d * 2, height: box.height + d * 2

        if config.path =>
            if is-stroke =>
                group.0 = domTree \g, path: attr:
                    d: config.path
                    fill: \none
                    class: \baseline
            else
                group.0 = domTree \g, rect: attr:
                    x: 0, y: 0, width: 100, height: 100
                    mask: "url(\##{id.mask-path})", fill: config["fill-background"]
                    class: \frame

            svg.appendChild group.0
            group.1 = domTree \g, path: attr:
                d: config.path, class: if is-stroke => \mainline else \solid
                "clip-path": if config.type == \fill => "url(\##{id.clip})" else ''
            svg.appendChild group.1
            path0 = group.0.querySelector (if is-stroke => \path else \rect)
            path1 = group.1.querySelector \path
            if is-stroke => path1.attrs fill: \none

            patimg = svg.querySelector 'pattern image'
            img = new Image!
            img.addEventListener \load, ->
                box = if config["pattern-size"] => {width: +that, height: +that}
                else if img.width and img.height => {width: img.width, height: img.height}
                else {width: 300, height: 300}
                svg.querySelector \pattern .attrs {width: box.width, height: box.height}
                patimg.attrs {width: box.width, height: box.height}
            if /.+\..+|^data:/.exec(if !is-stroke => config.fill else config.stroke) =>
                img.src = if !is-stroke => config.fill else config.stroke
                patimg.attrs "xlink:href": img.src #if !is-stroke => config.fill else config.stroke

            if is-stroke =>
                path0.attrs stroke: config["stroke-trail"], "stroke-width": config["stroke-trail-width"]
                path1.attrs do
                    "stroke-width": config["stroke-width"]
                    stroke: if /.+\..+|^data:/.exec(config.stroke) => "url(\##{id.pattern})" else config.stroke
            if config.fill and !is-stroke =>
                path1.attrs do
                    fill: if /.+\..+|^data:/.exec(config.fill) => "url(\##{id.pattern})" else config.fill

            length = path1.getTotalLength!
            @fit!
            @inited = true
        else if config.img =>
            if config["img-size"] =>
                ret = config["img-size"].split(\,)
                size = {width: +ret.0, height: +ret.1}
            else size = {width: 100, height: 100}

            group.0 = domTree \g, rect: attr:
                x: 0, y: 0, width: 100, height: 100, mask: "url(\##{id.mask})", fill: config["fill-background"]
            svg.querySelector 'mask image' .attrs do
                width: size.width, height: size.height
            group.1 = domTree \g, image: attr:
                width: size.width, height: size.height, x: 0, y: 0, preserveAspectRatio: config["aspect-ratio"]
                #width: 100, height: 100, x: 0, y: 0, preserveAspectRatio: "xMidYMid"
                "clip-path": if config.type == \fill => "url(\##{id.clip})" else ''
                "xlink:href": config.img, class: \solid
            img = new Image!
            img.addEventListener \load, ~>
                if config["img-size"] =>
                    ret = config["img-size"].split(\,)
                    size = {width: +ret.0, height: +ret.1}
                else if img.width and img.height => size = {width: img.width, height: img.height}
                else size = {width: 100, height: 100}
                svg.querySelector 'mask image' .attrs do
                    width: size.width, height: size.height
                group.1.querySelector 'image' .attrs do
                    width: size.width, height: size.height

                @fit!

                # image is load, so we set value again.
                # if we need transition - we have to clean value so it will be treated as 0.
                v = @value
                @value = undefined
                @set v, true
                @inited = true
            img.src = config.img
            svg.appendChild group.0
            svg.appendChild group.1
        svg.attrs width: \100%, height: \100% #, viewBox: '0 0 100 100'

        @transition =
            value:
                src: 0
                des: 0
            time: {}

            ease: (t,b,c,d) ->
                t = t / (d * 0.5)
                if t < 1 => return c * 0.5 * t * t + b
                t = t - 1
                return -c * 0.5 * (t*(t - 2) - 1) + b

            handler: (time, doTransition = true) ->
                if !@time.src? => @time.src = time
                [min,max,prec] = [config["min"], config["max"],1/config["precision"]]
                [dv, dt, dur] = [@value.des - @value.src, (time - @time.src) * 0.001, +config["duration"] or 1]
                v = if doTransition => @ease(dt, @value.src, dv, dur) else @value.des
                if config.precision => v = Math.round(v * prec) / prec
                else if doTransition => v = Math.round(v)
                v >?= min
                v <?= max
                text.textContent = v
                p = 100.0 * (v - min ) / ( max - min )
                if is-stroke =>
                    node = path1
                    style =
                        "stroke-dasharray": (
                            if config["stroke-dir"] == \reverse =>
                                "0 #{length * (100 - p) * 0.01} #{length * p * 0.01} 0"
                            else => "#{p * 0.01 * length} #{(100 - p) * 0.01 * length + 1}"
                        )
                else
                    box = group.1.getBBox!
                    dir = config["fill-dir"]
                    style = if dir == \btt or !dir => do
                        y: box.y + box.height * (100 - p) * 0.01
                        height: box.height * p * 0.01
                        x: box.x, width: box.width
                    else if dir == \ttb => do
                        y: box.y, height: box.height * p * 0.01
                        x: box.x, width: box.width
                    else if dir == \ltr => do
                        y: box.y, height: box.height
                        x: box.x, width: box.width * p * 0.01
                    else if dir == \rtl => do
                        y: box.y, height: box.height
                        x: box.x + box.width * (100 - p) * 0.01
                        width: box.width * p * 0.01
                    node = svg.querySelector \rect
                node.attrs style
                if dt >= dur => delete @time.src; return false
                return true
            start: (src, des, doTransition) ->
                @value <<< {src, des}
                !!( root.offsetWidth || root.offsetHeight || root.getClientRects!length )
                if !doTransition or !( root.offsetWidth || root.offsetHeight || root.getClientRects!length ) =>
                    @time.src = 0
                    @handler 1000, false
                    return
                handler.add id.key, (time) ~> return @handler time

        @set = (v,doTransition = true) ->
            src = @value or 0
            if v? => @value = v else v = @value
            des = @value
            @transition.start src, des, doTransition

        @set (+config.value or 0), config["transition-in"] or false
        @

    window.addEventListener \load, (->
        for node in document.querySelectorAll(\.ldBar) =>
          if !node.ldBar => node.ldBar = new ldBar node
    ), false

module.exports = ldBar
