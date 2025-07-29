---
id: emitters
title: Emitters
description: Particle emitter management system and geometric emitter creation functions
sidebar_position: 3

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Emitters

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `emitters` module provides a comprehensive particle emitter management system for Don't Starve Together. It includes the `EmitterManager` for managing emitter lifecycles and various geometric emitter creation functions for generating particle positions in different shapes and patterns.

## Usage Example

```lua
-- Add an emitter with limited lifetime
EmitterManager:AddEmitter(emitterInst, 5.0, function()
    -- Update function called each frame
    emitterInst:SpawnParticle()
end)

-- Create a circular emitter pattern
local circleEmitter = CreateCircleEmitter(10)
local x, y = circleEmitter() -- Returns random position within circle
```

## EmitterManagerClass

### Constructor

**Description:**
Creates a new emitter manager instance that tracks awake and sleeping emitters with different lifetime categories.

**Internal Structure:**
```lua
{
    awakeEmitters = {
        limitedLifetimes = {},    -- Emitters with finite duration
        infiniteLifetimes = {}    -- Emitters with infinite duration
    },
    sleepingEmitters = {
        limitedLifetimes = {},    -- Hibernated limited emitters
        infiniteLifetimes = {}    -- Hibernated infinite emitters
    }
}
```

## EmitterManager Methods

### EmitterManager:AddEmitter(inst, lifetime, updateFunc) {#add-emitter}

**Status:** `stable`

**Description:**
Adds an emitter instance to the manager for automatic updating and lifetime management.

**Parameters:**
- `inst` (Entity): The emitter entity instance
- `lifetime` (number, optional): Duration in seconds. If nil, emitter has infinite lifetime
- `updateFunc` (function): Function called each frame to update the emitter

**Example:**
```lua
-- Limited lifetime emitter (5 seconds)
EmitterManager:AddEmitter(fireEmitter, 5.0, function()
    fireEmitter:EmitParticle("fire")
end)

-- Infinite lifetime emitter
EmitterManager:AddEmitter(ambientEmitter, nil, function()
    ambientEmitter:EmitParticle("dust")
end)
```

**Version History:**
- Current: Automatically listens for "onremove" event to clean up

### EmitterManager:RemoveEmitter(inst) {#remove-emitter}

**Status:** `stable`

**Description:**
Removes an emitter from all tracking tables in the manager.

**Parameters:**
- `inst` (Entity): The emitter entity instance to remove

**Example:**
```lua
-- Manually remove an emitter
EmitterManager:RemoveEmitter(myEmitter)
```

### EmitterManager:PostUpdate() {#post-update}

**Status:** `stable`

**Description:**
Updates all managed emitters. Called automatically by the game loop. Handles lifetime countdown and emitter cleanup.

**Behavior:**
- Skips update if server is paused or error widget is active
- Updates awake emitters with limited lifetimes
- Updates awake emitters with infinite lifetimes  
- Updates sleeping emitters (lifetime only, no update function)
- Removes emitters when lifetime reaches zero

**Example:**
```lua
-- Called automatically by game engine
-- EmitterManager:PostUpdate() -- Do not call manually
```

### EmitterManager:Hibernate(inst) {#hibernate}

**Status:** `stable`

**Description:**
Moves an emitter from awake state to sleeping state when entity goes to sleep.

**Parameters:**
- `inst` (Entity): The emitter entity instance to hibernate

**Example:**
```lua
-- Called automatically when entity sleeps
EmitterManager:Hibernate(dustEmitter)
```

### EmitterManager:Wake(inst) {#wake}

**Status:** `stable`

**Description:**
Moves an emitter from sleeping state to awake state when entity wakes up.

**Parameters:**
- `inst` (Entity): The emitter entity instance to wake

**Example:**
```lua
-- Called automatically when entity wakes
EmitterManager:Wake(dustEmitter)
```

## Global Instance

### EmitterManager

**Status:** `stable`

**Description:**
Global singleton instance of `EmitterManagerClass` used throughout the game for managing all emitters.

**Example:**
```lua
-- Access the global emitter manager
EmitterManager:AddEmitter(myEmitter, 3.0, updateFunction)
```

## Utility Functions

### UnitRand() {#unit-rand}

**Status:** `stable`

**Description:**
Generates a random number between -1.0 and 1.0.

**Returns:**
- (number): Random value in range [-1.0, 1.0]

**Example:**
```lua
local randomValue = UnitRand() -- Returns value between -1 and 1
```

## Emitter Creation Functions

### CreateDiscEmitter(radius) {#create-disc-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates random positions within a disc (filled circle) area.

**Parameters:**
- `radius` (number): Radius of the disc

**Returns:**
- (function): Emitter function that returns (x, y) coordinates

**Example:**
```lua
local discEmitter = CreateDiscEmitter(5.0)
local x, y = discEmitter() -- Random position within disc of radius 5
```

### CreateCircleEmitter(radius) {#create-circle-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates uniformly distributed random positions within a circle area using proper circular distribution.

**Parameters:**
- `radius` (number): Radius of the circle

**Returns:**
- (function): Emitter function that returns (x, y) coordinates

**Example:**
```lua
local circleEmitter = CreateCircleEmitter(8.0)
local x, y = circleEmitter() -- Uniformly distributed position in circle
```

**Implementation Notes:**
Uses square root distribution for uniform area coverage.

