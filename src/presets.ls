export presets =
    rainbow:
        "type": 'stroke'
        "path": 'M10 10L90 10'
        "stroke": 'data:ldbar/res,gradient(0,1,#a551df,#fd51ad,#ff7f82,#ffb874,#ffeb90)'
        "bbox": "10 10 80 10"
    energy:
        "type": 'fill'
        "path": 'M15 5L85 5A5 5 0 0 1 85 15L15 15A5 5 0 0 1 15 5'
        "stroke": \#f00
        "fill": 'data:ldbar/res,gradient(45,2,#4e9,#8fb,#4e9)'
        "fill-dir": "ltr"
        "fill-background": \#444
        "fill-background-extrude": 1
        "bbox": "10 5 80 10"
    stripe:
        "type": 'fill'
        "path": 'M15 5L85 5A5 5 0 0 1 85 15L15 15A5 5 0 0 1 15 5'
        "stroke": \#f00
        "fill": 'data:ldbar/res,stripe(#25b,#58e,1)'
        "fill-dir": "ltr"
        "fill-background": \#ddd
        "fill-background-extrude": 1
        "bbox": "10 5 80 10"
    text:
        "type": 'fill'
        "img": """data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="20" viewBox="0 0 70 20"><text x="35" y="10" text-anchor="middle" dominant-baseline="central" font-family="arial">LOADING</text></svg>"""
        "fill-background-extrude": 1.3
        "pattern-size": 100
        "fill-dir": "ltr"
        "img-size": "70,20"
        "bbox": "0 0 70 20"
    line:
        "type": 'stroke'
        "path": 'M10 10L90 10'
        "stroke": \#25b
        "stroke-width": 3
        "stroke-trail": \#ddd
        "stroke-trail-width": 1
        "bbox": "10 10 80 10"
    fan:
        "type": 'stroke'
        "path": 'M10 90A40 40 0 0 1 90 90'
        "fill-dir": \btt
        "fill": \#25b
        "fill-background": \#ddd
        "fill-background-extrude": 3
        "stroke-dir": \normal
        "stroke": \#25b
        "stroke-width": \3
        "stroke-trail": \#ddd
        "stroke-trail-width": 0.5
        "bbox": "10 50 80 40"
    circle:
        "type": 'stroke'
        "path": 'M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10'
        "fill-dir": \btt
        "fill": \#25b
        "fill-background": \#ddd
        "fill-background-extrude": 3
        "stroke-dir": \normal
        "stroke": \#25b
        "stroke-width": \3
        "stroke-trail": \#ddd
        "stroke-trail-width": 0.5
        "bbox": "10 10 80 80"
    bubble:
        "type": 'fill'
        "path": 'M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10'
        "fill-dir": \btt
        "fill": 'data:ldbar/res,bubble(#39d,#cef)'
        "pattern-size": "150"
        "fill-background": \#ddd
        "fill-background-extrude": 2
        "stroke-dir": \normal
        "stroke": \#25b
        "stroke-width": \3
        "stroke-trail": \#ddd
        "stroke-trail-width": 0.5
        "bbox": "10 10 80 80"
