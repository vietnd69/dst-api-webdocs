---
title: "CameraShake"
description: "Camera shake system for creating visual feedback effects"
sidebar_position: 8
slug: /api-vanilla/core-systems/camerashake
last_updated: "2024-01-15"
build_version: "675312"
change_status: "stable"
---

# CameraShake System

The **CameraShake** system provides functionality for creating camera shake effects to enhance visual feedback during gameplay events such as explosions, impacts, earthquakes, and other dramatic moments.

## Overview

The CameraShake class creates smooth camera movement patterns using predefined shake directions and easing functions. It supports multiple shake modes (full, horizontal, vertical) and provides configurable duration, speed, and intensity parameters.

## Version History

| Version | Changes | Status |
|---------|---------|--------|
| 675312  | Current stable implementation | 🟢 **Stable** |
| Earlier | Initial implementation | - |

## Shake Modes

The system supports three primary shake modes defined in the `CAMERASHAKE` constants:

### CAMERASHAKE.FULL
Creates shake movement in all 8 directions around the camera center:
- **Directions**: Up, Down, Left, Right, and 4 diagonal directions
- **Use Case**: Explosions, major impacts, earthquakes
- **Pattern**: Circular shake pattern with maximum visual impact

### CAMERASHAKE.SIDE  
Creates horizontal-only shake movement:
- **Directions**: Left and Right only
- **Use Case**: Side impacts, lateral forces, character movement effects
- **Pattern**: Linear horizontal oscillation

### CAMERASHAKE.VERTICAL
Creates vertical-only shake movement:
- **Directions**: Up and Down only  
- **Use Case**: Landing impacts, vertical forces, building collapses
- **Pattern**: Linear vertical oscillation

## Class Constructor

```lua
CameraShake = Class(function(self, mode, duration, speed, scale)
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | number | `CAMERASHAKE.FULL` | Shake pattern mode (FULL/SIDE/VERTICAL) |
| `duration` | number | 1 | Total shake duration in seconds |
| `speed` | number | 0.05 | Speed of individual shake movements |
| `scale` | number | 1 | Intensity scaling factor |

## Methods

### StopShaking()
Immediately stops the current shake effect and resets all parameters.

```lua
function CameraShake:StopShaking()
```

**Usage:**
```lua
local shake = CameraShake(CAMERASHAKE.FULL, 2.0, 0.05, 1.5)
-- Later...
shake:StopShaking() -- Immediately stop shaking
```

### Update(dt)
Updates the shake effect and returns the current shake offset vector.

```lua
function CameraShake:Update(dt) -> Vector3
```

**Parameters:**
- `dt` (number): Delta time since last update

**Returns:**
- `Vector3`: Current shake offset, or nil if shake is complete

**Usage:**
```lua
local shake = CameraShake(CAMERASHAKE.FULL, 1.0, 0.05, 2.0)

-- In update loop
local shakeOffset = shake:Update(dt)
if shakeOffset then
    -- Apply shake offset to camera position
    camera.position = camera.basePosition + shakeOffset
end
```

## Implementation Details

### Shake Patterns

The system uses predefined direction vectors for each shake mode:

**FULL Mode (8 directions):**
```
    4
 7     1  
2   S   6
 5     3
    0
```

**SIDE Mode (2 directions):**
```
0   S   1
```

**VERTICAL Mode (2 directions):**
```
    0
    S  
    1
```

### Timing and Easing

The shake effect follows a three-phase timeline:

1. **Ramp-up Phase** (`0` to `speed`): Smooth transition from zero to first shake position
2. **Active Phase** (`speed` to `duration + speed`): Cyclic movement through shake pattern
3. **Ramp-down Phase** (`duration + speed` to `duration + 2*speed`): Smooth return to zero

The intensity scales linearly from full scale to zero over the duration using easing functions.

## Usage Examples

### Basic Explosion Effect
```lua
-- Create a strong, short explosion shake
local explosionShake = CameraShake(CAMERASHAKE.FULL, 0.8, 0.04, 3.0)

-- Update in game loop
local function UpdateCamera(dt)
    local offset = explosionShake:Update(dt)
    if offset then
        camera:ApplyShakeOffset(offset)
    end
end
```

### Earthquake Effect
```lua
-- Create a long, moderate earthquake shake
local earthquakeShake = CameraShake(CAMERASHAKE.FULL, 5.0, 0.08, 1.5)

-- Continuous update
while earthquakeActive do
    local offset = earthquakeShake:Update(dt)
    if offset then
        camera:ApplyShakeOffset(offset)
    else
        earthquakeActive = false -- Shake completed
    end
end
```

### Landing Impact
```lua
-- Create a vertical-only landing shake
local landingShake = CameraShake(CAMERASHAKE.VERTICAL, 0.3, 0.03, 2.0)

-- Quick impact effect
local function OnPlayerLanded()
    landingShake = CameraShake(CAMERASHAKE.VERTICAL, 0.3, 0.03, 2.0)
end
```

### Weapon Hit Feedback
```lua
-- Create a horizontal shake for weapon impacts
local hitShake = CameraShake(CAMERASHAKE.SIDE, 0.4, 0.04, 1.2)

-- Apply on weapon hit
local function OnWeaponHit()
    if hitShake then
        hitShake:StopShaking() -- Stop any existing shake
    end
    hitShake = CameraShake(CAMERASHAKE.SIDE, 0.4, 0.04, 1.2)
end
```

## Best Practices

### Performance Considerations
- **Reuse Objects**: Create shake instances as needed rather than keeping permanent references
- **Stop When Complete**: The Update method automatically stops when duration is exceeded
- **Check Return Value**: Always check if Update() returns a value before applying offset

### Visual Design Guidelines
- **Duration**: Keep most shakes under 1 second for best user experience
- **Scale**: Use scale values between 0.5-3.0 for realistic effects
- **Speed**: Faster speeds (0.02-0.04) for intense effects, slower (0.06-0.10) for subtle effects
- **Mode Selection**: Choose appropriate mode based on the cause of the shake

### Common Patterns
```lua
-- Standard explosion shake
CameraShake(CAMERASHAKE.FULL, 0.6, 0.04, 2.5)

-- Subtle ambient shake
CameraShake(CAMERASHAKE.FULL, 3.0, 0.08, 0.8)

-- Quick impact feedback
CameraShake(CAMERASHAKE.SIDE, 0.2, 0.03, 1.5)

-- Environmental rumble
CameraShake(CAMERASHAKE.VERTICAL, 1.5, 0.06, 1.0)
```

## Related Systems

- **[Camera System](../cameras/)**: Camera management and positioning
- **[Input System](../input/)**: Controller vibration integration
- **[Effects System](../effects/)**: Visual effect coordination
- **[Easing Functions](../util/easing.md)**: Mathematical easing for smooth animations

## Technical Notes

- **Coordinate System**: Uses normalized Vector3 directions for platform independence
- **Thread Safety**: Single-threaded design, not thread-safe
- **Memory Management**: Minimal allocation during runtime, safe for frequent use
- **Precision**: Uses floating-point calculations suitable for smooth visual effects

## Troubleshooting

### Shake Not Visible
- Verify camera system is applying the returned offset
- Check scale parameter is not too small
- Ensure Update() is being called with valid dt values

### Shake Too Intense/Subtle
- Adjust scale parameter (1.0 = baseline intensity)
- Modify speed for faster/slower oscillation
- Change shake mode for different movement patterns

### Performance Issues
- Avoid creating new CameraShake objects every frame
- Stop unused shake effects with StopShaking()
- Consider reducing update frequency for background effects
