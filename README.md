# SVGAnimations

A recreation of the Animations in [BallAnimations](https://github.com/kkysen/BallAnimation) 
using SVG instead of the Canvas API.

All the Canvas API calls were refactored into a new Canvas interface,
which I then implemented using both Canvas and SVG.
Now the SVG and Canvas implementations can be easily switched.
For example, by adding `?useSvg=false` to animation.html, the Canvas implementation will be used instead.