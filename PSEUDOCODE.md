# Pseudocode of the key ideas

Plain-language sketches, not the real implementation.

## 1. One clock
```
on every GSAP tick(time):
    lenis.update(time)            # smooth scroll position
    ScrollTrigger.update()        # scroll-driven timelines read it
    renderer.advance(time)        # 3D frame, manual stepping
# nothing else runs its own requestAnimationFrame
```

## 2. Bottles follow the page
```
for each placeholder element on the page:
    register (element, bottle, pose-function)

every frame:
    for each registered item that is on screen:
        rect = element.measure()
        bottle.position = screen_to_world(rect.center)
        bottle.scale    = rect.height * k
        bottle.rotation = pose-function(progress)
```
Off-screen items are skipped (an IntersectionObserver flag).

## 3. Diagonal arc carousel
```
position(i, u):               # u = continuous carousel offset
    d  = i - u
    x  = d * spacing
    y  = d * rise + small_bow(d)       # linear rise -> bottom-left to top-right
    scale = falloff(|d|)
    opacity = fade_outside(range)
```

## 4. Seamless hand-off to the product page
```
on click(bottle b):
    start = current carousel pose of b
    target = product hero pose
    tween blend from start to target       # same function used by both pages
    others: tween fall-away
    route.push(product)  # early, so the next page is ready when the tween ends
```

## 5. Scroll story progress
```
progress s in [0,1] across the story section:
    bottle.rotation_y = full_turn(s) + sway(s)
    title.burst(s)                  # letters move apart in 3D
    words.flip_up(s)                # staggered
    marquee.lean = scroll_velocity * k
```

## 6. Draggable ring with momentum
```
on pointer down: stop auto-motion, record x
on pointer move: offset += dx * sensitivity; velocity = smoothed dx
on pointer up:   if moved > threshold: block the click
                 glide: offset += velocity; velocity *= friction until ~0
hover: pause auto-rotation
```

## 7. Mist
```
particles in a GPU buffer
on press (or idle timer): emit burst at the nozzle with random velocity/noise
each frame: advect with curl-like noise, grow, fade
when "fill ring" reaches 100%: spawn bloom that covers screen in cream, then fade out to reveal the site
```

## 8. Fast first load
```
behind the preloader:
    compile all shader variants (on-screen AND refraction pass) using parallel shader compile
    upload textures a few per frame
    decode images off the main thread
    do not start rendering the main scene until ready
phones: smaller textures, lower pixel ratio, half-res refraction
```

## 9. Bottle always on top
```
z-order: backgrounds/photos  <  DOM text  <  WebGL canvas
side lanes hold photos so they don't overlap the bottle's path
```
