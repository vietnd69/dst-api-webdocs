---
id: SGsquid
title: Sgsquid
description: Defines the state machine and state transitions for the Squid aquatic creature, handling movement, combat, fishing interactions, breathing, and amphibious transitions.
tags: [ai, combat, swimming, fishing, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b3aafae9
system_scope: ai
---

# Sgsquid

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGsquid` is a state graph for the Squid entity that governs its behavioral transitions across idle, movement (running), attacking, fishing, jumping (breaching), and death states. It integrates deeply with the `amphibiouscreature`, `combat`, `locomotor`, `burnable`, `oceanfishable`, and `timer` components to handle complex amphibious locomotion, ink-spitting combat, and rod-hooked fishing interactions. The state machine includes support for entering/exiting water, lighting control via the `fader` component, and multi-stage states for hook-based fishing minigame mechanics.

## Usage example
This state graph is automatically instantiated by the engine when a Squid entity (e.g., `prefabs/squid.lua`) is spawned. It does not require manual instantiation by modders. However, modders may extend its behavior by:
- Adding custom states to the `states` array before `CommonStates` helpers are applied.
- Overriding event handlers in `events` for custom combat or fishing logic.
- Modifying tuning values like `TUNING.SQUID_RUNSPEED` or `TUNING.SQUID_LIGHT_*` parameters used in internal helpers.

## Dependencies & tags
**Components used:** `amphibiouscreature`, `burnable`, `combat`, `eater`, `fader`, `health`, `herdmember`, `herd`, `locomotor`, `oceanfishable`, `oceanfishingrod`, `timer`  
**Tags added/removed:** `swimming`, `NOCLICK`, `busy`, `idle`, `canrotate`, `moving`, `running`, `attack`, `hit`, `jumping`, `sleeping`, `noelectrocute`, `partiallyhooked`  
**Tags checked:** `swimming`, `oceanfish`, `oceanfishable`, `partiallyhooked`, `hiding`

## Properties
No public properties are defined on this state graph itself. Internally used state memory is stored via `inst.sg.statemem`, e.g., `target`, `inkpos`, `miss`, `not_interrupted`.

## Main functions
### `dimLight(inst, dim, instant, zero, time)`
*   **Description:** Controls the Squid’s eye-light intensity, radius, and falloff via the `fader` component, supporting smooth transitions between bright (up) and dim (down) states. Used when entering water, spawning/despawning, and during `run` states.
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.  
    * `dim` (boolean) — if `true`, dims light to underwater levels; otherwise brightens to surface levels.  
    * `instant` (boolean) — if `true`, applies light values immediately without fading.  
    * `zero` (boolean) — if `true` and `dim == false`, initializes from zero intensity (used on first spawn).  
    * `time` (number, optional) — override animation frame duration; defaults to `5 * FRAMES`.
*   **Returns:** Nothing.

### `testExtinguish(inst)`
*   **Description:** Immediately extinguishes fire on the Squid if it is swimming and currently burning.
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.
*   **Returns:** Nothing.

### `UpdateRunSpeed(inst)`
*   **Description:** Dynamically reduces the Squid’s run speed when pulling against high tension from a fishing rod (i.e., when hooked and facing away from the angler). Also resets speed when rod is detached.
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.
*   **Returns:** Nothing.

### `setdivelayering(inst, under)`
*   **Description:** Adjusts rendering layer and sort order for underwater visibility. When `under` is `true` and the Squid is swimming, renders below the ocean surface (`LAYER_WIP_BELOW_OCEAN`).
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.  
    * `under` (boolean) — whether to apply underwater layering.
*   **Returns:** Nothing.

### `RestoreCollidesWith(inst)`
*   **Description:** Resets collision mask to default (WORLD, OBSTACLES, etc.) after special movement states (e.g., flinging) temporarily restrict collisions.
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.
*   **Returns:** Nothing.

### `AddNoClick(inst)` / `RemoveNoClick(inst)`
*   **Description:** Adds or removes the `NOCLICK` tag to prevent player interaction (e.g., during `gobble`, `spawn`, `despawn`).
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.
*   **Returns:** Nothing.

### `GoToIdle(inst)`
*   **Description:** Helper to transition back to the `idle` state.
*   **Parameters:**  
    * `inst` (Entity) — the Squid entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers `hit` state or electrocution if applicable; prevents interruption during `attack` or `electrocute`.
  - `doattack` — initiates `attack` state if not busy/hit/electrocuted.
  - `doink` — initiates `shoot` state if not busy/hit/electrocuted.
  - `spawn` — transitions to `spawn` state.
  - `death` — handled via `CommonHandlers.OnDeath()` for standard death logic.
  - `sleep`, `hop`, `locomote`, `freeze`, `electrocute` — via `CommonHandlers`.
  - `animover`, `animqueueover`, `ontimeout` — used throughout state timelines for state transitions.
  - `onremove` — for rod cleanup in fishing states.

- **Pushes:**
  - `attacked` — when a hooked fish escapes and attacks the angler (during `gobble` success).
  - `dobreach` — when a fish breaches successfully but the Squid misses.
  - Standard `onextinguish`, `death`, and `animover` events via common handlers.
