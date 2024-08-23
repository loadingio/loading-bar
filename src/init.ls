# legacy support for automatically initialization
window.addEventListener \load, (->
  for n in document.querySelectorAll(\.ldBar) => if !lc.wm.get(n) => new ldbar n
), false

