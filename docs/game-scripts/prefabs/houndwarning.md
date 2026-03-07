---
id: houndwarning
title: Houndwarning
description: Generates a temporary visual warning effect entity that plays a distant hound sound at a specific radius before removing itself.
tags: [fx, audio, hound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 99f8e387
system_scope: fx
---

# Houndwarning

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`houndwarning` is a lightweight prefab factory used to spawn temporary visual/audio warning entities in the world. These entities are positioned at a fixed distance from the player or focal point and play a distant hound sound (`dontstarve/creatures/hound/distant`) before immediately self-destructing. The prefabs are created in four levels, each corresponding to different warning radii (`SPAWN_DIST + 30`, `+20`, `+10`, and `SPAWN_DIST`), intended to give advance notice of incoming hounds.

## Usage example
```lua
-- Spawning a level 2 warning effect (distance = SPAWN_DIST + 20)
local warning_prefab = Prefab("houndwarning_lvl2")
local inst = SpawnPrefab("houndwarning_lvl2")
-- The entity plays the sound and removes itself automatically after 0 game ticks
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
### `PlayWarningSound(inst, radius)`
*   **Description:** Positions the entity at the specified radius around the focal point, plays the hound warning sound, and removes the entity.
*   **Parameters:** `inst` (entity) – the warning entity; `radius` (number) – distance from the focal point.
*   **Returns:** Nothing.

### `makewarning(distance)`
*   **Description:** Returns a factory function that creates a new warning entity configured for the given distance.
*   **Parameters:** `distance` (number) – radius at which the warning sound will be played.
*   **Returns:** A function that, when called, returns an entity with `transform` and `soundemitter` components, ready to play the warning.

## Events & listeners
- **Pushes:** None.
- **Listens to:** None.