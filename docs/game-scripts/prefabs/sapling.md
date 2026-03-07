---
id: sapling
title: Sapling
description: Manages the lifecycle, interaction, and transformation of sapling entities, including growth, harvesting, transplanting, and optional moon-phase conversion for seasonal variants.
tags: [environment, plant, harvesting, transformation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 92b73806
system_scope: environment
---

# Sapling

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sapling` prefab implements a renewable, harvestable plant entity with support for growth, partial consumption, and full excavation. It integrates with multiple components: `pickable` for resource harvesting, `witherable` for health-based decay states, `workable` for transplanting via Dig action, and `lootdropper` for resource drops. It also supports optional conversion to a moon variant (`sapling_moon`) via the `halloweenmoonmutable` component. The prefab is used for both standard and seasonal (moon) variants and participates in world generation, silviculture tracking, and save/load serialization.

## Usage example
```lua
local inst = SpawnPrefab("sapling")
inst.Transform:SetPosition(x, y, z)

-- Harvest twigs
inst.components.pickable.product = "twigs"
inst.components.pickable:MakeEmpty()

-- Transplant (dig up) with action callback
inst.components.workable:SetOnFinishCallback(dig_up)
inst:PushEvent("workaction", { doer = player })
```

## Dependencies & tags
**Components used:** `pickable`, `witherable`, `lootdropper`, `workable`, `halloweenmoonmutable`, `inspectable`, `herdmember`, `knownlocations`, `burnable`, `propagator`, `waxableplant`.  
**Tags added:** `plant`, `renewable`, `silviculture`, `lunarplant_target`, `witherable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._is_moon` | boolean | `false` | Indicates whether this instance is the moon variant. Set during construction via `sapling_common(inst, is_moon)`. |
| `inst.prefab` | string | `"sapling"` (or `"sapling_moon"`) | Internal prefab name; overridden for moon variant during conversion. |

## Main functions
### `dig_up(inst, worker)`
*   **Description:** Handles excavation of the sapling. Drops twigs and the appropriate dug-sapling prefab based on withered status and variant, then removes the entity.
*   **Parameters:**  
    * `inst` (Entity) – The sapling instance.  
    * `worker` (Entity) – The entity performing the dig action (e.g., player).  
*   **Returns:** Nothing.  
*   **Error states:** Silently exits if `pickable` or `lootdropper` components are missing.

### `moonconversionoverridefn(inst)`
*   **Description:** Overrides the standard Halloween moon mutation behavior for saplings. Converts the entity to the moon variant (`sapling_moon`), updates animation bank/build, sets internal state, and removes the `halloweenmoonmutable` component.
*   **Parameters:** `inst` (Entity) – The sapling instance.  
*   **Returns:** A tuple `(inst, nil)` – the modified entity and `nil` (as per `halloweenmoonmutable` override contract).  
*   **Error states:** None documented.

### `ontransplantfn(inst)`
*   **Description:** Called after a transplant action (e.g., Dig). Ensures the sapling is marked empty post-removal.
*   **Parameters:** `inst` (Entity) – The sapling instance.  
*   **Returns:** Nothing.

### `onpickedfn(inst, picker)`
*   **Description:** Triggered when twigs are harvested. Plays the “picked” animation once.
*   **Parameters:**  
    * `inst` (Entity) – The sapling instance.  
    * `picker` (Entity) – The harvester.  
*   **Returns:** Nothing.

### `onregenfn(inst)`
*   **Description:** Plays the growth animation sequence (grow → sway) when the sapling regenerates resources.
*   **Parameters:** `inst` (Entity) – The sapling instance.  
*   **Returns:** Nothing.

### `makeemptyfn(inst)`
*   **Description:** Sets animation to "empty" (or dead-related if withered). Used after harvesting all resources.
*   **Parameters:** `inst` (Entity) – The sapling instance.  
*   **Returns:** Nothing.  
*   **Error states:** Skips animations during `POPULATING` (e.g., world generation).

### `makebarrenfn(inst, wasempty)`
*   **Description:** Transitions the sapling to a permanently barren/dead state, using either `empty_to_dead` or `full_to_dead` animations depending on prior state.
*   **Parameters:**  
    * `inst` (Entity) – The sapling instance.  
    * `wasempty` (boolean) – Whether the sapling was already empty before becoming barren.  
*   **Returns:** Nothing.

### `sapling_common(inst, is_moon)`
*   **Description:** Shared initialization logic for both standard and moon variants. Adds transform, anim state, minimap, network support, and core components; sets tags, animations, and callbacks.
*   **Parameters:**  
    * `inst` (Entity) – The new entity instance.  
    * `is_moon` (boolean) – `true` to configure the moon variant.  
*   **Returns:** `inst` (entity), early returning non-master clients.

## Events & listeners
- **Listens to:** None directly (event handling is delegated to components).
- **Pushes:**  
    * `loot_prefab_spawned` – via `lootdropper:SpawnLootPrefab()` when digging.  
    * Events from `pickable`, `witherable`, `workable` components (e.g., `onpicked`, `onregen`, `onfinish`).