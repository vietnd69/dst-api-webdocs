---
id: hideandseekhidingspot
title: Hideandseekhidingspot
description: This component manages a hide-and-seek hiding spot, allowing players to hide inside it and automatically evicting them when the spot is interacted with or damaged.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f0299efe
---

# Hideandseekhidingspot

## Overview
This component enables an entity to function as a hide-and-seek hiding spot in DST's Hide and Seek minigame. It supports a player (`hider`) entering and remaining hidden inside the spot via a `hiding_prop` (typically a kitcoon box or similar), tracks the hider, and evicts them upon specific events (e.g., the spot being picked, worked, ignited, opened, activated, or picked up). It also persists state across saves and cleans up properly on removal.

## Dependencies & Tags
- Components relied on: None directly added or required via `AddComponent` in this script; however, it assumes the presence of `hideandseekhider` on the hider entity (`hider.components.hideandseekhider:Found(doer)`).
- Tags added: None explicitly.
- References external prefabs: Uses `SpawnPrefab(hider._hiding_prop)` and `TUNING.KITCOON_HIDING_OFFSET`.
- Listens to world-level event: `"ms_collecthiddenkitcoons"` via `TheWorld`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | passed via constructor | Reference to the owning entity (the hiding spot). |
| `evict_fn` | `function` | (defined inline) | Callback function triggered on events like `"picked"`/`"worked"`/`"onignite"`—evicts the current hider. |
| `onremove_hider` | `function` | (defined inline) | Callback executed when the hider entity is removed; clears `hider` and removes the component. |
| `on_collecthiddenkitcoons` | `function` | (defined inline) | Callback for world event `"ms_collecthiddenkitcoons"`; adds this spot to the list of found spots. |
| `hider` | `Entity?` | `nil` | Reference to the player currently hiding in the spot (set by `SetHider`/`HideInSpot`). |
| `finder` | `Entity?` | `nil` | Player who found/evicted the hider; set during eviction and used in removal event. |
| `hiding_prop` | `DynamicObject?` | `nil` | The visual prop (e.g., kitcoon) spawned and attached to the spot while hiding; removed on eviction or removal. |

## Main Functions

### `:SetHider(hider)`
* **Description:** Assigns a player as the hider for this spot if no hider is already assigned. Registers cleanup logic when the hider is removed.
* **Parameters:**
  - `hider` (`Entity`): The player entity that will hide in this spot.

### `:HideInSpot(hider)`
* **Description:** Initiates hiding for the given hider. Attaches the hider and spawns/attaches the `hiding_prop`, registers evict callbacks on the prop, and positions them at the spot’s origin.
* **Parameters:**
  - `hider` (`Entity`): The player to hide. Internally calls `:SetHider`, then sets up parent relationships and spawns the `hiding_prop`.

### `:_ReleaesHider(doer)`
* **Description:** Evicts the current hider (if any), returns them to the scene, unparents them and the prop, notifies their `hideandseekhider` component, clears the hider reference, and updates `finder`.
* **Parameters:**
  - `doer` (`Entity?`): The entity performing the eviction (e.g., picker, doer, worker, owner). Only players are considered valid; others are ignored.

### `:OnRemoveEntity()`
* **Description:** Evicts any active hider and clears associated state when the hiding spot entity itself is removed (but before component removal).
* **Parameters:** None.

### `:OnRemoveFromEntity()`
* **Description:** Full cleanup called when the component is removed from the entity. Evicts hider, unregisters world event listener, pushes `"onhidingspotremoved"` event, and removes the `hiding_prop` if valid.
* **Parameters:** None.

### `:SearchHidingSpot(doer)`
* **Description:** Evicts the hider (via `:_ReleaesHider`), then removes the component entirely—used when a spot is successfully "found" or searched.
* **Parameters:**
  - `doer` (`Entity`): Player performing the search.

### `:Abort()`
* **Description:** Evicts the hider and removes the component—used to abort hiding without a successful find.
* **Parameters:** None.

### `:OnSave()`
* **Description:** Serializes state if a hider is currently hiding (including the hider’s save record).
* **Returns:** `data` (table), `refs` (nil or references table). `data.hider_saverecord` stores the hider if present.

### `:OnLoad(data, newents)`
* **Description:** Reloads a previously hidden hider by spawning from `hider_saverecord` and calling `:HideInSpot`.
* **Parameters:**
  - `data` (`table?`): Data from `OnSave`.
  - `newents` (`table`): Mapping of saved entity GUIDs to loaded entities.

### `:GetDebugString()`
* **Description:** Returns a debug string showing the current hider’s prefab name, or an error message if invalid.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"ms_collecthiddenkitcoons"` on `TheWorld` → triggers `on_collecthiddenkitcoons`
  - `"onremove"` on the hider entity → triggers `onremove_hider`
  - `"picked"`, `"worked"`, `"onignite"`, `"onopen"`, `"onactivated"`, `"onpickup"` on `hiding_prop` → all trigger `evict_fn`
- **Pushes:**
  - `"onhidingspotremoved"` (on `self.inst`) with `{finder = self.finder}` during `OnRemoveFromEntity`.