---
id: SGworm
title: Sgworm
description: Stategraph for the Worm character that manages its transformation between a dormant underground mound and an active above-ground worm state, handling movement, combat, eating, luring, and state transitions.
tags: [locomotion, combat, ai, transformation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f6c4906e
system_scope: ai
---

# Sgworm

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGworm` stategraph governs the behavior and animations of the Worm character in Don't Starve Together. It orchestrates transitions between three primary modes: dormant (`idle`), active (`walk`, `attack`, `eat`, `taunt`), and lure mode (`lure_enter`, `lure`, `lure_exit`). The stategraph integrates with core components (`health`, `combat`, `locomotor`, `burnable`, `pickable`, `sanityaura`) to manage physics, gameplay interactions, and state-specific behaviors. It includes handlers for common events like death, electrocution, freezing, and locomotion, and leverages `CommonStates` to extend its functionality.

## Usage example
```lua
-- Typically used internally by the Worm prefab to manage its state machine.
-- A modder would not usually instantiate this directly, but may override its states:
local SG = require("stategraphs/SGworm")
-- Add a custom state handler or override in a mod's prefabs file.
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `burnable`, `pickable`, `sanityaura`, `lootdropper`  
**Tags added/removed:** `idle`, `invisible`, `dirt`, `noelectrocute`, `busy`, `nohit`, `moving`, `canrotate`, `attack`, `hit`, `taunting`, `lure`, `fireimmune`  
**Tags handled via `inst.sg:HasStateTag(...)` / `inst.sg:AddStateTag(...)` / `inst.sg:HasAnyStateTag(...)`**

## Properties
No public properties are defined in this stategraph. State memory is stored in `inst.sg.statemem` (e.g., `walking`, `islure`) and entity properties (e.g., `inst.lastluretime`).

## Main functions
### `ChangeToLure(inst)`
*   **Description:** Transitions the Worm into lure mode by enabling pickup, switching to inventory-scale physics, and suppressing sanity aura (sets to `0`).
*   **Parameters:** `inst` (Entity) – the worm entity instance.
*   **Returns:** Nothing.

### `ChangeToWorm(inst)`
*   **Description:** Reverts the Worm to active mode by disabling pickup, switching to full-scale character physics, and applying a small negative sanity aura (`-TUNING.SANITYAURA_SMALL`).
*   **Parameters:** `inst` (Entity) – the worm entity instance.
*   **Returns:** Nothing.

### `ExtinguishFire(inst)`
*   **Description:** Temporarily enables fast extinguish mode and immediately extinguishes fire on the worm, while adding the `fireimmune` tag to prevent re-ignition.
*   **Parameters:** `inst` (Entity) – the worm entity instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `burnable` component is missing.

### `doattackfn(inst, data)`
*   **Description:** Initiates an attack if the worm is not already in a `busy` state or dead. Selects `attack_pre` (if in `lure` mode) or `attack` state.
*   **Parameters:**  
    *   `inst` (Entity) – the worm entity instance.  
    *   `data` (table) – event data (unused).  
*   **Returns:** Nothing.

### `onattackedfn(inst, data)`
*   **Description:** Handles incoming damage by attempting electrocution, then transitioning to the `hit` state unless the worm is dead, invisible, busy, or in a `nohit` state.
*   **Parameters:**  
    *   `inst` (Entity) – the worm entity instance.  
    *   `data` (table) – event data (unused).  
*   **Returns:** Nothing.

### `kill_loop_sound(inst)`
*   **Description:** Terminates the `custom_loop` sound (e.g., movement or lure hum) on state exit.
*   **Parameters:** `inst` (Entity) – the worm entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    * `locomote` – triggers walk transitions (`walk_start`, `walk`, `walk_stop`).  
    * `doattack` – initiates attack sequence.  
    * `attacked` – triggers hit state.  
    * `dolure` – enters lure mode (`lure_enter`).  
    * `animover` – advances states on animation completion (common across states).  
    * Standard lifecycle events from `CommonHandlers`: `death`, `sleep`, `freeze`, `voidfall`, `electrocute`.  
- **Pushes:**  
    * Events are not directly pushed by this stategraph itself; actions are performed via component methods (e.g., `PerformBufferedAction`).  
    * Entity events like `onextinguish` may be indirectly triggered via `burnable:Extinguish()`.  
