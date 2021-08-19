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
