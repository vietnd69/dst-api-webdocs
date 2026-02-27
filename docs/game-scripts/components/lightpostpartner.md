---
id: lightpostpartner
title: Lightpostpartner
description: Manages chain-link relationships between lantern posts and other entities by tracking shackle associations and synchronizing them across server and client.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 99b5edc6
---

# Lightpostpartner

## Overview
This component enables an entity (typically a lantern post) to maintain persistent, shackle-based relationships with other entities—allowing it to be linked to up to N partners (e.g., chains connecting lanterns). It handles shackle assignment, removal, saving/loading, and listens for events (like teleportation or removal) that require disconnection of all shackles.

## Dependencies & Tags
- **Tags added**: `"lightpostpartner"`
- **Dependencies**: Relies on `inst.GUID`, `inst:HasTag(...)`, and `net_entity(...)` (a networking wrapper). Uses `TheWorld.ismastersim` to determine server context.

## Properties

| Property             | Type      | Default Value | Description |
|----------------------|-----------|---------------|-------------|
| `inst`               | `Entity`  | `nil` (passed in) | Reference to the owning entity instance. |
| `ismastersim`        | `boolean` | `false`       | `true` if running on the master server simulation. |
| `shackled_entities`  | `table`   | `nil` (initialized on demand) | Array of `net_entity` references (one per shackle slot), each holding a nullable reference to a shackle partner. |
| `post_type`          | `string`  | `nil`         | Stores the prefab name/type of the light post, set via `SetType`. |

## Main Functions

### `GetShackleIdForPartner(partner)`
* **Description:** Returns the 1-based shackle index (ID) where the given `partner` entity is currently shackled, or `nil` if not found.
* **Parameters:**
  - `partner` (`Entity`): The entity to search for in the `shackled_entities` array.

### `IsMultiShackled()`
* **Description:** Returns a truthy value (the `shackled_entities` table) if any shackles are in use. Used to check whether the post has at least one partner.
* **Parameters:** None.

### `InitializeNumShackles(num_entities)`
* **Description:** Initializes the `shackled_entities` array with `num_entities` `net_entity` references. Each entry supports client/server synchronization of shackle state.
* **Parameters:**
  - `num_entities` (`number`): Number of shackle slots to allocate.

### `SetType(prefab)`
* **Description:** Records the `prefab` name (e.g., `"lantern_post"`) as the type of this light post for future reference.
* **Parameters:**
  - `prefab` (`string`): The prefab name of the light post.

### `GetNextAvailableShackleID()`
* **Description:** Returns the smallest 1-based shackle index that is currently unoccupied (i.e., where `shackled_entities[i]:value() == nil`), or `nil` if all slots are full.
* **Parameters:** None.

### `ShacklePartnerToID(partner, id)`
* **Description (Server only):** Assigns the `partner` entity to the specified shackle `id`, and sets `partner.shackle_id` to `id` on the partner. Propagates the change via `net_entity`.
* **Parameters:**
  - `partner` (`Entity`): Entity to shackle.
  - `id` (`number`): 1-based shackle slot index.

### `ShacklePartnerToNextID(partner)`
* **Description (Server only):** Finds the first available shackle slot and shackles `partner` into it.
* **Parameters:**
  - `partner` (`Entity`): Entity to shackle.

### `UnshackleAll()`
* **Description (Server only):** Removes all active shackles: clears all `shackled_entities` slots, sets `shackle_id = nil` on each former partner, and marks slots as empty.
* **Parameters:** None.

### `OnSave()`
* **Description (Server only):** Returns shackle state data for save file serialization. Includes only occupied shackle slots with the partner’s `GUID`.
* **Returns:**  
  - `{ entities = { { id = N, GUID = ... }, ... } }` — list of occupied shackle entries.  
  - Array of referenced `GUID`s (for entity resolution during load).  
  Returns `nil` if no shackles are active.

### `LoadPostPass(ents, data)`
* **Description (Server only):** Called during save-load to restore shackle relationships. Looks up each partner entity via `ents`, then reassigns it to the correct shackle slot using `ShacklePartnerToID`.
* **Parameters:**
  - `ents` (`table`): Map of GUID → entity reference (from save system).
  - `data.entities` (`table`): Array of `{ id = N, GUID = ... }` entries.

## Events & Listeners
- **Listens for events (server only)**:
  - `"teleported"` → triggers `RemoveChainLights`
  - `"teleport_move"` → triggers `RemoveChainLights`
  - `"onremove"` → triggers `RemoveChainLights`
  - `"onburnt"` → triggers `RemoveChainLights`
- **Triggers events**: None directly; relies on external logic (e.g., `RemoveChainLights`) to remove partners and unlink chains.

---