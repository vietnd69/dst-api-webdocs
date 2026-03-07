---
id: lavalight
title: Lavalight
description: A temporary ambient light source that emits heat and automatically extinguishes after a fixed duration.
tags: [fx, environment, heat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d320e734
system_scope: environment
---

# Lavalight

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavalight` is a short-lived environmental entity that functions as a decorative yet functional fire-like light source. It provides heat to nearby entities and visually mimics a campfire or bonfire using animations and sound. Once created, it automatically begins extinguishing after 3 seconds and removes itself from the world once the post-animation completes. It relies on the `firefx` component for visual/sound behavior and the `heater` component for heat generation, and is designed to be a one-use light source (e.g., for environmental storytelling or temporary illumination).

## Usage example
```lua
-- Spawn a lavalight at world position {x, y, z}
local light = SpawnPrefab("lavalight")
if light ~= nil then
    light.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `firefx`, `heater`  
**Tags:** Adds `NOCLICK` and `HASHEATER`.

## Properties
No public properties.

## Main functions
### `Extinguish(inst)`
*   **Description:** Triggers the extinguish sequence: calls `firefx:Extinguish()`, schedules removal on animation completion, and sets a backup removal task based on animation length.
*   **Parameters:** `inst` (Entity) — the lavalight entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the animation is missing; the backup task ensures eventual cleanup even if the entity is asleep.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` when the post-animation finishes.
- **Pushes:** None.

### Extinguish Scheduling
- A delayed task calls `inst.Remove` after `GetCurrentAnimationLength()` seconds as a failsafe.
- The `firefx:Extinguish()` call may trigger the `animover` event, which is used to schedule final removal.

### Heater Integration
- The `heater` component uses `heatfn`, set to the local `GetHeatFn`, which returns a temperature value (`heats[inst.components.firefx.level]`) based on the current fire level (50, 65, or 100 heat units for levels 1–3).

### FireFX Configuration
- Uses 3 predefined fire levels (`firelevels[1]` to `[3]`), mapped to small, medium, and large variants with distinct visuals and radii (2, 3, and 4).
- The `firefx` level is initialized to `3`, and `percent` is set to `1`, meaning full brightness/intensity.
- Sound, color, radius, intensity, and falloff are defined per-level in the `firelevels` table.

### Lifecycle Summary
1. Created with `Transform`, `AnimState`, `SoundEmitter`, and `Network`.
2. Added tags: `NOCLICK`, `HASHEATER`.
3. `firefx` and `heater` components are added on the master simulation.
4. Fire is set to level `3`, intensity `1`.
5. After 3 seconds, `Extinguish()` begins the fade-out.
6. When the `post_small` animation ends, the entity is removed.