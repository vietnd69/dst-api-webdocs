---
id: ocean_trawler
title: Ocean Trawler
description: A deployable water-based fishing structure that catches and stores fish, with state-aware perish rate scaling and overflow fish release on destruction.
tags: [fishing, structure, water, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6b7e6688
system_scope: world
---

# Ocean Trawler

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `ocean_trawler` is a deployable water structure that functions as a fishing net. It catches fish when lowered into water and holds them in its internal container. The component supports multiple operational states (`lowered`, `caught`, `escaped`, `burnt`) and integrates closely with the `container`, `lootdropper`, `burnable`, `preserver`, and `workable` components. Its behavior changes depending on its state—for example, fish inside do not perish while the trawler is lowered, and overflow fish are released upon destruction.

## Usage example
This prefab is not meant to be created manually in most mods. It is registered as `ocean_trawler` and deployed via `ocean_trawler_kit`. When created, it automatically initializes its components and state graph.

```lua
-- Not typically used directly; example of internal state handling during save/load
local function onsave(inst, data)
    if inst:HasTag("burnt") or (inst.components.burnable ~= nil and inst.components.burnable:IsBurning()) then
        data.burnt = true
    end
end

-- Used during world load to re-trigger burnt state logic
local function onload(inst, data)
    if data and data.burnt and inst.components.burnable ~= nil and inst.components.burnable.onburnt ~= nil then
        inst.components.burnable.onburnt(inst)
    end
end
```

## Dependencies & tags
**Components used:** `container`, `lootdropper`, `burnable`, `preserver`, `workable`, `inspectable`, `oceantrawler`, `hauntable`, `deployable`, `waterobstacle`, `snowcovered`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`  
**Tags added:** `oceantrawler`, `overriderowaction`

## Properties
No public properties are initialized in the constructor. State and data are stored in the `inst` and its components.

## Main functions
### `onsave(inst, data)`
* **Description:** Saves the burnt state of the trawler into the save data for persistence.
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.  
  `data` (table) – the save data table to modify.
* **Returns:** Nothing.
* **Error states:** Modifies `data.burnt` only if the trawler is burnt or currently burning.

### `onload(inst, data)`
* **Description:** Restores burnt state behavior by invoking `burnable.onburnt` during load if the trawler was burnt previously.
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.  
  `data` (table) – the loaded save data.
* **Returns:** Nothing.
* **Error states:** No-op if `data` is missing, `burnt` field is absent, or `burnable.onburnt` is nil.

### `ondeath(inst)`
* **Description:** Handles cleanup and loot release when the trawler is destroyed (e.g., via hammering or other means).
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.
* **Returns:** Nothing.
* **Error states:** Spawns a `collapse_small` FX with `wood` material, drops all container contents, and releases any overflow fish via `oceantrawler:ReleaseOverflowFish()`.

### `onburnt(inst)`
* **Description:** Triggers when the trawler catches fire and finishes burning. Cooks any fish currently in the container and applies default burnt behavior.
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.
* **Returns:** Nothing.
* **Error states:** Iterates over container slots, spawns cooked loot prefabs for fish items, then calls `DefaultBurntStructureFn(inst)`.

### `GetStatus(inst, viewer)`
* **Description:** Returns a string status representing the current operational state of the trawler, used for tooltips or UI.
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.  
  `viewer` (Entity) – the player/viewer entity (unused).
* **Returns:** One of `"LOWERED"`, `"ESCAPED"`, `"CAUGHT"`, or `"GENERIC"`.
* **Error states:** Returns `"GENERIC"` if `oceantrawler` component is missing.

### `FishPreserverRate(inst, item)`
* **Description:** Provides a perish rate multiplier for fish items inside the trawler based on whether it’s lowered.
* **Parameters:**  
  `inst` (Entity) – the trawler entity instance.  
  `item` (Entity or nil) – the item being checked for perish scaling.
* **Returns:** `TUNING.OCEAN_TRAWLER_LOWERED_PERISH_RATE` (number) if the trawler is lowered and the item is tagged `"fish"`; otherwise `nil`.
* **Error states:** Returns `nil` if `oceantrawler` is missing, not lowered, or item is not a fish.

## Events & listeners
- **Listens to:**  
  `onbuilt` – triggers `onbuilt(inst)` to advance the state graph to `"place"`.  
  `death` – triggers `ondeath(inst)` to handle destruction.
- **Pushes:** None directly, but relies on component-specific event handling (e.g., `burnable` triggers `onburnt`, `lootdropper` fires `entity_droploot` internally).