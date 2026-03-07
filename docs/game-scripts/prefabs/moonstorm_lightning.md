---
id: moonstorm_lightning
title: Moonstorm Lightning
description: Instantiates a transient visual and audio effect for a lightning strike, triggers screen flash and camera shake for nearby players, and spawns charged moon glass near any existing moonstorm_glass entities.
tags: [fx, environment, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e63fac5
system_scope: fx
---

# Moonstorm Lightning

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonstorm_lightning` prefab creates a short-lived lightning strike effect. It is instantiated at a specific world position and serves as a localized visual and audio cue for a lightning event. It does not persist in the world and only runs on the client when not dedicated, while the master simulation handles player-impacting effects (screen flash, camera shake) and item spawning. It interacts with the `lootdropper` component of nearby `moonstorm_glass` entities to fling `moonglass_charged` prefabs.

## Usage example
This prefab is typically spawned internally during storm events via `SpawnPrefab("moonstorm_lightning")` at the strike location. Modders may use it similarly in response to custom weather logic:

```lua
local strike = SpawnPrefab("moonstorm_lightning")
if strike ~= nil then
    strike.Transform:SetPosition(target_position)
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `SoundEmitter`, `lootdropper` (via external call on other prefabs)
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
This is a prefab constructor (`fn`) and not a component, so it does not define reusable methods. Its behavior is encapsulated in local helper functions invoked during instantiation:

### `PlayThunderSound(lighting)`
* **Description:** Plays a positionally attenuated thunder sound for the local player, adjusting volume and effective source position based on distance.
* **Parameters:** `lighting` (Entity) — the lightning strike entity whose position is used to calculate sound attenuation.
* **Returns:** Nothing.
* **Error states:** Early exit if `lighting` is invalid or `TheFocalPoint` (player camera) is nil.

### `StartFX(inst)`
* **Description:** Triggers screen flash and camera shake effects for all players based on proximity to the lightning.
* **Parameters:** `inst` (Entity) — the lightning strike entity.
* **Returns:** Nothing.

### `spawnglass(inst)`
* **Description:** Attempts to spawn `moonglass_charged` near any existing `moonstorm_glass` entities within 4 units; if none found, spawns `moonstorm_glass` at the lightning's position.
* **Parameters:** `inst` (Entity) — the lightning strike entity.
* **Returns:** Nothing.

### `fn()`
* **Description:** Prefab constructor. Initializes the entity, sets up animation, sound, tags, and schedules cleanup and FX tasks.
* **Parameters:** None.
* **Returns:** The constructed entity (prefab instance).
* **Error states:** Returns early on non-master clients (`TheWorld.ismastersim == false`) after client-side setup; the master sim continues to schedule FX and cleanup.

## Events & listeners
None identified — this prefab does not register or dispatch custom events.