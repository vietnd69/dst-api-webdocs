---
id: lighterfire_common
title: Lighterfire Common
description: Provides a reusable factory function to create fire-based lighting prefabs with networked light range control and sound emission.
tags: [fx, lighting, network, prefab]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 86165377
system_scope: fx
---

# Lighterfire Common

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_common.lua` defines a factory function `MakeLighterFire` used to create reusable prefabs for fire-based light sources (e.g., lighters, torches) in DST. It encapsulates logic for creating a non-persistent FX entity with an attached point light, sound emission, and a networked light range parameter (`_lightrange`). The component handles light attachment to a parent entity and synchronizes light properties (radius and falloff) across the network when the range changes.

This file is intended to be imported and invoked by other prefabs to avoid duplication of lighting logic, and is not instantiated directly as a standalone component.

## Usage example
```lua
local MakeLighterFire = include("prefabs/lighterfire_common.lua")

return MakeLighterFire(
    "mytorch",
    { Asset("ANIM", "anim/mytorch.zip") },
    nil,
    function(inst)
        -- common_postinit (client+server)
        inst:AddTag("torch")
    end,
    function(inst)
        -- master_postinit (server-only)
        inst:AddComponent("inventoryitem")
    end
)
```

## Dependencies & tags
**Components used:** `None identified.`  
**Tags:** Adds `"FX"` to the parent entity and `"FX"` and `"playerlight"` to the internal light entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._light` | Entity | — | Reference to the created light entity (returns from `CreateLight()`). |
| `inst._lightrange` | net_tinybyte | `1` | Networked property representing the light range index; controls radius/falloff via `TUNING.TORCH_*` tables. |
| `inst.AttachLightTo` | function | — | (Server only) Method to reattach the light entity to a new parent. |
| `inst.SetLightRange` | function | — | (Server only) Method to safely set `_lightrange` and propagate changes to the client. |

## Main functions
### `CreateLight()`
* **Description:** Creates and configures a non-networked FX entity that emits a warm-yellow point light.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — A lightweight FX entity with `Transform`, `Light`, `"FX"`, and `"playerlight"` tags.
* **Error states:** None. Assumes valid engine-lighting subsystem.

### `AttachLightTo(inst, target)`
* **Description:** Sets the parent of the internal `_light` entity to `target`, binding its transform to the target's.
* **Parameters:**  
  `target` (Entity) — The entity to which the light should be attached.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes `target.entity` is valid.

### `MakeLighterFire(name, customassets, customprefabs, common_postinit, master_postinit)`
* **Description:** Factory function that returns a `Prefab` definition for a lighter/fire-compatible light source. Handles both client and server initialization logic and configures networked light range.
* **Parameters:**  
  `name` (string) — Name of the resulting prefab.  
  `customassets` (table, optional) — Array of additional `Asset()` definitions.  
  `customprefabs` (table, optional) — Array of required prefab dependencies.  
  `common_postinit` (function, optional) — Hook called after initial setup on both client and server.  
  `master_postinit` (function, optional) — Hook called after setup on the server only (e.g., add components, AI, or inventory).
* **Returns:** `Prefab` — A fully constructed `Prefab` definition.
* **Error states:** None. Accepts `nil` for optional parameters.

## Events & listeners
- **Listens to:**  
  - `lightrangedirty` — On non-master simulations, triggers `OnLightRangeDirty` to update local light properties based on replicated `_lightrange`.  
- **Pushes:**  
  - `lightrangedirty` — Fired by the server when `_lightrange` is updated (via `net_tinybyte`), which propagates the change to clients.

## Internal functions
### `OnLightRangeDirty(inst)`
* **Description:** Updates the light radius and falloff based on the current `_lightrange` value using `TUNING.TORCH_RADIUS` and `TUNING.TORCH_FALLOFF`.
* **Parameters:**  
  `inst` (Entity) — The lighter/fire entity instance.
* **Returns:** Nothing.

### `SetLightRange(inst, value)`
* **Description:** Sets `_lightrange` only if the new value differs from the current one, triggers `OnLightRangeDirty`, and syncs to clients.
* **Parameters:**  
  `value` (tinybyte) — New range index (e.g., `0`, `1`, `2`).  
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup handler; removes the internal light entity when the parent is destroyed.
* **Parameters:** `inst` (Entity) — The lighter/fire entity.
* **Returns:** Nothing.

### `OnEntityReplicated(inst)`
* **Description:** On clients, reattaches the light to the parent if a parent is already assigned after replication.
* **Parameters:** `inst` (Entity) — The lighter/fire entity.
* **Returns:** Nothing.