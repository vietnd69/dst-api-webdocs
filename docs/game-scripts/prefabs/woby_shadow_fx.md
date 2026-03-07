---
id: woby_shadow_fx
title: Woby Shadow Fx
description: Creates transient visual effects for Woby's dash ability, including a moving追随 trail and a static silhouette, managed via network-aware prefabs.
tags: [fx, movement, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e1f518d
system_scope: fx
---

# Woby Shadow Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`woby_shadow_fx` provides two prefabs used to render visual effects associated with Woby's dash ability: one that follows its owner (`woby_dash_shadow_fx`) and one that displays a static silhouette (`woby_dash_silhouette_fx`). The follower effect uses an `updatelooper` component to continuously update its position toward the owner and stop only upon animover, ensuring the effect trails the player during movement. The silhouette variant is non-interactive and fixed in position.

## Usage example
```lua
-- Create and attach the follower shadow FX to an entity (e.g., Woby)
local shadow_fx = Prefab("woby_dash_shadow_fx", fn, assets)
local fx_inst = SpawnPrefab("woby_dash_shadow_fx")
fx_inst.components.updatelooper = nil -- ensure updatelooper is added by SetFxOwner
fx_inst.SetFxOwner(fx_inst, owner_entity)

-- Create and spawn the static silhouette
local silh_inst = SpawnPrefab("woby_dash_silhouette_fx")
silh_inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `updatelooper`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags added:** `FX`, `NOCLICK` (on follower only)

## Properties
No public properties

## Main functions
### `SetFxOwner(inst, owner)`
* **Description:** Attaches the `updatelooper` component, registers `OnWallUpdate` as a wall-update callback, and stores the `owner` reference on the instance. This enables the effect to trail behind the owner.
* **Parameters:**  
  - `inst` (TheEntity) — the FX entity instance  
  - `owner` (TheEntity) — the entity the effect will follow (e.g., Woby)
* **Returns:** Nothing  
* **Error states:** If `owner` becomes invalid or removed, the effect ceases to update.

## Events & listeners
- **Listens to:** `animover` — removes the FX instance once its animation completes (applies only to the follower effect `woby_dash_shadow_fx`).  
- **Pushes:** None