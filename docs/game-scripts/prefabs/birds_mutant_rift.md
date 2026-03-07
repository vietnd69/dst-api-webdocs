---
id: birds_mutant_rift
title: Birds Mutant Rift
description: A lunar-aligned, planar-damaging bird creature that enters a brilliance cooldown state after consuming certain items and emits visual effects based on its cooldown status.
tags: [combat, environment, ai, planar]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 932e3971
system_scope: entity
---

# Birds Mutant Rift

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`birds_mutant_rift` is a prefab definition for a specialized bird entity that spawns during rift-related events in DST. It combines physical mobility, combat capabilities, and planar damage mechanics with a unique brilliance cooldown system. The entity is designed to be non-pickupable but storable (e.g., in traps), and it interacts with the `birdspawner` component to track its lifecycle. Key behaviors include consuming lunar shards, applying planar damage on attack, and emitting light/bloom effects on its gem symbol that change based on the brilliance cooldown timer.

## Usage example
This is a prefab definition file, not a reusable component. It is instantiated internally by the game when the `mutatedbird` prefab is requested. Standard modding usage involves referencing or overriding its functions:

```lua
-- Example: Check if a specific mutated rift bird is on brilliance cooldown
if myBirdEntity:IsOnBrillianceCooldown() then
    print("Bird is currently on brilliance cooldown")
end

-- Example: Put a mutated rift bird on brilliance cooldown manually
myBirdEntity:PutOnBrillianceCooldown()
```

## Dependencies & tags
**Components used:** `inspectable`, `occupier`, `eater`, `locomotor`, `health`, `entitytracker`, `timer`, `combat`, `planarentity`, `planardamage`, `inventoryitem`, `lootdropper`, `knownlocations`.

**Tags added:** `soulless`, `bird`, `lunar_aligned`, `smallcreature`, `bird_mutant_rift`, `gestaltmutant`.

**Tags checked:** None identified (tags are only added).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds` | table | see `sounds` constant | Sound event names mapped to paths (e.g., `chirp`, `attack`). |
| `flyawaydistance` | number | `TUNING.BIRD_SEE_THREAT_DISTANCE` | Distance at which the bird flies away on detecting threat. |
| `_infused_eaten` | number | `0` | Counter tracking how many infused items (e.g., pure brilliance) have been eaten. |
| `clear_buildup_in_one` | boolean | `true` | Flag indicating whether buildup resets in one step. |
| `trappedbuild` | string | `"bird_lunar_build"` | Build name used when the entity is trapped (e.g., in a birdcage). |
| `scrapbook_adddeps` | table | `{"lunarthrall_plant_gestalt"}` | Dependencies required to unlock scrapbook entries for this entity. |

## Main functions
### `IsOnBrillianceCooldown(inst)`
* **Description:** Checks whether the bird is currently on brilliance cooldown.
* **Parameters:** `inst` (Entity) — the entity instance (usually `self.inst`).
* **Returns:** `boolean` — `true` if the `brilliancecooldown` timer exists, otherwise `false`.

### `UpdateBrillianceVisual(inst, cage)`
* **Description:** Updates visual bloom and light override states for the bird's gem symbol based on cooldown status. If `cage` is provided (e.g., when trapped), visuals are updated on both the bird and the cage.
* **Parameters:**  
  - `inst` (Entity) — the bird entity.  
  - `cage` (Entity?) — optional cage entity (e.g., when trapped).
* **Returns:** Nothing.  
* **Error states:** No known edge cases; always applies consistent visual state.

### `PutOnBrillianceCooldown(inst, cage)`
* **Description:** Initiates the brilliance cooldown by starting the `brilliancecooldown` timer and resetting buildup state (`_infused_eaten = 0`), then updating visuals.
* **Parameters:**  
  - `inst` (Entity) — the bird entity.  
  - `cage` (Entity?) — optional cage entity for visual sync.
* **Returns:** Nothing.

### `SetBirdTrapData(inst)`
* **Description:** Serializes cooldown state for saving when the bird is trapped. Used by `occupier`/trap systems.
* **Parameters:** `inst` (Entity).
* **Returns:** `table?` — `nil` if no cooldown exists; otherwise `{ brilliance_cooldown = t }`, where `t` is remaining time in seconds.

### `RestoreBirdFromTrap(inst, data)`
* **Description:** Restores bird state upon untrapping, restarting the brilliance timer if cooldown data is present.
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — trap data containing `brilliance_cooldown`.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Event handler called when the `brilliancecooldown` timer completes. Triggers visual refresh (removes bloom, dims lights).
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — event data, expected to contain `name = "brilliancecooldown"`.
* **Returns:** Nothing.

### `OnDeath(inst)`
* **Description:** Cleans up visual effects (bloom, light overrides) associated with the bird's gem when the entity dies.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes the `_infused_eaten` counter for world save persistence.
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — save data table passed by the game.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the `_infused_eaten` counter from save data on entity load.
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — loaded save data.
* **Returns:** Nothing.

### `OnDropped(inst)`
* **Description:** Callback triggered when the bird is dropped (e.g., from a trap). Transitions the stategraph to `"stunned"`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnTrapped(inst, data)`
* **Description:** Callback for trap-related events. Updates trap symbols on the trapping entity (e.g., birdcage) using `data.trapper.settrapsymbols`.
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — event data, may contain `trapper`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"ontrapped"` — triggers `OnTrapped`.  
  - `"timerdone"` — triggers `OnTimerDone`.  
  - `"death"` — triggers `OnDeath`.  
  - `"onremove"` and `"enterlimbo"` — delegates to `birdspawner.StopTrackingFn` (if `birdspawner` component exists).  

- **Pushes:** None identified.