---
id: battreefx
title: Battreefx
description: Spawns a non-persistent visual/audio effect entity to simulate a bat flutter and explosion near a viewer, typically used during spook events in the forest.
tags: [fx, audio, spook]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5108cd85
system_scope: fx
---

# Battreefx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`battreefx` is a lightweight prefab that creates a temporary, non-networked effect entity used to visualize and audible a bat spook event. It plays a fluttering bat animation and explosion sound locally to the specified viewer, while hiding itself from the locally hosted server player in multiplayer contexts. It is instantiated and configured at runtime via the `SetViewerAndAnim` function, and is automatically removed after a short duration.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("FX")
inst:AddComponent("network")
-- ... other setup
inst.SetViewerAndAnim = SetViewerAndAnim
inst:SetViewerAndAnim(ThePlayer, "play")
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`; checks for no external tags.

## Properties
No public properties.

## Main functions
### `SetViewerAndAnim(viewer, anim)`
* **Description:** Configures the effect entity for a specific viewer by playing the specified animation, positioning it, triggering local sound playback, and registering overlay timing for the "batspooked" event. For the local player, it plays sounds and queues the overlay; for other viewers, it makes the effect invisible by setting opacity to 0.
* **Parameters:** 
  * `viewer` (entity) — the player entity that will see and hear the effect.
  * `anim` (string) — the animation name to play (e.g., `"play"`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — removes the entity when the animation finishes.
- **Pushes:** None identified (sound or overlay event `"batspooked"` is pushed on `ThePlayer`, not on this entity).