### CreateRingEmitter(radius) {#create-ring-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates random positions on the circumference of a circle (ring/perimeter only).

**Parameters:**
- `radius` (number): Radius of the ring

**Returns:**
- (function): Emitter function that returns (x, y) coordinates on circle edge

**Example:**
```lua
local ringEmitter = CreateRingEmitter(10.0)
local x, y = ringEmitter() -- Position exactly on circle circumference
```

### CreateSphereEmitter(radius) {#create-sphere-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates random positions on the surface of a sphere in 3D space.

**Parameters:**
- `radius` (number): Radius of the sphere

**Returns:**
- (function): Emitter function that returns (x, y, z) coordinates on sphere surface

**Example:**
```lua
local sphereEmitter = CreateSphereEmitter(6.0)
local x, y, z = sphereEmitter() -- Position on sphere surface
```

**Implementation Notes:**
Uses uniform spherical distribution algorithm for even surface coverage.

### CreateBoxEmitter(x_min, y_min, z_min, x_max, y_max, z_max) {#create-box-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates random positions within a 3D box volume.

**Parameters:**
- `x_min` (number): Minimum X coordinate
- `y_min` (number): Minimum Y coordinate  
- `z_min` (number): Minimum Z coordinate
- `x_max` (number): Maximum X coordinate
- `y_max` (number): Maximum Y coordinate
- `z_max` (number): Maximum Z coordinate

**Returns:**
- (function): Emitter function that returns (x, y, z) coordinates within box

**Example:**
```lua
local boxEmitter = CreateBoxEmitter(-5, -5, -5, 5, 5, 5)
local x, y, z = boxEmitter() -- Random position in 10x10x10 cube
```

**Implementation Notes:**
Current implementation uses UnitRand() which behaves more like center/halfwidth than true min/max.

### CreateAreaEmitter(polygon, centroid) {#create-area-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function that generates random positions within a polygonal area using triangle decomposition.

**Parameters:**
- `polygon` (table): Array of vertex coordinates as `{x, y}` pairs
- `centroid` (table): Center point as `{x, y}`

**Returns:**
- (function): Emitter function that returns (x, y) coordinates within polygon area

**Example:**
```lua
local polygon = {{0, 0}, {10, 0}, {5, 10}} -- Triangle
local centroid = {5, 3.33}
local areaEmitter = CreateAreaEmitter(polygon, centroid)
local x, y = areaEmitter() -- Position within triangle
```

**Implementation Notes:**
Uses triangulation from centroid and uniform sampling within triangles.

### Create2DTriEmitter(tris, scale) {#create-2d-tri-emitter}

**Status:** `stable`

**Description:**
Creates an emitter function for 2D triangle mesh emission with camera-relative positioning.

**Parameters:**
- `tris` (table): Array of triangles, each with vertices containing x, y coordinates
- `scale` (number): Scale factor for the emission area

**Returns:**
- (function): Emitter function that takes (camera_right, camera_up) and returns 3D coordinates

**Example:**
```lua
local triangles = {
    {{x = 0, y = 0}, {x = 1, y = 0}, {x = 0.5, y = 1}}
}
local triEmitter = Create2DTriEmitter(triangles, 2.0)

-- Usage with camera vectors
local x, y, z = triEmitter(cameraRight, cameraUp)
```

**Implementation Notes:**
Uses barycentric coordinates for uniform triangle sampling and projects to 3D space using camera vectors.

## Common Usage Patterns

### Particle Effect Management
```lua
-- Create a fire effect with limited duration
local fireEmitter = SpawnPrefab("fire_emitter")
EmitterManager:AddEmitter(fireEmitter, 10.0, function()
    fireEmitter:SpawnFireParticle()
end)
```

### Environmental Effects
```lua
-- Ambient dust particles in an area
local dustArea = CreateCircleEmitter(15.0)
EmitterManager:AddEmitter(dustEmitter, nil, function()
    local x, y = dustArea()
    dustEmitter:EmitParticleAt(x, y)
end)
```

### Impact Effects
```lua
-- Explosion debris in all directions
local explosionEmitter = CreateSphereEmitter(8.0)
for i = 1, 20 do
    local x, y, z = explosionEmitter()
    SpawnDebris(x, y, z)
end
```

### Area-Based Spawning
```lua
-- Spawn items within irregular area
local spawnArea = CreateAreaEmitter(areaPolygon, areaCentroid)
for i = 1, 5 do
    local x, y = spawnArea()
    SpawnPrefab("berry"):SetPosition(x, 0, y)
end
```

## Performance Considerations

### Emitter Lifecycle
- Use limited lifetime emitters when possible to prevent memory leaks
- Infinite lifetime emitters continue until manually removed or entity is destroyed
- Sleeping emitters have reduced overhead (no update function calls)

### Update Function Optimization
- Keep emitter update functions lightweight
- Avoid heavy calculations in frequently called update functions
- Consider using timers for less frequent emission patterns

### Memory Management
- Emitters are automatically cleaned up when their entities are removed
- Manual cleanup with `RemoveEmitter()` when emitters are no longer needed
- Manager handles hibernation/wake cycles automatically

## Related Modules

- [EntityScript](./entityscript.md): Entity lifecycle management for emitters
- [Scheduler](./scheduler.md): Alternative timing system for particle effects
- [Class](./class.md): Base class system used by EmitterManagerClass
- [Main Functions](./mainfunctions.md): Game loop where PostUpdate is called
