---
id: lightpostpartner
title: Lightpostpartner
description: Manages shackle relationships between a lantern post and connected light sources in Don't Starve Together.
tags: [network, entity, lighting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 99b5edc6
system_scope: world
---

# Lightpostpartner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LightPostPartner` manages the shackle bindings between a lantern post entity and connected light sources. It enables a single post to hold multiple lights in a chain-like configuration, tracking shackle IDs, network synchronization, and cleanup on entity removal or burnout. It is typically attached to the "lantern_post" prefab and works with associated light entities (e.g., lanterns) that are attached to it.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lightpostpartner")
inst.components.lightpostpartner:InitializeNumShackles(3)
inst.components.lightpostpartner:SetType("lantern_post")

-- Shackle a light to the first available shackle slot
local light = GetLightEntity() -- e.g., a lantern instance
inst.components.lightpostpartner:ShacklePartnerToNextID(light)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `lightpostpartner` tag to owning instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity instance this component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether this instance is running in the master simulation (server). |
| `shackled_entities` | `table` of `net_entity` | `nil` | Array of `net_entity` references representing each shackle slot. Populated only after `InitializeNumShackles()` is called. |
| `post_type` | `string` or `nil` | `nil` | Stores the prefab name of the post entity, set via `SetType()`. |

## Main functions
### `GetShackleIdForPartner(partner)`
*   **Description:** Returns the shackle ID (1-based index) to which the given `partner` entity is currently shackled. Returns `nil` if the partner is not shackled.
*   **Parameters:** `partner` (`Entity`) — the entity to look up.
*   **Returns:** `number` or `nil` — the shackle index, or `nil` if not found.

### `IsMultiShackled()`
*   **Description:** Checks whether any shackles are allocated. Returns truthy if `shackled_entities` is non-nil.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the component has initialized shackles, `false` otherwise.

### `InitializeNumShackles(num_entities)`
*   **Description:** Initializes the `shackled_entities` table with the specified number of `net_entity` references for tracking shackled partners.
*   **Parameters:** `num_entities` (`number`) — number of shackle slots to allocate.
*   **Returns:** Nothing.

### `SetType(prefab)`
*   **Description:** Records the prefab name of the post entity for internal reference (e.g., to identify post type during serialization).
*   **Parameters:** `prefab` (`string`) — the name of the post prefab.
*   **Returns:** Nothing.

### `GetNextAvailableShackleID()`
*   **Description:** Scans the `shackled_entities` table and returns the first available (nil) shackle index. Returns `nil` if all shackles are occupied.
*   **Parameters:** None.
*   **Returns:** `number` or `nil` — the first free 1-based index, or `nil` if none available.

### `ShacklePartnerToID(partner, id)`
*   **Description:** Server-side only. Assigns a partner entity to a specific shackle slot by ID. Updates the `shackle_id` property on the partner and writes to the corresponding `net_entity`.
*   **Parameters:**  
  `partner` (`Entity`) — the light entity to shackle.  
  `id` (`number`) — the 1-based shackle index to use.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ismastersim` is `false`.

### `ShacklePartnerToNextID(partner)`
*   **Description:** Server-side only. Shackles a partner entity to the first free shackle slot.
*   **Parameters:** `partner` (`Entity`) — the light entity to shackle.
*   **Returns:** Nothing.
*   **Error states:** No-op if no free shackle is available or if `ismastersim` is `false`.

### `UnshackleAll()`
*   **Description:** Server-side only. Clears all shackles: sets `shackle_id` to `nil` on each shackled partner and nullifies all `net_entity` entries.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ismastersim` is `false`.

### `OnSave()`
*   **Description:** Prepares shackle data for world save serialization. Returns the data to persist and entity references needed for reconstruction.
*   **Parameters:** None.
*   **Returns:**  
  If shackles exist: `{ entities = { { id = number, GUID = number } } }, { GUID1, GUID2, ... }`  
  Otherwise: `nil`.

### `LoadPostPass(ents, data)`
*   **Description:** Restores shackle bindings after world load. Called during the post-load phase.
*   **Parameters:**  
  `ents` (`table`) — mapping of GUIDs to entity descriptors.  
  `data.entities` (`table`) — list of `{ id = number, GUID = number }` pairs from `OnSave`.
*   **Returns:** Nothing.
*   **Error states:** Silently skips loading if the post entity has the `"burnt"` tag.

## Events & listeners
- **Listens to (server only):**  
  `teleported` — triggers `RemoveChainLights` to clear shackles.  
  `teleport_move` — same as above.  
  `onremove` — same as above.  
  `onburnt` — same as above.  
- **Pushes:** None identified.
