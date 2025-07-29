---
id: camerashake
title: CameraShake
description: Camera shake system for creating visual feedback effects during gameplay events
sidebar_position: 4

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# CameraShake

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `CameraShake` class provides functionality for creating camera shake effects to enhance visual feedback during gameplay events such as explosions, impacts, earthquakes, and other dramatic moments. The system uses predefined shake direction patterns with configurable timing and intensity parameters.

## Usage Example

```lua
-- Create a strong explosion shake effect
local explosionShake = CameraShake(CAMERASHAKE.FULL, 0.8, 0.04, 3.0)

-- Update in game loop
local shakeOffset = explosionShake:Update(dt)
if shakeOffset then
    -- Apply shake offset to camera position
    camera:ApplyShakeOffset(shakeOffset)
end
```

## Constructor

### CameraShake(mode, duration, speed, scale) {#constructor}

**Status:** `stable`

**Description:**
Creates a new camera shake instance with specified parameters.

**Parameters:**
- `mode` (number): Shake pattern mode (CAMERASHAKE.FULL/SIDE/VERTICAL)
- `duration` (number): Total shake duration in seconds (default: 1)
- `speed` (number): Speed of individual shake movements (default: 0.05)
- `scale` (number): Intensity scaling factor (default: 1)

**Returns:**
- (CameraShake): New camera shake instance

**Example:**
```lua
-- Full directional shake for explosion
local explosionShake = CameraShake(CAMERASHAKE.FULL, 0.6, 0.04, 2.5)

-- Horizontal shake for side impact
local sideShake = CameraShake(CAMERASHAKE.SIDE, 0.4, 0.03, 1.2)

-- Vertical shake for landing impact
local landingShake = CameraShake(CAMERASHAKE.VERTICAL, 0.3, 0.02, 1.8)
```

## Methods

### inst:StopShaking() {#stop-shaking}

**Status:** `stable`

**Description:**
Immediately stops the current shake effect and resets all internal parameters.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
local shake = CameraShake(CAMERASHAKE.FULL, 2.0, 0.05, 1.5)
-- Later, stop the shake immediately
shake:StopShaking()
```

### inst:Update(dt) {#update}

**Status:** `stable`

**Description:**
Updates the shake effect and returns the current shake offset vector. Returns nil when the shake effect is complete.

**Parameters:**
- `dt` (number): Delta time since last update in seconds

**Returns:**
- (Vector3 or nil): Current shake offset vector, or nil if shake is complete

**Example:**
```lua
local shake = CameraShake(CAMERASHAKE.FULL, 1.0, 0.05, 2.0)

-- In update loop
local shakeOffset = shake:Update(dt)
if shakeOffset then
    camera.position = camera.basePosition + shakeOffset
else
    -- Shake effect has completed
    shake = nil
end
```

## Constants

### CAMERASHAKE.FULL

**Value:** Constant defined in game engine

**Status:** `stable`

**Description:** Creates shake movement in all 8 directions around the camera center (up, down, left, right, and 4 diagonal directions). Used for explosions, major impacts, and earthquakes.

**Usage Pattern:**
```
    4
 7     1  
2   S   6
 5     3
    0
```

### CAMERASHAKE.SIDE

**Value:** Constant defined in game engine

**Status:** `stable`

**Description:** Creates horizontal-only shake movement (left and right). Used for side impacts, lateral forces, and character movement effects.

**Usage Pattern:**
```
0   S   1
```

### CAMERASHAKE.VERTICAL

**Value:** Constant defined in game engine

**Status:** `stable`

**Description:** Creates vertical-only shake movement (up and down). Used for landing impacts, vertical forces, and building collapses.

**Usage Pattern:**
```
    0
    S  
    1
```

## Implementation Details

### Shake Timing Phases

The shake effect follows a three-phase timeline:

1. **Ramp-up Phase** (0 to speed): Smooth transition from zero to first shake position
2. **Active Phase** (speed to duration + speed): Cyclic movement through shake pattern
3. **Ramp-down Phase** (duration + speed to duration + 2*speed): Smooth return to zero

### Direction Vectors

Each shake mode uses normalized Vector3 directions:

**FULL Mode (8 directions):**
- Vector3(0, -1), Vector3(1, 1), Vector3(-1, 0), Vector3(1, -1)
- Vector3(0, 1), Vector3(-1, -1), Vector3(1, 0), Vector3(-1, 1)

**SIDE Mode (2 directions):**
- Vector3(-1, 0), Vector3(1, 0)

**VERTICAL Mode (2 directions):**
- Vector3(0, 1), Vector3(0, -1)

## Common Usage Patterns

### Explosion Effects
```lua
-- Strong, short explosion shake
local explosionShake = CameraShake(CAMERASHAKE.FULL, 0.8, 0.04, 3.0)
```

### Earthquake Effects
```lua
-- Long, moderate earthquake shake
local earthquakeShake = CameraShake(CAMERASHAKE.FULL, 5.0, 0.08, 1.5)
```

### Impact Feedback
```lua
-- Quick vertical landing impact
local landingShake = CameraShake(CAMERASHAKE.VERTICAL, 0.3, 0.03, 2.0)

-- Horizontal weapon hit feedback
local hitShake = CameraShake(CAMERASHAKE.SIDE, 0.4, 0.04, 1.2)
```

### Ambient Environmental Effects
```lua
-- Subtle background rumble
local ambientShake = CameraShake(CAMERASHAKE.FULL, 3.0, 0.08, 0.8)
```

## Best Practices

### Parameter Guidelines
- **Duration**: Keep most shakes under 1 second for best user experience
- **Scale**: Use scale values between 0.5-3.0 for realistic effects
- **Speed**: Faster speeds (0.02-0.04) for intense effects, slower (0.06-0.10) for subtle effects
- **Mode Selection**: Choose appropriate mode based on the cause of the shake

### Performance Considerations
- Create shake instances as needed rather than keeping permanent references
- Always check if Update() returns a value before applying offset
- Stop unused shake effects with StopShaking() to free resources
- The Update method automatically stops when duration is exceeded

### Integration Tips
```lua
-- Proper integration pattern
local function ApplyCameraShake(shakeInstance, dt)
    if not shakeInstance then return end
    
    local offset = shakeInstance:Update(dt)
    if offset then
        -- Apply shake to camera
        TheCamera:ApplyShake(offset)
    else
        -- Shake completed, clean up reference
        shakeInstance = nil
    end
end
```

## Related Modules

- [Easing](./easing.md): Mathematical easing functions used for smooth shake transitions
- [Input System](./input.md): Controller vibration integration
- [Vector3](./vector3.md): 3D vector mathematics for shake calculations
