---
id: vault_furniture
title: Vault Furniture
description: Defines two prefabs (vault_table_round and vault_stool) with variation management, decoration handling, and sittable/inspectable behavior for DST vault environments.
tags: [furniture, decoration, structure, sittable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a5a103d7
system_scope: entity
---

# Vault Furniture

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `vault_furniture.lua` file defines two prefabs—`vault_table_round` and `vault_stool`—used as decorative and functional items in the Ruins and Vault areas of DST. These prefabs share common variation-handling logic (with and without moss decorations) and implement persistence via `OnSave`/`OnLoad` hooks. The table variant integrates with the `furnituredecortaker` component to accept and manage decoration items, while the stool variant supports sitting via the `sittable` component and dynamic name/description display.

## Usage example
```lua
-- Example: Create a vault table with moss variation and attach a decoration
local table_inst = SpawnPrefab("vault_table_round")
table_inst:SetVariation(3) -- apply moss variation 2 (MOSS2 visible)

-- Attach a decoration item (e.g., a relic)
local decoration = SpawnPrefab("some_relic")
table_inst.components.furnituredecortaker:TryAddDecor(decoration)

-- Example: Create a vault stool and check if occupied
local stool_inst = SpawnPrefab("vault_stool")
if stool_inst.components.sittable:IsOccupied() then
    print("Stool is occupied")
end
```

## Dependencies & tags
**Components used:** `furnituredecortaker`, `inspectable`, `sittable`, `savedrotation`  
**Tags:** `decortable`, `structure`, `faced_chair`, `rotatableobject`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Current moss variation (1 = no moss, >1 indicates active moss layers). |
| `SetVariation` | function | `SetVariation(inst, variation)` | Public method to set and update moss layers visually. |
| `OnSave` | function | `OnSave(inst, data)` | Serialization hook for saving variation state. |
| `OnLoad` | function | `OnLoad(inst, data, ents)` | Deserialization hook for restoring variation state. |
| `displaynamefn` | function | `DisplayNameFn(inst)` | Dynamic name provider used by inspectable UI. |

## Main functions
### `SetVariation(inst, variation)`
* **Description:** Updates the visual moss layer on the entity by hiding/showing MOSS1 and MOSS2 animations. Ensures idempotent updates by checking against `inst.variation`.
* **Parameters:**  
  `inst` (Entity) – The entity instance.  
  `variation` (number) – Variation ID: `1` (no moss), `2` (MOSS1), or `3` (MOSS2).  
* **Returns:** Nothing.
* **Error states:** No-op if `inst.variation == variation`.

### `table_AbleToAcceptDecor(inst, item, giver)`
* **Description:** Predicate function used by `furnituredecortaker` to determine if an item can be placed on the table.
* **Parameters:**  
  `inst` (Entity) – The table entity.  
  `item` (Entity?) – The decoration item being offered (may be `nil`).  
  `giver` (Entity?) – The entity placing the item.  
* **Returns:** `true` if `item ~= nil`, otherwise `false`.

### `table_OnDecorGiven(inst, item, giver)`
* **Description:** Callback triggered when a decoration is successfully placed on the table. Handles sound, physics deactivation, and follower symbol attachment.
* **Parameters:**  
  `inst` (Entity) – The table entity.  
  `item` (Entity) – The decoration item.  
  `giver` (Entity?) – The entity placing the item.  
* **Returns:** Nothing.

### `table_OnDecorTaken(inst, item)`
* **Description:** Callback triggered when a decoration is removed from the table. Re-enables physics and stops following.
* **Parameters:**  
  `inst` (Entity) – The table entity.  
  `item` (Entity?) – The decoration item (may be `nil` if destroyed during removal).  
* **Returns:** Nothing.

### `stool_GetStatus(inst)`
* **Description:** Returns `"OCCUPIED"` if the stool is occupied, otherwise `nil`.
* **Parameters:**  
  `inst` (Entity) – The stool entity.  
* **Returns:** `"OCCUPIED"` or `nil`.

### `stool_DescriptionFn(inst)`
* **Description:** Dynamic description provider. Overrides the inspectable name based on occupancy status (`"stone_chair"` if occupied, `"relic"` otherwise).
* **Parameters:**  
  `inst` (Entity) – The stool entity.  
* **Returns:** Nothing (sets `inst.components.inspectable.nameoverride` internally).

### `DisplayNameFn(inst)`
* **Description:** Shared name provider used by both prefabs; returns `STRINGS.NAMES.VAULTRELIC`.
* **Parameters:**  
  `inst` (Entity) – Any vault furniture entity.  
* **Returns:** String name from localization.

## Events & listeners
- **Listens to:** None (no `ListenForEvent` calls are present).
- **Pushes:** None (no `PushEvent` calls are present).