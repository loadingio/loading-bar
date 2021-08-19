safari bug: svg height set incorrectly proportional to container's padding.

 * add config: data-unit
   - data-unit by default is null. After pseudo element with content "%" will be shown.
   - if data-unit is specified, add "no-percent" class to remove the pseudo element; unit will be added into ldBar-label element wrapped with span element.
  
 * fix box calculation
   - Behavior of Safari and Chrome about getBBox of Path with Move Command are not the same.
   - We used a small hack with Path Move Command to prevent 0 height issue, which is not reliable in Safari.
   - now we remove the hack, and force adding stroke-width to size of stroke-type bar .

## Notes

defs:
 - baseline: gray,muted baseline showing the whole track of progressbar. `<path class="baseline">`
 - mainline: main progress bar used to show progress for stroke type. `<path class="mainline">`
 - solid: main progress bar, fill type. `<path class="solid">`
