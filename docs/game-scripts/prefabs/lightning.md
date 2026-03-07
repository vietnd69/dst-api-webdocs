---
id: lightning
title: Lightning
description: Spawns a temporary visual and audio effect for lightning strikes, including screen flash and camera shake for nearby players.
tags: [fx, weather, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5af6e014
system_scope: fx
---

# Lightning

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightning` prefab creates a short-lived entity that plays a lightning strike animation, emits thunder sound with distance-based intensity, and triggers screen flash and camera shake effects for all nearby players. It is typically used to simulate thunderstorm weather events. Two prefabs are exported: `lightning` (includes animation) and `thunder` (audio-only variant without animation state).

## Usage example
```lua
local lightning = CreateEntity()
lightning.entity:AddTransform()
lightning.Transform:SetPosition(10, 0, -5)
lightning:DoTaskInTime(0, function() end) -- placeholder, prefab handles setup
-- Use the actual prefabs instead:
local inst = Prefab("lightning"):Spawn(10, 0, -5)
inst:Remove() -- cleaned up automatically after 0.5 seconds
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `soundemitter`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `PlayThunderSound(lighting)`
*   **Description:** Calculates distance from the player(s) to the lightning entity and plays a thunder sound with volume and spatial positioning adjusted accordingly.
*   **Parameters:** `lighting` (Entity) — the lightning entity whose position is used for sound origin.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `lighting` is invalid or `TheFocalPoint` is `nil`.

### `StartFX(inst)`
*   **Description:** Iterates through all players, computes distance-based intensity, and triggers screen flash and camera shake effects.
*   **Parameters:** `inst` (Entity) — the lightning entity providing the source position.
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Constructor for the `lightning` prefab. Sets up animation, sound, network, and transforms; spawns thunder sound and FX; schedules cleanup.
*   **Parameters:** None.
*   **Returns:** Entity — the fully configured lightning entity.

### `thunderfn()`
*   **Description:** Constructor for the `thunder` prefab. Same behavior as `fn` but without `animstate`, to serve as a lightweight alternative when animation is not needed.
*   **Parameters:** None.
*   **Returns:** Entity — the configuration entity.

## Events & listeners
- **Pushes:** None explicitly — cleanup via `inst:DoTaskInTime(.5, inst.Remove)` internally removes the entity.
- **Listens to:** None — no `inst:ListenForEvent` calls present.