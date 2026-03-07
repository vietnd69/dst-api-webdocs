---
id: hermitcrab_relocation_manager
title: Hermitcrab Relocation Manager
description: Manages teleportation and rotation-aware positioning of Hermitcrab-related entities (pearls and structures) relative to Monkey Island during world loading and relocation.
tags: [locomotion, map, relocation, worldgen, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d9f1d9c6
system_scope: world
---

# Hermitcrab Relocation Manager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HermitcrabRelocationManager` is a server-side component responsible for aligning and relocating Hermitcrab-related entities (e.g., `hermitcrab`, `hermithouse2`, `meatrack_hermit`, fishing markers) to their correct positions and orientations within the Monkey Island setpiece. It calculates the world-space rotation of Monkey Island using `monkeyqueen` and `monkeyportal` as reference points, applies transformations to hardcoded tile-relative coordinates, and performs animated teleportation of entities when relocation is triggered. It interacts closely with the `locomotor` component to stop movement before teleportation.

## Usage example
```lua
-- Typically added automatically to TheWorld upon Hermitcrab-related content detection
-- No manual usage is intended for modders
-- Key events it responds to:
TheWorld:PushEvent("ms_register_hermitcrab", my_hermit_crab)
TheWorld:PushEvent("ms_register_pearl_entity", my_pearl_entity)
TheWorld:PushEvent("ms_hermitcrab_wants_to_teleport", some_entity)
```

## Dependencies & tags
**Components used:** `locomotor` (`Clear`, `Stop`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Owner entity (typically `TheWorld`) |
| `PEARLSETPIECE_MONKEYISLAND` | `table` | Hardcoded mapping | Static layout coordinates (x, z, rot) for each prefab relative to island center |
| `pearlsentities` | `table` | `{}` | Registry of tracked pearl-related entities (`hermitcrab`, `hermitcrab_marker`, etc.) |
| `hermitcrab` | `Entity?` | `nil` | Reference to the main `hermitcrab` entity |
| `monkeyqueen` | `Entity?` | `nil` | Reference to `monkeyqueen` entity used to compute island rotation |
| `monkeyportal` | `Entity?` | `nil` | Reference to `monkeyportal` entity used to compute island rotation |
| `storedangle_monkey` | `number?` | `nil` | Computed rotation angle (degrees) of Monkey Island relative to world |
| `storedx_monkey`, `storedz_monkey` | `number?` | `nil` | World tile-center coordinates of the reference point for layout offset |
| `pearlmovingdata` | `table?` | `nil` | Maps each teleporting entity to its destination data (`x`, `z`, `rot`, `delay`, `fxprefab`, etc.) |
| `initiatedpearlmove` | `boolean?` | `nil` | Flag indicating whether a teleport sequence has been initiated |
| `appliedrotationtransformation` | `boolean` | `false` | Flag indicating whether rotation transformation has been applied to layout |

## Main functions
### `RegisterHermitCrab(ent)`
*   **Description:** Registers the main Hermitcrab entity for tracking and enables special handling during teleportation.
*   **Parameters:** `ent` (`Entity`) — The `hermitcrab` prefab instance.
*   **Returns:** Nothing.
*   **Error states:** Registers a one-time callback on removal; overwriting an existing reference is not allowed.

### `RegisterPearlEntity(ent)`
*   **Description:** Registers any pearl-related entity (e.g., markers, structures, bait) for tracking and inclusion in relocation.
*   **Parameters:** `ent` (`Entity`) — Any `hermitcrab_*` or `meatrack_hermit`/`beebox_hermit` entity.
*   **Returns:** Nothing.

### `RegisterMonkeyQueen(ent)`
*   **Description:** Registers the `monkeyqueen` entity used to compute Monkey Island’s rotation angle.
*   **Parameters:** `ent` (`Entity`) — The `monkeyqueen` entity.
*   **Returns:** Nothing.
*   **Error states:** Fails with `self.failed = true` if a second `monkeyqueen` is registered.

### `RegisterMonkeyPortal(ent)`
*   **Description:** Registers the `monkeyportal` entity used to compute Monkey Island’s rotation angle.
*   **Parameters:** `ent` (`Entity`) — The `monkeyportal` entity.
*   **Returns:** Nothing.
*   **Error states:** Fails with `self.failed = true` if a second `monkeyportal` is registered.

### `TryToApplyRotationTransformation()`
*   **Description:** Computes or retrieves the Monkey Island rotation using `monkeyqueen` and `monkeyportal`, then applies the rotation transformation to all layout coordinates in `PEARLSETPIECE_MONKEYISLAND`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if transformation succeeded, `false` otherwise (e.g., missing entities or too many modded entities).
*   **Error states:** May log warnings and announce to staging builds if required entities are missing or duplicated.

### `SetupMovingPearlToMonkeyIsland()`
*   **Description:** Initiates teleport setup using the computed Monkey Island layout and stored position/rotation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Notes:** Calls `SetupTeleportingPearlToSetPieceData()` with the pre-transformed layout.

### `CanPearlMove()`
*   **Description:** Checks whether a teleport sequence can be started (i.e., no prior teleport is in progress).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if teleporting is currently safe to begin.

### `InitiatePearlTeleport()`
*   **Description:** Starts the animated teleport sequence for all registered pearl entities.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Notes:** Iterates over `pearlsentities` and schedules `TeleportingStep_*` callbacks for FX and animation synchronization.

### `OnFinishedTeleportPearlEntity(ent, deleted)`
*   **Description:** Final step after teleport completes; removes event callbacks, fires `teleported`, and checks for teleport completion across all entities.
*   **Parameters:**  
    `ent` (`Entity`) — The entity that finished teleporting.  
    `deleted` (`boolean`) — Whether the entity was removed during teleport.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes state (e.g., rotation angle, currently teleporting entities) for world save.
*   **Parameters:** None.
*   **Returns:** `data` (`table`), `ents` (`table of GUIDs`) — Save data and entity GUIDs involved in teleport.

### `OnLoad(data)`
*   **Description:** Restores saved state (e.g., rotation angle) on world load.
*   **Parameters:** `data` (`table?`) — Save data from `OnSave()`.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Completes post-load teleportation setup by reconstructing `pearlmovingdata` from saved entity GUIDs and re-initiating teleport if needed.
*   **Parameters:**  
    `newents` (`table`) — Mapped GUID → entity lookup table from `WorldGen`.  
    `savedata` (`table`) — Deserialized `movingents` array.
*   **Returns:** Nothing.

### `GetPearl()`
*   **Description:** Returns the registered `hermitcrab` entity.
*   **Parameters:** None.
*   **Returns:** `Entity?` — The main hermitcrab entity, or `nil`.

### `GetPearlsHouse()`
*   **Description:** Returns the first registered hermit crab house entity (`hermithouse*` or `hermithouse_construction*`).
*   **Parameters:** None.
*   **Returns:** `Entity?` — House entity, or `nil`.

### `GetPearlsFishingMarkers()`
*   **Description:** Returns all registered fishing marker entities (`hermitcrab_marker_fishing`).
*   **Parameters:** None.
*   **Returns:** `table of Entity` — Array of fishing marker entities.

## Events & listeners
- **Listens to:**
  - `ms_register_hermitcrab` (`inst`, `ent`) — Registers the hermitcrab entity.
  - `ms_register_pearl_entity` (`inst`, `ent`) — Registers a pearl-related entity.
  - `ms_register_monkeyisland_portal` (`inst`, `ent`) — Registers the `monkeyportal`.
  - `ms_register_monkeyqueen` (`inst`, `ent`) — Registers the `monkeyqueen`.
  - `ms_hermitcrab_wants_to_teleport` (`inst`, `ent`) — Triggers teleport if not already in progress.
  - `onremove` — On any registered pearl entity, house, or queen/portal removal (to clear references).

- **Pushes:**
  - `teleport_move` — Fired by each entity at start of teleport animation.
  - `teleported` — Fired by each entity after teleport completes.
  - `ms_hermitcrab_relocated` — Fired on world when all teleporting entities have finished.
