angular.module \loadingio, []
  ..directive \ldbar, <[$compile $timeout]> ++ ($compile, $timeout) -> do
    restrict: \A
    scope: do
      model: \=ngModel
      config: \=config
    link: (s,e,a,c) ->
      if e.0 => bar = if !e.0.ldBar => new ldBar(e.0, s.config or {}) else e.0.ldBar
      s.$watch 'model', (n,o) -> bar.set n

