---
id: tophat_shadow_fx
title: Tophat Shadow Fx
description: Generates and manages visual particle effects for the Top Hat wearable item, including floating hat FX, swirl animations, and particle emissions during use.
tags: [fx, wearable, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f4985675
system_scope: fx
---

# Tophat Shadow Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines three prefabs that provide visualFX for the Top Hat wearable item in DST: `tophat_shadow_fx`, `tophat_swirl_fx`, and `tophat_using_shadow_fx`. These prefabs create non-networked, client-side FX entities that animate in sync with the wearer's animation and orientation. The prefabs use a particle-pooling system to minimize garbage collection and rely on the `rider` component to adjust orientation when the player is riding a beefalo. None of these prefabs persist across sessions or sync over the network.

## Usage example
```lua
-- The prefabs are typically added automatically when equipping the Top Hat
-- Example manual instantiation (client-side only):
if not TheNet:IsDedicated() then
    local inst = Prefab("tophat_shadow_fx")()
    inst.entity:SetParent(player.entity)
end
```

## Dependencies & tags
**Components used:** `rider` (only for checking `IsRiding()` status to set six-faced orientation)
**Tags:** Adds `FX`, `NOCLICK`, `CLASSIFIED`, `NOCLICK`; creates particles with `NOCLICK` and `FX` tags.

## Properties
No public properties. Instances are created via prefabs and configured internally via parameters like `frame` or `front`.

## Main functions
### `shadow_createfx(front, frame)`
* **Description:** Creates and configures a single top-hat FX entity with either front or back animations, spawns initial particles, and sets up looping via `animover` event.
* **Parameters:**
  * `front` (boolean) — if true, creates front-facing FX with "swap_front" follow symbol; otherwise back-facing with "swap_back".
  * `frame` (number, optional) — initial animation frame offset (0–31).
* **Returns:** Entity instance configured for Top Hat visualFX.
* **Error states:** No explicit error handling; non-master-world instances return early but still create a non-persistent entity.

### `swirl_fn()`
* **Description:** Factory function returning the `tophat_swirl_fx` prefab instance — a continuous swirl animation used when the Top Hat is equipped.
* **Parameters:** None.
* **Returns:** FX entity entity with `swirl_front` animation and `AttachToTopHatUser` method (`swirl_attachfn`).
* **Behavior:** Sets up four-faced orientation and registers `swirl_attachfn` for attaching to a Top Hat wearer.

### `using_shadow_fn()`
* **Description:** Factory function returning the `tophat_using_shadow_fx` prefab instance — a particle-emitting FX used while the player is using the Top Hat.
* **Parameters:** None.
* **Returns:** FX entity with `using_particles` looping animation and `AttachToTopHatUser` method (`using_shadow_attachfn`).
* **Behavior:** Uses `swap_fx_particles_using_tophat` follow symbol; orientation changes to six-faced if the user is riding.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers loop functions (`shadow_fxfrontloop`, `shadow_fxbackloop`, or `shadow_particle_onanimover`) when an animation completes.
  - `OnRemoveEntity` — calls `shadow_onremoveentity` to clean up pooled FX particles before entity removal.

- **Pushes:** None — this file only consumes events; it does not fire custom events.
