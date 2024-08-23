<-(->it.apply {}) _

ld$.find(\.ldBar).map ->
  console.log it
  bar = new ldbar it, value: Math.random!
  debounce 1500
    .then ->
      bar.set 1
      debounce 200
    .then ->
      bar.pause!
      debounce 1000
    .then ->
      bar.unpause!
      #bar.set Math.random!, {animate: false}
