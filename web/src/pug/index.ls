<-(->it.apply {}) _

ld$.find(\.ldBar).map ->
  console.log it
  bar = new ldbar it, value: Math.random!
  debounce 1500
    .then ->
      bar.set Math.random!
      debounce 500
    .then -> bar.set Math.random!, {animate: false}
