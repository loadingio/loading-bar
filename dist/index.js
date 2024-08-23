(function(){
var defcfg;
defcfg = {
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
var presets;
presets = {
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
var wrap, make;
wrap = function(v){
  return "data:image/svg+xml;base64," + btoa(v);
};
make = {
  head: function(vb){
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"" + vb + "\">";
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
    ret = "" + this.head('0 0 100 100') + "\n<rect fill=\"" + c2 + "\" width=\"100\" height=\"100\"/>\n<g>\n<g>" + p + "</g>\n<animateTransform attributeName=\"transform\" type=\"translate\"\nfrom=\"0,0\" to=\"20,0\" dur=\"" + dur + "s\" repeatCount=\"indefinite\"/>\n</g></svg>";
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
var xmlns, utils;
xmlns = {
  xlink: 'http://www.w3.org/1999/xlink',
  svg: 'http://www.w3.org/2000/svg'
};
utils = {
  attrs: function(n, o){
    var k, v, results$ = [];
    o == null && (o = {});
    for (k in o) {
      v = o[k];
      results$.push(n.setAttribute(k, v));
    }
    return results$;
  },
  parseRes: function(v){
    var r;
    if (!(r = /data:ldbar\/res,([^()]+)\(([^)]+)\)/.exec(v))) {
      return v;
    }
    return make[r[1]].apply(make, r[2].split(','));
  },
  dom: function(n, o){
    var k, v;
    n = document.createElementNS(xmlns.svg, n);
    for (k in o) {
      v = o[k];
      if (k !== 'attr') {
        n.appendChild(utils.dom(k, v || {}));
      }
    }
    utils.attrs(n, o.attr);
    return n;
  },
  basedom: function(){
    var id, cfg;
    id = this.id, cfg = this.cfg;
    return {
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
              values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0',
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
              id: id.maskpath
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
  }
};
var lc, raf, ldbar, ref$;
lc = {
  wm: new WeakMap(),
  count: 0
};
raf = {
  q: {},
  running: false,
  m: function(){
    var this$ = this;
    return requestAnimationFrame(function(t){
      var k, ref$, o, tbr, g, ref1$, v, ref2$;
      for (k in ref$ = this$.q) {
        o = ref$[k];
        tbr = true;
        for (g in ref1$ = o.vs) {
          v = ref1$[g];
          if (v.time == null) {
            v.time = t;
          }
          if (v.paused === true && !v.pausedTime) {
            v.pausedTime = t;
          }
          if (v.paused) {
            continue;
          }
          if (v.pausedTime) {
            v.time += t - v.pausedTime;
            delete v.pausedTime;
          }
          v.progress = (ref2$ = (t - v.time) / (1000 * (v.dur || o.dur || 1))) < 1 ? ref2$ : 1;
          v.cur = (v.des - v.src) * v.progress + v.src;
          if (v.progress < 1 || v.cur === v.des) {
            tbr = false;
          }
        }
        if (tbr) {
          delete this$.q[k];
        }
        o.hdr();
      }
      if ((function(){
        var results$ = [];
        for (k in this.q) {
          results$.push(k);
        }
        return results$;
      }.call(this$)).length) {
        return this$.m();
      } else {
        return this$.running = false;
      }
    });
  },
  add: function(o){
    if (this.q[o._id]) {
      return;
    }
    this.q[o._id] = o._a;
    if (this.running) {
      return;
    }
    this.running = true;
    return this.m();
  }
};
ldbar = function(root, o){
  var v, this$ = this;
  o == null && (o = {});
  if (typeof root === 'object' && root.root) {
    o = root;
  } else {
    o.root = root;
  }
  this._root = root = typeof o.root === 'string'
    ? document.querySelector(o.root)
    : o.root;
  this._id = "ldbar-" + Math.random().toString(36).substring(2) + "-" + (lc.count++);
  if (!lc.wm.get(root)) {
    lc.wm.set(root, this);
  } else {
    return that;
  }
  root.classList.add('ldbar');
  v = o.value == null
    ? {
      'default': 0
    }
    : typeof o.value === 'number'
      ? {
        'default': o.value
      }
      : typeof o.value === 'object'
        ? import$({}, o.value)
        : {
          'default': 0
        };
  this._a = {
    dur: 1,
    vs: {},
    hdr: function(){
      return this$._root.textContent = this$._a.vs.a.cur.toFixed(2) + " / " + this$._a.vs.b.cur.toFixed(2);
    }
  };
  this.set(v);
  return this;
};
ldbar.prototype = (ref$ = Object.create(Object.prototype), ref$.fit = function(){}, ref$.pause = function(o){
  var k, ref$, v, results$ = [];
  o == null && (o = true);
  for (k in ref$ = this._a.vs) {
    v = ref$[k];
    results$.push(v.paused = o);
  }
  return results$;
}, ref$.unpause = function(){
  this.pause(false);
  return raf.add(this);
}, ref$.end = function(){
  var k, ref$, v, results$ = [];
  for (k in ref$ = this._a.vs) {
    v = ref$[k];
    results$.push(v.src = v.cur = v.des);
  }
  return results$;
}, ref$.set = function(v, o){
  var k, u, ov;
  o == null && (o = {});
  if (typeof v !== 'object') {
    v = {
      'default': isNaN(v) ? (this._v || {})['default'] || 0 : v
    };
  }
  this._v = import$(this._v || {}, v);
  for (k in v) {
    u = v[k];
    if (!this._a.vs[k]) {
      this._a.vs[k] = {
        cur: 0,
        src: 0
      };
    }
    ov = this._a.vs[k].des;
    this._a.vs[k].des = u;
    if (o.animate != null && !o.animate) {
      this._a.vs[k].src = this._a.vs[k].cur = this._a.vs[k].des;
    }
    if (ov === u) {
      continue;
    }
    this._a.vs[k].src = this._a.vs[k].cur;
    delete this._a.vs[k].time;
  }
  return raf.add(this);
}, ref$);
if (typeof module != 'undefined' && module !== null) {
  module.exports = ldbar;
}
if (typeof window != 'undefined' && window !== null) {
  window.ldbar = window.ldBar = ldbar;
}
/*
@id = Object.fromEntries <[key clip filter pattern mask maskpath]>.map (n) -> [n, "#{id}-#n"]
# config priority: attr in js opt > data-attr > attr in preset > default value
@cfg = cfg = {} <<< defcfg
if (cfg.preset = root.dataset.preset or opt.preset)? => cfg <<< presets[cfg.preset]
for a of cfg => if root.dataset[a]? => cfg[a] = root.dataset[a]
cfg <<< opt
# normalize configs
if cfg.img => cfg.path = null
cfg.fill = utils.parse-res cfg.fill
cfg.stroke = utils.parse-res cfg.stroke
if cfg["set-dim"] == \false => cfg["set-dim"] = false
is-stroke = cfg.type == \stroke
if cfg.unit => root.classList.add \no-percent # no CSS unit if cfg.unit is defined.
root.appendChild utils.dom(\svg, utils.basedom.apply(@))
root.appendChild(text = document.createElement \div)
text.setAttribute \class, \ldbar-label
*/
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
}());
