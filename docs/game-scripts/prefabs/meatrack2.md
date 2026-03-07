---
id: meatrack2
title: Meatrack2
description: Manages a multi-slot drying rack structure that processes raw meat and other edible items into dried versions using environmental conditions and optional salt collection.
tags: [drying, structure, inventory, food, collectible]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b176b344
system_scope: environment
---

# Meatrack2

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`meatrack2.lua` defines the logic for meat rack prefabs in DST, which act as food preservation structures. It implements both standard and Hermit Crab variant racks. The rack holds items in a container, dries them over time (reducing perish), and replaces them with dried variants. Salt may be collected during drying in the Hermit Crab variant. The component leverages the `container`, `dryingrack`, `burnable`, `lootdropper`, `workable`, and `dryingracksaltcollector` components to achieve its behavior.

## Usage example
```lua
-- Standard meatrack instantiation
local inst = SpawnPrefab("meatrack")
inst.Transform:SetPosition(x, y, z)

-- Place an item in the rack
local meat = SpawnPrefab("meat")
inst.components.container:GiveItem(meat, 1)

-- Manually trigger status check (optional)
local status = inst.components.inspectable.getstatus(inst) -- e.g., "DRYING"
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `dryingrack`, `dryingracksaltcollector`, `edible`, `inspectable`, `inventoryitem`, `lootdropper`, `perishable`, `rainimmunity`, `workable`, `stackable`, `preserver`, `propagator`, `driedsalticon`.

**Tags added:** `structure`, `antlion_sinkhole_blocker` (only on Hermit Crab variant).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lastbounceslot` | string or `nil` | `nil` | Tracks last slot used for bounce animation (only on racks with >3 slots). |
| `_saltlevel` | string | `"none"` | Current salt level (`"none"`, `"low"`, `"medium"`, `"high"`) on Hermit Crab racks. |
| `build` | string | — | Build name used for animation overrides. |
| `scrapbook_anim` | string | `"placer"` or `"idle_empty"` | Animation name used for scrapbook display. |
| `abandoning_task` | `nil` or task reference | `nil` | Task handle for Hermit Crab abandonment delay. |

## Main functions
### `GetStatus(inst)`
* **Description:** Determines and returns a status string summarizing the rack’s current state based on contents and weather.
* **Parameters:** `inst` (Entity) — the rack entity.
* **Returns:** String such as `"DRYING"`, `"DRYINGINRAIN"`, `"DONE"`, `"BURNT"`, `"ABANDONED"`, or `nil`.
* **Error states:** Returns `nil` if rack is empty and no salt collected.

### `OnBuilt(inst)`
* **Description:** Handles initial animation and sound when the rack is built/placed by a player.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `ShowRackItem(inst, slot, name, build)`
* **Description:** Updates the rack’s animation to show an item in a given slot using symbol overrides.
* **Parameters:** `inst` (Entity), `slot` (number), `name` (string, prefab name), `build` (string, build name).
* **Returns:** Nothing.

### `HideRackItem(inst, slot, name)`
* **Description:** Removes an item’s animation representation from a given slot.
* **Parameters:** `inst` (Entity), `slot` (number), `name` (string, prefab name).
* **Returns:** Nothing.

### `OnMeatRackSkinChanged(inst, skin_build)`
* **Description:** Updates rope symbol overrides for all slots when the rack’s skin changes.
* **Parameters:** `inst` (Entity), `skin_build` (string or `nil`).
* **Returns:** Nothing.

### `hermit_OnSaltChanged(inst, num)`
* **Description:** Updates the rack’s visual salt level (low/medium/high/none) on Hermit Crab variants based on collected salt count.
* **Parameters:** `inst` (Entity), `num` (number) — total salt count including `saltrock` in inventory.
* **Returns:** Nothing.

### `hermit_DoItemTaken(inst, slot)`
* **Description:** Transfers collected salt back into the rack’s container or spawns it on ground when an item is removed.
* **Parameters:** `inst` (Entity), `slot` (number).
* **Returns:** Nothing.

### `hermit_MakeBroken(inst)`
* **Description:** Converts the Hermit Crab rack to an “abandoned” state, removing drying and salt-collecting functionality.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemget`, `itemlose`, `onbuilt`, `ondeconstructstructure`, `onputininventory`, `ondropped`, `israining`, `isacidraining`, `gainrainimmunity`, `loserainimmunity`, `riderchanged`, `death`.
- **Pushes:** `CHEVO_starteddrying`, `perishchange`, `stacksizechange`, `onextinguish`, `onclose`, `ondropped`, `entity_droploot`, `loot_prefab_spawned`, `ms_register_pearl_entity`.