# Sumi look mechanics

Sumi is a compact, soft-bodied ink-brush bird. Her feet and lower belly remain anchored at the established baseline while her eyes lead, followed by a small head turn or pitch, a restrained upper-body lean, and gentle tail/wing follow-through. The red blossom is worn on her screen-right side and must remain attached, changing visibility naturally as the head turns rather than flipping sides.

Motion budget: each 22.5-degree step advances the pupils, beak direction, head pitch/yaw, and upper-body lean by a similar small amount. Body volume, cell scale, baseline, brush texture, and facial proportions remain stable. No whole-sprite rotation, shadows, detached effects, or replacement eyes.

- 000 up: eyes and beak aim upward; crown and upper face become more prominent; body stays front-readable.
- 090 screen-right: pupils and beak unmistakably cross toward screen-right; more of Sumi's screen-left cheek/body side is visible; flower stays attached and may become slightly more side-on.
- 180 down: eyes, beak, and head pitch downward; crown recedes and chest/upper belly becomes more prominent.
- 270 screen-left: pupils and beak unmistakably cross toward screen-left; more of Sumi's screen-right cheek/body side is visible; flower follows the head and may partly occlude against the crown.

Diagonals interpolate these pose families continuously. Wings and tail lag subtly while remaining attached; feet and lower-body registration do not slide.
