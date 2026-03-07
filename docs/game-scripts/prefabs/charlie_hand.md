---
id: charlie_hand
title: Charlie Hand
description: A non-player entity that serves as an interactive construction site for triggering Charlie's cutscene, spawning a shadow arm, and managing rift activation state.
tags: [boss, cutscene, construction]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bb6c7cad
system_scope: world
---

# Charlie Hand

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlie_hand` is a world entity that functions as both a visual proxy for theCharlie during the rift activation sequence and as a construction site for initiating Charlie's cutscene. It manages animation states, movement, and interaction with the Atrium. When constructed and completed, it triggers a sequence involving CharlieCutscene, removes itself, and allows the Atrium to destabilize and explode.

## Usage example
```lua
-- Typical instantiation by worldgen or scenario code
local hand = SpawnPrefab("charlie_hand")
hand:Initialize(Vector3(x, y, z), Vector3(atrium_x, 0, atrium_z))

-- Internally triggered when construction is complete
if hand.components.constructionsite:IsComplete() then
    hand.components.constructionsite:GetOnConstructedFn()(hand, player)
end
```

## Dependencies & tags
**Components used:** `entitytracker`, `knownlocations`, `inspectable`, `constructionsite`, `locomotor`, `sanityaura`
**Tags:** Adds `constructionsite`, `offerconstructionsite`. Removes `NOCLICK` when `ShowUp` runs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `arm` | Entity | `nil` | Reference to the spawned `shadowhand_arm` entity, created on initialization. |
| `persists` | boolean | `true` (default) | Controls whether the entity survives across loads; set `false` after `OnGetMaterials`. |
| `Initialize(pos)` | function | `nil` | Callback to set position, spawn `arm`, and record locations. |
| `SpawnShadowArm(pos, atrium_pos)` | function | `nil` | Helper to spawn and configure the shadow arm. |
| `OnAtriumPowered(ispowered)` | function | `nil` | Event handler to switch between `ShowUp` (unpowered) and `RunAway` (powered). |
| `HandleAction(data)` | function | `nil` | Callback for `"startaction"` events to respond to `GOHOME`. |
| `StartCutScene(atrium)` | function | `nil` | Helper to trigger Charlie's cutscene on the Atrium. |

## Main functions
### `ShowUp(walkspeed)`
* **Description:** Moves the Charlie Hand into the show-up position (midpoint between origin and Atrium), plays animation, removes `NOCLICK` tag, and plays arrival sound.
* **Parameters:** `walkspeed` (number?, optional) — overrides default speed (`2`).
* **Returns:** Nothing.
* **Error states:** Does not error, but silently fails if `knownlocations` has no `"showup"` entry.

### `RunAway(walkspeed)`
* **Description:** Retreats the hand toward the spawned `arm`'s position. Adds `NOCLICK` tag. Plays decline sound only if `walkspeed` is `nil`.
* **Parameters:** `walkspeed` (number?, optional) — if nil, uses `-8`. Must be negative to retreat.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `inst.arm` is `nil`.

### `OnGetMaterials()`
* **Description:** Triggered on construction site completion. Plays grab animations, plays accept sound, sets `persists = false`, and initiates `RunAway(-3)`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ConstructionSite_OnConstructed(inst, doer)`
* **Description:** Final handler when construction site is fully built. Checks for Atrium, triggers cutscene after a delay, marks cutscene as running, and calls `OnGetMaterials`.
* **Parameters:** `inst` (Entity) — the Charlie Hand instance. `doer` (Entity) — the player who completed construction.
* **Returns:** Nothing.
* **Error states:** Silently skips cutscene if `atrium` or `atrium.components.charliecutscene` is missing.

### `SpawnShadowArm(pos, atrium_pos)`
* **Description:** Creates and configures the `shadowhand_arm` prefab, attaches it to this entity via `stretcher` and `highlightchild`.
* **Parameters:** `pos` (Vector3) — spawn position. `atrium_pos` (Vector3) — Atrium position for orientation.
* **Returns:** `Entity` — the spawned shadow arm instance.

### `Initialize(inst, pos)`
* **Description:** Constructor helper. Records `"origin"` and `"showup"` locations, spawns `arm`, and positions the hand.
* **Parameters:** `pos` (Vector3) — base spawn position.
* **Returns:** Nothing.

### `OnLoadPostPass(inst, data)`
* **Description:** Restoration logic after save load. Recreates `arm` if missing, ensures correct orientation, and schedules `OnAtriumPowered` check. Also destroys self if rifts are disabled in tuning.
* **Parameters:** `data` (table) — saved state (unused directly).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"atriumpowered"` (on `TheWorld`) — triggers `OnAtriumPowered` with `ispowered` boolean.
- **Listens to:** `"startaction"` — triggers `HandleAction` with action data.
- **Pushes:** None — this entity does not directly fire events.