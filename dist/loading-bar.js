(function() {
var make;
make = {
  head: function(viewBox){
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n  <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"" + viewBox + "\">";
  },
  gradient: function(dir, dur){
    var colors, res$, i$, to$, ret, len, gx, gy, ref$, x, y, i, idx;
    dir == null && (dir = 45);
    dur == null && (dur = 1);
    res$ = [];
    for (i$ = 2, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    colors = res$;
    ret = [this.head("0 0 100 100")];
    len = colors.length * 4 + 1;
    dir = dir * Math.PI / 180;
    gx = Math.pow(Math.cos(dir), 2);
    gy = Math.sqrt(gx - Math.pow(gx, 2));
    if (dir > Math.PI * 0.25) {
      gy = Math.pow(Math.sin(dir), 2);
      gx = Math.sqrt(gy - Math.pow(gy, 2));
    }
    ref$ = [gx * 100, gy * 100], x = ref$[0], y = ref$[1];
    ret.push("<defs><linearGradient id=\"gradient\" x1=\"0\" x2=\"" + gx + "\" y1=\"0\" y2=\"" + gy + "\">");
    for (i$ = 0; i$ < len; ++i$) {
      i = i$;
      idx = i * 100 / (len - 1);
      ret.push("<stop offset=\"" + idx + "%\" stop-color=\"" + colors[i % colors.length] + "\"/>");
    }
    ret.push("</linearGradient></defs>\n<rect x=\"0\" y=\"0\" width=\"400\" height=\"400\" fill=\"url(#gradient)\">\n<animateTransform attributeName=\"transform\" type=\"translate\" from=\"-" + x + ",-" + y + "\"\nto=\"0,0\" dur=\"" + dur + "s\" repeatCount=\"indefinite\"/></rect></svg>");
    return wrap(ret.join(""));
  },
  stripe: function(c1, c2, dur){
    var ret, p, i;
    c1 == null && (c1 = '#b4b4b4');
    c2 == null && (c2 = '#e6e6e6');
    dur == null && (dur = 1);
    ret = [this.head("0 0 100 100")];
    p = (function(){
      var i$, results$ = [];
      for (i$ = 0; i$ < 13; ++i$) {
        i = i$;
        results$.push("<polygon fill=\"" + c1 + "\" points=\"" + (-90 + i * 20) + ",100 " + (-100 + i * 20) + ",100 " + (-60 + i * 20) + ",0 " + (-50 + i * 20) + ",0 \"/>");
      }
      return results$;
    }()).join("");
    ret = "" + this.head('0 0 100 100') + "\n<rect fill=\"" + c2 + "\" width=\"100\" height=\"100\"/>\n<g>\n  <g>" + p + "</g>\n  <animateTransform attributeName=\"transform\" type=\"translate\"\n  from=\"0,0\" to=\"20,0\" dur=\"" + dur + "s\" repeatCount=\"indefinite\"/>\n</g></svg>";
    return wrap(ret);
  },
  bubble: function(c1, c2, count, dur, size, sw){
    var ret, i$, i, idx, x, r, d;
    c1 == null && (c1 = '#39d');
    c2 == null && (c2 = '#9cf');
    count == null && (count = 15);
    dur == null && (dur = 1);
    size == null && (size = 6);
    sw == null && (sw = 1);
    ret = [this.head("0 0 200 200"), "<rect x=\"0\" y=\"0\" width=\"200\" height=\"200\" fill=\"" + c1 + "\"/>"];
    for (i$ = 0; i$ < count; ++i$) {
      i = i$;
      idx = -(i / count) * dur;
      x = Math.random() * 184 + 8;
      r = (Math.random() * 0.7 + 0.3) * size;
      d = dur * (1 + Math.random() * 0.5);
      ret.push(["<circle cx=\"" + x + "\" cy=\"0\" r=\"" + r + "\" fill=\"none\" stroke=\"" + c2 + "\" stroke-width=\"" + sw + "\">\n<animate attributeName=\"cy\" values=\"190;-10\" times=\"0;1\" \ndur=\"" + d + "s\" begin=\"" + idx + "s\" repeatCount=\"indefinite\"/>\n</circle>\n<circle cx=\"" + x + "\" cy=\"0\" r=\"" + r + "\" fill=\"none\" stroke=\"" + c2 + "\" stroke-width=\"" + sw + "\">\n<animate attributeName=\"cy\" values=\"390;190\" times=\"0;1\" \ndur=\"" + d + "s\" begin=\"" + idx + "s\" repeatCount=\"indefinite\"/>\n</circle>"].join(""));
    }
    return wrap(ret.join("") + "</svg>");
  }
};
var presets, out$ = typeof exports != 'undefined' && exports || this;
out$.presets = presets = {
  rainbow: {
    "type": 'stroke',
    "path": 'M10 10L90 10',
    "stroke": 'data:ldbar/res,gradient(0,1,#a551df,#fd51ad,#ff7f82,#ffb874,#ffeb90)'
  },
  energy: {
    "type": 'fill',
    "path": 'M15 5L85 5A5 5 0 0 1 85 15L15 15A5 5 0 0 1 15 5',
    "stroke": '#f00',
    "fill": 'data:ldbar/res,gradient(45,2,#4e9,#8fb,#4e9)',
    "fill-dir": "ltr",
    "fill-background": '#444',
    "fill-background-extrude": 1,
    "bbox": "10 5 80 10"
  },
  stripe: {
    "type": 'fill',
    "path": 'M15 5L85 5A5 5 0 0 1 85 15L15 15A5 5 0 0 1 15 5',
    "stroke": '#f00',
    "fill": 'data:ldbar/res,stripe(#25b,#58e,1)',
    "fill-dir": "ltr",
    "fill-background": '#ddd',
    "fill-background-extrude": 1,
    "bbox": "10 5 80 10"
  },
  text: {
    "type": 'fill',
    "img": "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"70\" height=\"20\" viewBox=\"0 0 70 20\"><text x=\"35\" y=\"10\" text-anchor=\"middle\" dominant-baseline=\"central\" font-family=\"arial\">LOADING</text></svg>",
    "fill-background-extrude": 1.3,
    "pattern-size": 100,
    "fill-dir": "ltr",
    "img-size": "70,20",
    "bbox": "0 0 70 20"
  },
  line: {
    "type": 'stroke',
    "path": 'M10 10L90 10',
    "stroke": '#25b',
    "stroke-width": 3,
    "stroke-trail": '#ddd',
    "stroke-trail-width": 1
  },
  fan: {
    "type": 'stroke',
    "path": 'M10 90A40 40 0 0 1 90 90',
    "fill-dir": 'btt',
    "fill": '#25b',
    "fill-background": '#ddd',
    "fill-background-extrude": 3,
    "stroke-dir": 'normal',
    "stroke": '#25b',
    "stroke-width": '3',
    "stroke-trail": '#ddd',
    "stroke-trail-width": 0.5,
    "bbox": "10 50 80 40"
  },
  circle: {
    "type": 'stroke',
    "path": 'M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10',
    "fill-dir": 'btt',
    "fill": '#25b',
    "fill-background": '#ddd',
    "fill-background-extrude": 3,
    "stroke-dir": 'normal',
    "stroke": '#25b',
    "stroke-width": '3',
    "stroke-trail": '#ddd',
    "stroke-trail-width": 0.5,
    "bbox": "10 10 80 80"
  },
  bubble: {
    "type": 'fill',
    "path": 'M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10',
    "fill-dir": 'btt',
    "fill": 'data:ldbar/res,bubble(#39d,#cef)',
    "pattern-size": "150",
    "fill-background": '#ddd',
    "fill-background-extrude": 2,
    "stroke-dir": 'normal',
    "stroke": '#25b',
    "stroke-width": '3',
    "stroke-trail": '#ddd',
    "stroke-trail-width": 0.5,
    "padding": 2,
    "bbox": "10 10 80 80"
  }
};
var simpleStr, wrap, xmlns, domTree, parseRes, txt, styles, append, attr, attrs;
simpleStr = function(arr){
  return arr.join('');
};
wrap = function(content){
  return "data:image/svg+xml;base64," + btoa(content);
};
xmlns = {
  xlink: 'http://www.w3.org/1999/xlink',
  svg: 'http://www.w3.org/2000/svg'
};
domTree = function(n, o){
  var k, v;
  n = document.createElementNS(xmlns.svg, n);
  for (k in o) {
    v = o[k];
    if (k !== 'attr') {
      n.appendChild(domTree(k, v || {}));
    }
  }
  attrs(n, o.attr || {});
  return n;
};
parseRes = function(v){
  var r;
  if (!(r = /data:ldbar\/res,([^()]+)\(([^)]+)\)/.exec(v))) {
    return v;
  }
  return make[r[1]].apply(make, r[2].split(','));
};
txt = function(n, t){
  return n.appendChild(document.createTextNode(t));
};
styles = function(n, o){
  var k, v, results$ = [];
  for (k in o) {
    v = o[k];
    results$.push(n.style[k] = v);
  }
  return results$;
};
append = function(n, v){
  var r;
  return n.appendChild(r = document.createElementNS(xmlns.svg, v));
};
attr = function(n, k, v){
  var r;
  r = /([^:]+):([^:]+)/.exec(k);
  if (v != null) {
    return !r || !xmlns[r[1]]
      ? n.setAttribute(k, v)
      : n.setAttributeNS(xmlns[r[1]], k, v);
  } else {
    return !r || !xmlns[r[1]]
      ? n.getAttribute(k)
      : n.getAttributeNS(xmlns[r[1]], k);
  }
};
attrs = function(n, o){
  var k, v, r, results$ = [];
  for (k in o) {
    v = o[k];
    r = /([^:]+):([^:]+)/.exec(k);
    if (!r || !xmlns[r[1]]) {
      results$.push(n.setAttribute(k, v));
    } else {
      results$.push(n.setAttributeNS(xmlns[r[1]], k, v));
    }
  }
  return results$;
};
(function(){
  var raf, ldBar;
  raf = {
    q: {},
    r: false,
    m: function(){
      var this$ = this;
      return requestAnimationFrame(function(t){
        var ref$, nx, rm, k, f, ret;
        ref$ = [false, []], nx = ref$[0], rm = ref$[1];
        for (k in ref$ = this$.q) {
          f = ref$[k];
          if (!(ret = f(t))) {
            delete this$.q[k];
          } else {
            nx = true;
          }
        }
        if (nx) {
          return this$.m();
        } else {
          return this$.r = false;
        }
      });
    },
    add: function(key, f){
      if (!this.q[key]) {
        this.q[key] = f;
      }
      if (this.r) {
        return;
      } else {
        this.r = true;
      }
      return this.m();
    }
  };
  ldBar = function(root, opt){
    var that, id, cfg, a, isStroke, dom, svg, text, ref$, group, len, p0, p1, pimg, img, size, ret, trans, this$ = this;
    opt == null && (opt = {});
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (that = root.ldBar) {
      return that;
    } else {
      root.ldBar = this;
    }
    root.classList.add('ldBar');
    id = "ldBar-" + Math.random().toString(16).substring(2);
    id = {
      key: id,
      clip: id + "-clip",
      filter: id + "-filter",
      pattern: id + "-pattern",
      mask: id + "-mask",
      maskPath: id + "-mask-path"
    };
    cfg = {
      "type": 'stroke',
      "img": '',
      "path": 'M10 10L90 10',
      "fill-dir": 'btt',
      "fill": '#25b',
      "fill-background": '#ddd',
      "fill-background-extrude": 3,
      "pattern-size": null,
      "stroke-dir": 'normal',
      "stroke": '#25b',
      "stroke-width": '3',
      "stroke-trail": '#ddd',
      "stroke-trail-width": 0.5,
      "duration": 1,
      "easing": 'linear',
      "value": 0,
      "img-size": null,
      "bbox": null,
      "set-dim": true,
      "aspect-ratio": "xMidYMid",
      "transition-in": false,
      "min": 0,
      "max": 100,
      "precision": 0,
      "padding": undefined,
      "unit": null
    };
    cfg.preset = attr(root, 'data-preset') || opt.preset;
    if (cfg.preset != null) {
      import$(cfg, presets[cfg.preset]);
    }
    for (a in cfg) {
      if (that = attr(root, "data-" + a)) {
        cfg[a] = that;
      }
    }
    import$(cfg, opt);
    if (cfg.img) {
      cfg.path = null;
    }
    cfg.fill = parseRes(cfg.fill);
    cfg.stroke = parseRes(cfg.stroke);
    if (cfg["set-dim"] === 'false') {
      cfg["set-dim"] = false;
    }
    isStroke = cfg.type === 'stroke';
    if (cfg.unit) {
      root.classList.add('no-percent');
    }
    dom = {
      attr: {
        "xmlns:xlink": xmlns.xlink,
        preserveAspectRatio: cfg["aspect-ratio"],
        width: "100%",
        height: "100%"
      },
      defs: {
        filter: {
          attr: {
            id: id.filter,
            x: -1,
            y: -1,
            width: 3,
            height: 3
          },
          feMorphology: {
            attr: {
              operator: +cfg["fill-background-extrude"] >= 0 ? 'dilate' : 'erode',
              radius: Math.abs(+cfg["fill-background-extrude"])
            }
          },
          feColorMatrix: {
            attr: {
              values: '0 0 0 0 1    0 0 0 0 1    0 0 0 0 1    0 0 0 1 0',
              result: "cm"
            }
          }
        },
        mask: {
          attr: {
            id: id.mask
          },
          image: {
            attr: {
              "xlink:href": cfg.img,
              filter: "url(#" + id.filter + ")",
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              preserveAspectRatio: cfg["aspect-ratio"]
            }
          }
        },
        g: {
          mask: {
            attr: {
              id: id.maskPath
            },
            path: {
              attr: {
                d: cfg.path || "",
                fill: '#fff',
                stroke: '#fff',
                filter: "url(#" + id.filter + ")"
              }
            }
          }
        },
        clipPath: {
          attr: {
            id: id.clip
          },
          rect: {
            attr: {
              'class': 'mask',
              fill: '#000'
            }
          }
        },
        pattern: {
          attr: {
            id: id.pattern,
            patternUnits: 'userSpaceOnUse',
            x: 0,
            y: 0,
            width: 300,
            height: 300
          },
          image: {
            attr: {
              x: 0,
              y: 0,
              width: 300,
              height: 300
            }
          }
        }
      }
    };
    root.appendChild(svg = domTree('svg', dom));
    root.appendChild(text = document.createElement('div'));
    text.setAttribute('class', 'ldBar-label');
    ref$ = [[0, 0], 0], group = ref$[0], len = ref$[1];
    this.fit = function(){
      var that, box, p0, s0, p1, s1, sw, d, rect;
      if (that = cfg.bbox) {
        box = that.split(' ').map(function(it){
          return +it.trim();
        });
        box = {
          x: box[0],
          y: box[1],
          width: box[2],
          height: box[3]
        };
      } else {
        box = group[1].getBBox();
      }
      if (!box) {
        box = {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        };
      }
      p0 = group[0].querySelector('*');
      s0 = getComputedStyle(p0);
      p1 = group[1].querySelector('*');
      s1 = getComputedStyle(p1);
      sw = Math.max(+s0.strokeWidth.replace('px', ''), +s1.strokeWidth.replace('px', ''));
      box.width += sw;
      box.height += sw;
      box.x -= sw / 2;
      box.y -= sw / 2;
      d = cfg["padding"] != null ? +cfg["padding"] : 0;
      attrs(svg, {
        viewBox: [box.x - d, box.y - d, box.width + d * 2, box.height + d * 2].join(" ")
      });
      if (cfg["set-dim"]) {
        ['width', 'height'].map(function(it){
          if (!root.style[it] || this$.fit[it]) {
            return this$.fit[it] = true;
          }
        });
      }
      rect = group[0].querySelector('rect');
      if (rect) {
        return attrs(rect, {
          x: box.x - d,
          y: box.y - d,
          width: box.width + d * 2,
          height: box.height + d * 2
        });
      }
    };
    if (cfg.path) {
      if (isStroke) {
        group[0] = domTree('g', {
          path: {
            attr: {
              d: cfg.path,
              fill: 'none',
              'class': 'baseline'
            }
          }
        });
      } else {
        group[0] = domTree('g', {
          rect: {
            attr: {
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              mask: "url(#" + id.maskPath + ")",
              fill: cfg["fill-background"],
              'class': 'frame'
            }
          }
        });
      }
      svg.appendChild(group[0]);
      group[1] = domTree('g', {
        path: {
          attr: {
            d: cfg.path,
            'class': isStroke ? 'mainline' : 'solid',
            "clip-path": cfg.type === 'fill' ? "url(#" + id.clip + ")" : ''
          }
        }
      });
      svg.appendChild(group[1]);
      p0 = group[0].querySelector(isStroke ? 'path' : 'rect');
      p1 = group[1].querySelector('path');
      if (isStroke) {
        attrs(p1, {
          fill: 'none'
        });
      }
      pimg = svg.querySelector('pattern image');
      img = new Image();
      img.addEventListener('load', function(){
        var box, that;
        box = (that = cfg["pattern-size"])
          ? {
            width: +that,
            height: +that
          }
          : img.width && img.height
            ? {
              width: img.width,
              height: img.height
            }
            : {
              width: 300,
              height: 300
            };
        attrs(svg.querySelector('pattern'), {
          width: box.width,
          height: box.height
        });
        return attrs(pimg, {
          width: box.width,
          height: box.height
        });
      });
      if (/.+\..+|^data:/.exec(!isStroke
        ? cfg.fill
        : cfg.stroke)) {
        img.src = !isStroke
          ? cfg.fill
          : cfg.stroke;
        attr(pimg, 'xlink:href', img.src);
      }
      if (isStroke) {
        attrs(p0, {
          stroke: cfg["stroke-trail"],
          "stroke-width": cfg["stroke-trail-width"]
        });
        attrs(p1, {
          "stroke-width": cfg["stroke-width"],
          stroke: /.+\..+|^data:/.exec(cfg.stroke)
            ? "url(#" + id.pattern + ")"
            : cfg.stroke
        });
      } else if (cfg.fill) {
        attr(p1, 'fill', /.+\..+|^data:/.exec(cfg.fill)
          ? "url(#" + id.pattern + ")"
          : cfg.fill);
      }
      len = p1.getTotalLength();
      this.fit();
      this.inited = true;
    } else if (cfg.img) {
      size = cfg["img-size"]
        ? (ret = cfg["img-size"].split(','), {
          width: +ret[0],
          height: +ret[1]
        })
        : {
          width: 100,
          height: 100
        };
      group[0] = domTree('g', {
        rect: {
          attr: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            mask: "url(#" + id.mask + ")",
            fill: cfg["fill-background"]
          }
        }
      });
      attrs(svg.querySelector('mask image'), {
        width: size.width,
        height: size.height
      });
      group[1] = domTree('g', {
        image: {
          attr: {
            width: size.width,
            height: size.height,
            x: 0,
            y: 0,
            preserveAspectRatio: cfg["aspect-ratio"],
            "clip-path": cfg.type === 'fill' ? "url(#" + id.clip + ")" : '',
            "xlink:href": cfg.img,
            'class': 'solid'
          }
        }
      });
      img = new Image();
      img.addEventListener('load', function(){
        var size, v;
        if (!cfg["img-size"]) {
          if (img.width && img.height) {
            size = {
              width: img.width,
              height: img.height
            };
          } else {
            size = {
              width: 100,
              height: 100
            };
          }
        }
        attrs(svg.querySelector('mask image'), size);
        attrs(group[1].querySelector('image'), size);
        attrs(group[0].querySelector('rect'), size);
        this$.fit();
        v = this$.value;
        this$.value = undefined;
        this$.set(v, true);
        return this$.inited = true;
      });
      img.src = cfg.img;
      svg.appendChild(group[0]);
      svg.appendChild(group[1]);
    }
    attrs(svg, {
      width: '100%',
      height: '100%'
    });
    trans = {
      v: {
        src: 0,
        des: 0
      },
      t: {},
      ease: function(t, b, c, d){
        t = t / (d * 0.5);
        if (t < 1) {
          return c * 0.5 * t * t + b;
        }
        t = t - 1;
        return -c * 0.5 * (t * (t - 2) - 1) + b;
      },
      handler: function(t, ani){
        var ref$, min, max, prec, dv, dt, dur, v, p, node, style, box, dir;
        ani == null && (ani = true);
        if (this.t.src == null) {
          this.t.src = t;
        }
        ref$ = [cfg.min, cfg.max, 1 / cfg.precision], min = ref$[0], max = ref$[1], prec = ref$[2];
        ref$ = [this.v.des - this.v.src, (t - this.t.src) * 0.001, +cfg.duration || 1], dv = ref$[0], dt = ref$[1], dur = ref$[2];
        this.v.cur = v = ani
          ? this.ease(dt, this.v.src, dv, dur)
          : this.v.des;
        if (cfg.precision) {
          v = Math.round(v * prec) / prec;
        } else if (ani) {
          v = Math.round(v);
        }
        v = (ref$ = v < max ? v : max) > min ? ref$ : min;
        text.innerHTML = v + (cfg.unit ? "<span>" + cfg.unit + "</span>" : '');
        p = 100.0 * (v - min) / (max - min);
        if (isStroke) {
          node = p1;
          style = {
            "stroke-dasharray": cfg["stroke-dir"] === 'reverse'
              ? "0 " + len * (100 - p) * 0.01 + " " + len * p * 0.01 + " 0"
              : p * 0.01 * len + " " + ((100 - p) * 0.01 * len + 1)
          };
        } else {
          box = group[1].getBBox();
          dir = cfg["fill-dir"];
          style = import$({
            y: box.y,
            height: box.height,
            x: box.x,
            width: box.width
          }, dir === 'btt' || !dir
            ? {
              y: box.y + box.height * (100 - p) * 0.01,
              height: box.height * p * 0.01
            }
            : dir === 'rtl'
              ? {
                x: box.x + box.width * (100 - p) * 0.01,
                width: box.width * p * 0.01
              }
              : dir === 'ttb'
                ? {
                  height: box.height * p * 0.01
                }
                : dir === 'ltr' ? {
                  width: box.width * p * 0.01
                } : void 8);
          node = svg.querySelector('rect');
        }
        attrs(node, style);
        if (dt >= dur) {
          delete this.t.src;
          return false;
        }
        return true;
      },
      start: function(src, des, ani){
        var ref$, this$ = this;
        ref$ = this.v;
        ref$.src = src;
        ref$.des = des;
        if (!ani || !(root.offsetWidth || root.offsetHeight || root.getClientRects().length)) {
          this.t.src = 0;
          return this.handler(1000, false);
        } else {
          return raf.add(id.key, function(time){
            return this$.handler(time);
          });
        }
      }
    };
    this.set = function(v, ani){
      ani == null && (ani = true);
      return trans.start(trans.v.cur || trans.v.src || 0, v != null
        ? v
        : trans.v.des, ani);
    };
    this.set(+cfg.value || 0, cfg["transition-in"]) || false;
    return this;
  };
  window.addEventListener('load', function(){
    var i$, ref$, len$, n, results$ = [];
    for (i$ = 0, len$ = (ref$ = document.querySelectorAll('.ldBar')).length; i$ < len$; ++i$) {
      n = ref$[i$];
      if (!n.ldBar) {
        results$.push(new ldBar(n));
      }
    }
    return results$;
  }, false);
  if (typeof module != 'undefined' && module !== null) {
    module.exports = ldBar;
  }
  if (typeof window != 'undefined' && window !== null) {
    return window.ldBar = ldBar;
  }
})();
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
})();
