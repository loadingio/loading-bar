var x$;
x$ = angular.module('loadingio', []);
x$.directive('ldbar', ['$compile', '$timeout'].concat(function($compile, $timeout){
  return {
    restrict: 'A',
    scope: {
      model: '=ngModel',
      config: '=config'
    },
    link: function(s, e, a, c){
      var bar;
      if (e[0]) {
        bar = !e[0].ldBar
          ? new ldBar(e[0], s.config || {})
          : e[0].ldBar;
      }
      return s.$watch('model', function(n, o){
        return bar.set(n);
      });
    }
  };
}));