---
id: thefocalpoint
title: TheFocalPoint
sidebar_position: 11
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# TheFocalPoint

TheFocalPoint is the global object that controls the camera's focal point in Don't Starve Together. It manages camera position, tracking, zooming, and other camera-related functionality on the client side.

## Basic Usage

```lua
-- Get current camera target
local target = TheFocalPoint.target

-- Check if camera is currently tracking an entity
local is_tracking = TheFocalPoint.tracking

-- Get camera position in world coordinates
local x, y, z = TheFocalPoint:GetPosition():Get()

-- Get current zoom level
local zoom = TheFocalPoint:GetZoom()
```

## Camera Positioning

```lua
-- Set camera position directly
TheFocalPoint:SetPosition(x, y, z)

-- Apply an offset to the camera position
TheFocalPoint:ApplyOffset(x_offset, z_offset)

-- Gradually move camera to a position
TheFocalPoint:PanTo(point, time)

-- Snap camera to a position instantly
TheFocalPoint:Snap(point)

-- Return camera to default position
TheFocalPoint:ClearOffset()
```

## Entity Tracking

```lua
-- Start tracking an entity with the camera
TheFocalPoint:SetTarget(entity)

-- Stop tracking and freeze at current position
TheFocalPoint:StopTracking()

-- Check if currently following a target
local is_following = TheFocalPoint:IsFollowing()

-- Get the current target entity
local target = TheFocalPoint:GetTarget()
```

## Zoom Control

```lua
-- Set zoom level (smaller numbers = more zoomed in)
TheFocalPoint:SetZoom(zoom_level) -- Typically between 20-35

-- Set minimum and maximum zoom
TheFocalPoint:SetMinZoom(min)
TheFocalPoint:SetMaxZoom(max)

-- Zooming over time
TheFocalPoint:ZoomTo(zoom_level, time)

-- Reset zoom to default level
TheFocalPoint:ResetZoom()
```

## Camera Effects

```lua
-- Shake the camera
TheFocalPoint:Shake(shakeType, duration, speed, scale)

-- Add a screenshake effect
TheFocalPoint:StartScreenShake(intensity, duration, speed, scale)

-- Stop all camera shake effects
TheFocalPoint:StopScreenShake()

-- Push/pull effect - quick zoom in and out
TheFocalPoint:PushPull(push_amount, duration)

-- Flash the screen
TheFocalPoint:Flash(intensity, duration, fade_in_time, fade_out_time)
```

## Camera Constraints

```lua
-- Set camera movement boundaries
TheFocalPoint:SetConstraints(min_x, max_x, min_z, max_z)

-- Clear camera constraints
TheFocalPoint:ClearConstraints()

-- Check if camera is currently constrained
local constrained = TheFocalPoint:IsConstrained()
```

## Multiple View Support

```lua
-- Create a secondary camera view
TheFocalPoint:StartSecondaryView(render_target, position, zoom)

-- Update secondary view position
TheFocalPoint:UpdateSecondaryView(render_target, position)

-- Stop a secondary camera view
TheFocalPoint:StopSecondaryView(render_target)
```

## Important Considerations

1. **Client-Side Only**: TheFocalPoint functions only work on the client, not on dedicated servers
2. **Player Focus**: By default, the camera focuses on ThePlayer in normal gameplay
3. **Performance Impact**: Complex camera movements can impact performance for players with lower-end hardware
4. **Multiplayer Considerations**: Camera changes are local to each client - other players won't see your camera effects
5. **UI Integration**: Camera positioning should take UI elements into account to avoid obscuring important information

## Integration with Other Global Objects

TheFocalPoint often works with other global objects:

- **[ThePlayer](/docs/api-vanilla/global-objects/theplayer)**: For player-centered camera tracking
- **[TheInput](/docs/api-vanilla/global-objects/theinput)**: For processing input that affects camera control
- **[TheFrontEnd](/docs/api-vanilla/global-objects/thefrontend)**: For coordinating camera effects with UI changes

## Common Use Cases

- **Cutscenes**: Creating cinematic sequences for storytelling
- **Focus Effects**: Drawing player attention to important events
- **Camera Controls**: Implementing custom camera control schemes
- **Visual Feedback**: Using camera effects to reinforce gameplay moments
- **Alternative Perspectives**: Showing different views of the game world 
