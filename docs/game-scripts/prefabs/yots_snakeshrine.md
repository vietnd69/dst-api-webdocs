---
id: yots_snakeshrine
title: Yots Snakeshrine
description: A boss-adjacent structure that accepts monster meat offerings, unlocks crafting capabilities when offered, and can be hammered down for rewards.
tags: [structure, boss, loot, trade]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 241e5964
system_scope: world
---

# Yots Snakeshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yots_snakeshrine` is a special-purpose structure used in boss encounters (notably Yotb 2021). It functions as a trade NPC when empty, accepting only `monstermeat` offerings. When offered, it unlocks prototyping functionality for specific recipes and visually changes to reflect the active state. It supports burning with appropriate loot and FX handling, and can be deconstructed/harmed to reset or reclaim offerings.

## Usage example
This prefab is not added manually in mods. It is instantiated automatically via the game's prefabs system and used in structured contexts like boss arenas.

To reference or interact with an existing instance:
```lua
-- Example: check if a shrine has an active offering
if shrine.offering ~= nil then
    print("Shrine has offering:", shrine.offering.prefab)
end

-- Example: hammer the shrine to break it
shrine.components.workable:DoWork(nil)
```

## Dependencies & tags
**Components used:** `lootdropper`, `prototyper`, `trader`, `workable`, `burnable`, `propagator`, `timer`, `hauntable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `inventoryitem`.  
**Tags added:** `structure`, `snakeshrine`, `prototyper`.  
**Tags checked/used:** `burnt`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | `Entity` or `nil` | `nil` | Reference to the currently offered monster meat prefab instance. |
| `_onofferingremoved` | function | — | Callback triggered when the offering entity is removed, resetting the shrine. |

## Main functions
### `SetOffering(inst, offering, loading)`
*   **Description:** Sets a new offering on the shrine, replacing any existing one. Activates prototyping, updates visual state, and pushes an activation event. Called on build and when receiving an offering via the `trader` system.
*   **Parameters:**  
    `offering` (Entity) — the monster meat item to place as an offering.  
    `loading` (boolean) — if `true`, suppresses FX (e.g., sounds, animation) for save/load contexts.
*   **Returns:** Nothing.
*   **Error states:** Early return with no effect if `offering == inst.offering`.

### `DropOffering(inst, worker)`
*   **Description:** Removes and returns the current offering to the scene, flinging it toward the `worker` if provided, or dropping it at the shrine’s position. Resets visual and event state, and pushes a deactivation event.
*   **Parameters:**  
    `worker` (Entity or `nil`) — if provided, the offering is flung toward this entity.  
*   **Returns:** Nothing.

### `MakeEmpty(inst)`
*   **Description:** Clears the offering and resets the shrine to its "empty" state. Removes the `prototyper` component and re-adds the `trader` component, making it ready to accept new offerings.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakePrototyper(inst)`
*   **Description:** Ensures the shrine has a `prototyper` component configured with the Worm Shrine recipe tree, and removes `trader` if present. Used when activating or reactivating offering mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a status string used for inspecting the shrine (e.g., via UI or debug).
*   **Parameters:** None.
*   **Returns:**  
    `"BURNT"` if burnt,  
    `"EMPTY"` if the `trader` component exists (no offering),  
    `nil` otherwise (e.g., when an offering is active and not burnt).  
*   **Error states:** None.

### `OnBurnt(inst)`
*   **Description:** Callback invoked when the shrine finishes burning. Removes any active offering, spawns one ash, removes the `trader` component, and applies the default burnt structure transformation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Callback invoked when the shrine starts burning. Spawns ash (if offering present), empties the shrine (clears offering and disables trader), and starts default burn effects.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnExtinguish(inst)`
*   **Description:** Callback invoked when the shrine is extinguished. Re-enables the `trader` component (if missing), restoring trading capability.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `on_work_finished(inst, worker)`
*   **Description:** Called when hammering finishes (after 4 hits). Extinguishes fire if present, drops loot (including offering), spawns a collapse FX, and destroys the shrine entity.
*   **Parameters:**  
    `worker` (Entity) — the entity that finished hammering.  
*   **Returns:** Nothing.

### `on_worked(inst, worker, workleft)`
*   **Description:** Called on each hit. Drops the offering (if present) and empties the shrine; plays animation unless already burnt.
*   **Parameters:**  
    `worker` (Entity) — the entity hammering.  
    `workleft` (number) — remaining hit count.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onremove` (on offering entity) — triggers `MakeEmpty`.  
  `onbuilt` — triggers `on_built`.  
  `ondeconstructstructure` — triggers `DropOffering`.  
  `timerdone` — triggers `ontimedone` for sound scheduling during placement.  
- **Pushes:**  
  `ms_snakeshrineactivated` — after successfully setting an offering.  
  `ms_snakeshrinedeactivated` — after dropping or removing an offering.  
  `on_loot_dropped` — via `lootdropper` during deconstruction or burn.  
  `loot_prefab_spawned`, `onextinguish`, etc., via internal component callbacks.