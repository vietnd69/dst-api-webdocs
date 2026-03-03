---
id: stretcher
title: Stretcher
description: Dynamically scales an entity along its facing axis to match the distance to a target entity, commonly used for stretchy visual effects like slingshots or elastic attachments.
tags: [visual, animation, entity, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d03207dc
system_scope: entity
---

# Stretcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Stretcher` component enables runtime dynamic scaling of an entity's visual representation based on the distance to a target entity. It continuously updates the entity's scale and orientation to stretch toward the target, making it ideal for elastic or tethered visual effects (e.g., Abigail's flower stalk, slingshot bands). The component is not active unless a stretch target is set, and it automatically pauses when its owning entity goes to sleep or loses its target.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stretcher")
inst.components.stretcher:SetRestingLength(2)
inst.components.stretcher:SetWidthRatio(0.5)
inst.components.stretcher:SetStretchTarget(target_entity)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` or `nil` | `nil` | The entity toward which this component stretches. |
| `restinglength` | number | `1` | The distance at which the entity appears at its base scale (scale = 1 along length, width scale = 1). |
| `widthratio` | number | `1` | Controls how much the width scales relative to the stretch ratio. |

## Main functions
### `SetRestingLength(length)`
*   **Description:** Sets the distance (in units) at which the entity is considered "neutral" — i.e., the scale is exactly `1` along the stretch axis and `1` along the width axis.
*   **Parameters:** `length` (number) — the resting distance in world units.
*   **Returns:** Nothing.

### `SetWidthRatio(ratio)`
*   **Description:** Configures how the width (perpendicular to the stretch axis) scales as the entity stretches.
    *   If `ratio = 1`, width scales proportionally to length (isotropic scaling).
    *   If `ratio < 1`, the entity becomes thinner as it stretches (e.g., a rope).
    *   If `ratio > 1`, the entity becomes thicker as it stretches.
*   **Parameters:** `ratio` (number) — scaling factor for width relative to stretch.
*   **Returns:** Nothing.

### `SetStretchTarget(inst)`
*   **Description:** Assigns a new stretch target. If a valid target is provided, starts the update loop and performs an immediate scale/orientation update. If `nil`, stops all updates.
*   **Parameters:** `inst` (`Entity` or `nil`) — the entity to stretch toward. May be `nil`.
*   **Returns:** Nothing.
*   **Error states:** If `inst` is passed but becomes invalid (e.g., destroyed), the component detects this on the next `OnUpdate` call and automatically clears the target.

### `OnUpdate(dt)`
*   **Description:** Computes the vector from the owning entity to the target, rotates the entity to face the target, and scales it. Length scale is `distance / restinglength`; width scale is `1 + widthratio * (scale - 1)`.
*   **Parameters:** `dt` (number) — delta time since last update (unused, but required by ECS).
*   **Returns:** Nothing.
*   **Error states:** Early-exits with no change if `target` is `nil` or invalid. Clears the target if the target entity is no longer valid.

### `OnEntitySleep()`
*   **Description:** Called automatically when the owning entity enters the "sleep" state (e.g., during chunk unloading or culling). Stops component updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Called automatically when the owning entity wakes up. Restarts updates only if a valid target is set.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
(No events are explicitly fired or subscribed to by this component.)

```lua
local Stretcher = Class(function(self, inst)
    self.inst = inst
    self.target = nil
    self.restinglength = 1
    self.widthratio = 1
end)

function Stretcher:SetRestingLength(length)
    self.restinglength = length
end

function Stretcher:SetWidthRatio(ratio)
    self.widthratio = ratio
end

function Stretcher:SetStretchTarget(inst)
    self.target = inst
    if self.target then
        self.inst:StartUpdatingComponent(self)
        self:OnUpdate(0)
    else
        self.inst:StopUpdatingComponent(self)
    end
end

function Stretcher:OnEntitySleep()
    self.inst:StopUpdatingComponent(self)
end

function Stretcher:OnEntityWake()
    if self.target then
        self.inst:StartUpdatingComponent(self)
    else
        self.inst:StopUpdatingComponent(self)
    end
end

function Stretcher:OnUpdate(dt)
    if not self.target or not self.target:IsValid() then
        self:SetStretchTarget(nil)
        return
    end

    local targetpos = Vector3(self.target.Transform:GetWorldPosition())
    local mypos = Vector3(self.inst.Transform:GetWorldPosition())
    local diff = targetpos - mypos

    self.inst:FacePoint(targetpos)
    local scale = diff:Length() / self.restinglength
    local widthscale = 1 + self.widthratio * (scale - 1)
    self.inst.AnimState:SetScale(scale, widthscale)
end

return Stretcher
