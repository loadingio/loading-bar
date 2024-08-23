lc = wm: new WeakMap!, count: 0

# raf - RequestAnimationFrame until nothing is in the queue.
raf =
  q: {} # q: queue, as a hash object, stores ldbar object via their id (_id)
  running: false # r: is raf running
  m: -> requestAnimationFrame (t) ~>
    for k,o of @q =>
      tbr = true
      for g,v of o.vs =>
        if !v.time? => v.time = t
        if v.paused == true and !v.paused-time => v.paused-time = t
        if v.paused => continue
        if v.paused-time =>
          v.time += (t - v.paused-time)
          delete v.paused-time
        v.progress = ((t - v.time) / (1000 * (v.dur or o.dur or 1))) <? 1
        v.cur = (v.des - v.src) * v.progress + v.src
        if v.progress < 1 or v.cur == v.des => tbr = false
      if tbr => delete @q[k]
      o.hdr!
    if [k for k of @q].length => @m! else @running = false
  add: (o) ->
    if @q[o._id] => return
    @q[o._id] = o._a
    if @running => return
    @running = true
    @m!

ldbar = (root, o = {}) ->
  if typeof(root) == \object and root.root => o = root else o.root = root
  @_root = root = if typeof(o.root) == \string => document.querySelector(o.root) else o.root
  @_id = "ldbar-#{Math.random!toString 36 .substring 2}-#{lc.count++}"
  if !lc.wm.get(root) => lc.wm.set(root, @) else return that
  root.classList.add \ldbar
  v = if !o.value? => {default: 0}
  else if typeof(o.value) == \number => {default: o.value}
  else if typeof(o.value) == \object => ({} <<< o.value)
  else {default: 0}
  # animation progress objects
  @_a =
    dur: 1
    vs: {}
    hdr: ~> @_root.textContent = (@_a.vs.default.cur).toFixed(2)
  @set v
  @

ldbar.prototype = Object.create(Object.prototype) <<<
  fit: ->
  pause: (o = true) -> for k,v of @_a.vs => v.paused = o
  unpause: -> @pause false; raf.add @
  end: -> for k,v of @_a.vs => v.src = v.cur = v.des
  set: (v, o = {}) ->
    if typeof(v) != \object => v = {default: if isNaN(v) => ((@_v or {}).default or 0) else v}
    @_v = (@_v or {}) <<< v
    for k,u of v =>
      if !@_a.vs[k] => @_a.vs[k] = {cur: 0, src: 0}
      ov = @_a.vs[k].des
      @_a.vs[k].des = u
      if o.animate? and !o.animate => @_a.vs[k].src = @_a.vs[k].cur = @_a.vs[k].des
      if ov == u => continue
      @_a.vs[k].src = @_a.vs[k].cur
      delete @_a.vs[k].time
    raf.add @

if module? => module.exports = ldbar
if window? => window.ldbar = window.ldBar = ldbar

# old code
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
