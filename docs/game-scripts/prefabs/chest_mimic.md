---
id: chest_mimic
title: Chest Mimic
description: A transformable chest entity that hides as a loot chest and attacks players upon opening, functioning as both a container and a hostile monster.
tags: [combat, ai, container, transformation, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 43a3153f
system_scope: entity
---

# Chest Mimic

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `chest_mimic` is a transformable prefab that initially behaves as a non-hostile container (`pandoraschest` variant) but transforms into a hostile monster (`chest_mimic_revealed`) after a delay when opened. It leverages the `container`, `combat`, `thief`, `inventory`, and `lootdropper` components to manage state transitions, item handling, and combat logic. It also integrates with scenario systems via `scenariorunner` and tracks respawn positions via `entitytracker`.

## Usage example
```lua
-- Example of spawning a chest mimic in the world
local chest = SpawnPrefab("chest_mimic")
chest.Transform:SetPosition(x, y, z)

-- The mimic will automatically transform if a player opens its container
-- No further action required for basic mimicry behavior
```

## Dependencies & tags
**Components used:** `container`, `entitytracker`, `hauntable`, `inspectable`, `combat`, `eater`, `health`, `inventory`, `knownlocations`, `locomotor`, `lootdropper`, `planardamage`, `planarentity`, `sanityaura`, `thief`, `timer`, `scenariorunner`

**Tags added (mimic form):** `canbestartled`, `chessfriend`, `chestmonster`, `hostile`, `monster`, `scarytooceanprey`, `scarytoprey`, `shadow_aligned`, `wooden`

**Tags added (tracker form):** `CLASSIFIED`

**Tags handled:** `irreplaceable` (removed/dropped on reset), `shadowheart`, `slingshot_band_tentacle` (morphed on death)

## Properties
No public properties are initialized in the constructor. Internal state is managed via `inst._transform_task` and `inst._mimic_dead` (tracker only).

## Main functions
### `do_transform(inst, data)`
*   **Description:** Transforms the chest into `chest_mimic_revealed` after a 2.5-second delay. Transfers all container contents to the monster's inventory, sets the attacker as the combat target (if provided), and spawns the revealed form at the original position.
*   **Parameters:**  
    - `inst` (Entity) - the chest entity.  
    - `data` (table) - optional; if present and contains `doer`, sets the combat target to that entity.
*   **Returns:** Nothing.

### `initiate_transform(inst, data)`
*   **Description:** Schedules a delayed transformation via `do_transform`. Ensures only one transformation task runs at a time.
*   **Parameters:**  
    - `inst` (Entity) - the chest entity.  
    - `data` (table) - passed to `do_transform` on execution.
*   **Returns:** Nothing.

### `create_tracker_at_my_feet(inst)`
*   **Description:** Ensures a `chest_mimic_ruinsspawn_tracker` entity exists at the chest's current position for tracking the spawn point across world resets (e.g., `resetruins` event).
*   **Parameters:** `inst` (Entity) - the chest entity.
*   **Returns:** Nothing.

### `OnRevealedAttacked(inst, data)`
*   **Description:** Handler for when the revealed mimic is attacked. Sets the attacker as the combat target and extends the "angry" timer (up to 15 seconds).
*   **Parameters:**  
    - `inst` (Entity) - the revealed mimic.  
    - `data` (table) - contains `attacker` (Entity).
*   **Returns:** Nothing.

### `TryTransformBack(inst)`
*   **Description:** Transforms the revealed mimic back into a regular chest (`chest_mimic`) when a `peek` event occurs. Transfers inventory contents back to the chest container.
*   **Parameters:** `inst` (Entity) - the revealed mimic.
*   **Returns:** Nothing.

### `loot_setup_fn(lootdropper)`
*   **Description:** Modifies the mimic's drop loot upon death: if the mimic holds a morphable item (`shadowheart` or `slingshot_band_tentacle`), replaces it with the corresponding infused/mimic variant in the loot table.
*   **Parameters:** `lootdropper` (Component) - the lootdropper component instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    - `attacked` (revealed form) - triggers `OnRevealedAttacked`.
    - `peek` (revealed form) - triggers `TryTransformBack`.
    - `death` (revealed form) - triggers `OnRevealedDeath`.
    - `resetruins` (both forms) - handles respawn logic, scenario setup, and position restoration.
    - `mimic_died` (tracker form) - marks tracker state (`_mimic_dead = true`).

- **Pushes:**
    - `mimic_died` (revealed form) - pushed to the tracker on death to notify it.
    - `onclose`, `onopen` - via `container` component (indirectly via listeners).
