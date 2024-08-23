<-(->it.apply {}) _

ld$.find(\.ldBar).map ->
  bar = new ldbar it, value: {a: Math.random!, b: 0}
  debounce 1500
    .then ->
      bar.set {a: 1, b: 0}
      debounce 200
    .then ->
      bar.pause!
      debounce 1000
    .then ->
      bar.unpause!
      debounce 1000
    .then ->
      bar.set {a: 1, b: 1}, {animate: false}
