---
id: collapsedchest
title: Collapsedchest
description: Acts as a destructible container structure that holds a nested chest and reconstructs into it upon completion, or drops its contents upon pick/hit if incomplete.
tags: [container, construction, destruction]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6643cfad
system_scope: world
---

# Collapsedchest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`collapsedchest` is a Prefab factory function that creates destructible, construction-site-enabled entities representing collapsed or broken treasure chests. When built (constructed), it reconstructs into a functional chest. When picked or otherwise destroyed before completion, it drops either a random item or all materials depending on state (burnt, empty, or incomplete). It embeds a nested chest entity and manages its visibility, parenting, and restoration.

The component behavior is embedded directly in the prefab's factory function (`fn`) rather than a standalone Component class. It uses the `constructionsite`, `pickable`, and `hauntable` components, and integrates with container operations via the embedded chest instance.

## Usage example
```lua
-- Instantiate a collapsed chest variant (e.g., treasure chest version)
local collapsed = MakePrefab("collapsed_treasurechest")
-- Setup nested chest and build state
local nested_chest = SpawnPrefab("treasure_chest_upgraded")
collapsed:SetChest(nested_chest, false)  -- false = not burnt
-- Build it back into a chest
collapsed.components.constructionsite:AddMaterial("boards", 1)
collapsed.components.constructionsite:AddMaterial("cut_grass", 1)
collapsed:PushEvent("workaction", { workable = collapsed.components.constructionsite, doer = player })
```

## Dependencies & tags
**Components used:** `constructionsite`, `pickable`, `hauntable`, `inspectable`, `container` (via embedded `inst.chest`), `workable` (via embedded `inst.chest`)
**Tags:** Adds `pickable_rummage_str`, `constructionsite`, `rebuildconstructionsite`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chest` | entity or nil | `nil` | The nested chest entity hidden within the collapsed state. |
| `burnt` | boolean | `false` | Indicates whether the chest was burnt during collapse (affects animation and rebuild behavior). |

## Main functions
### `SetChest(inst, chest, burnt)`
* **Description:** Attaches the nested chest entity to the collapsed chest, hides it visually, and offsets its transform. If `burnt` is true, sets the `burnt` flag and plays the burnt idle animation.
* **Parameters:**  
  `chest` (entity) — the chest entity to embed.  
  `burnt` (boolean) — whether the chest was burnt.  
* **Returns:** Nothing.

### `OnConstructed(inst, doer)`
* **Description:** Called when the construction site is complete. Restores the nested chest, reparents and positions it, enables workability, and emits a sound and "restoredfromcollapsed" event. If incomplete, plays a hit animation and sound.
* **Parameters:**  
  `doer` (entity, optional) — the actor that completed the construction.  
* **Returns:** Nothing.

### `OnPicked(inst, picker, loot)`
* **Description:** Triggered when the collapsed chest is picked. If the nested chest contains items, drops a random one (gives to picker if inventory exists, otherwise drops on ground). Then checks if chest is empty. If empty, drops all construction materials, spawns collapse FX, and removes the entity. Otherwise, plays a hit animation.
* **Parameters:**  
  `picker` (entity, optional) — the entity that picked the chest.  
  `loot` — unused parameter (present in signature for compatibility).  
* **Returns:** Nothing.

### `OnSink(inst, data)`
* **Description:** Handles environmental sinking events. Drops all chest contents (up to a cap via `TUNING.COLLAPSED_CHEST_MAX_EXCESS_STACKS_DROPS`), drops all construction materials, spawns collapse FX, and removes the entity.
* **Parameters:**  
  `data` — event payload (unused).  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes state. Stores `burnt` flag and the save record for the nested chest if present.
* **Parameters:**  
  `data` (table) — the save table to populate.  
* **Returns:** (optional) table of entity references for cross-referencing.

### `OnLoad(inst, data, newents)`
* **Description:** Restores state from save data. Reconstructs the nested chest if present and applies the burnt state.
* **Parameters:**  
  `data` (table, optional) — loaded save record.  
  `newents` — table of new entities for save record reconstruction.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onsink` — triggers `OnSink` handler to drop contents and destroy the entity when sunk (e.g., into lava).
- **Pushes (via embedded chest):** `restoredfromcollapsed` — fired on the nested chest when it is restored to active state.
- **Pushes (via pickable):** `item_picked` — indirectly via `pickable` component's internal handler.
- **Pushes (via constructionsite):** `constructed` — emitted when construction completes (handled via `OnConstructed`).
- **Pushes (via `OnPicked`):** `dropitem` — fired via `container:DropItemBySlot` when an item is dropped.
