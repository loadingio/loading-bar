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
