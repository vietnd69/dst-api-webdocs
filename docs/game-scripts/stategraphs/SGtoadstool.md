---
id: SGtoadstool
title: Sgtoadstool
description: Implements the full state machine for the Toadstool boss, handling movement, combat attacks (pound, spore bomb, mushroom bomb), channeling with mushroom sprouts, camera shake, and entity interactions during its lifecycle.
tags: [combat, ai, boss, stategraph, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7b9d641f
system_scope: entity
---

# Sgtoadstool

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtoadstool` defines the complete state graph for the Toadstool boss entity in DST. It orchestrates all of the Toadstool’s behaviors—including walking, burrowing, attacking (pounding, spore bombs, mushroom bombs), and channeling (which spawns mushroom sprouts and affects nearby entities)—through a rich set of interconnected states. It interacts closely with components like `health`, `combat`, `locomotor`, `epicscare`, `groundpounder`, `sanityaura`, `workable`, and `timer`, and leverages shared utility functions from `commonstates` for sleep, freeze, electrocution, and corpse handling.

## Usage example
This state graph is attached internally to the Toadstool prefab via `return StateGraph("toadstool", states, events, "init")` and is not added manually by modders. To influence Toadstool behavior, modders should override components or listen for events like `doattack`, `roar`, `startchanneling`, or `flee`.

## Dependencies & tags
**Components used:**  
`health`, `combat`, `locomotor`, `epicscare`, `groundpounder`, `sanityaura`, `timer`, `workable`  
**Tags:**  
Adds `busy`, `nosleep`, `nofreeze`, `noattack`, `noelectrocute`, `moving`, `canrotate`, `roar`, `channeling`, `hit`, `attack`, `sporebombing`, `mushroombombing`, `pounding`, `idle`.  
Removes `NOCLICK` and light/shadow overrides on exit.

## Properties
No public properties defined. State memory (`inst.sg.mem`) and state-specific data (e.g., `targets`, `mushroomsprout_angles`, `pound_speed`) are stored in the state graph’s memory table.

## Main functions
This file does not define new component classes or instance methods. Instead, it exports a `StateGraph` table. All functional logic resides within state event handlers (`onenter`, `onexit`, `onupdate`, `timeline`, `events`) and supporting local functions.

### Supporting local functions (used in timelines/events):
### `DestroyStuff(inst)`
*   **Description:** Destroys nearby workable entities within 3 radius, excluding those with tags in `DESTROYSTUFF_IGNORE_TAGS` and net-related actions. Spawns a small collapse FX and calls `workable:Destroy`.
*   **Parameters:** `inst` (entity) — the Toadstool triggering destruction.
*   **Returns:** Nothing.

### `SmallLaunch(inst, launcher, basespeed)`
*   **Description:** Applies a physics velocity to `inst` (typically a player or item), launching it away from the launcher with randomized direction and magnitude based on `basespeed`.
*   **Parameters:**  
    `inst` (entity) — the target to launch.  
    `launcher` (entity) — the Toadstool source of the force.  
    `basespeed` (number) — base velocity multiplier.
*   **Returns:** Nothing.

### `BounceStuff(inst)`
*   **Description:** Finds nearby inventory items (must have `_inventoryitem` tag, no `locomotor` or `INLIMBO` tags), and launches them if they are not marked `nobounce` or recently bounced. Uses distance-based intensity clamped to `[0, 1]`.
*   **Parameters:** `inst` (entity) — the Toadstool source.
*   **Returns:** Nothing.

### `ShakeIfClose(inst)`
*   **Description:** Triggers a full-strength camera shake and calls `BounceStuff`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `DoFootstep(inst)`, `DoStompstep(inst)`, `DoRoarShake(inst)`, `DoChannelingShake(inst)`, `DoSporeBombShake(inst)`, `DoMushroomBombShake(inst)`, `DoPoundShake(inst)`
*   **Description:** Various helper functions that play sounds and/or trigger specific camera shake patterns (vertical/full) and call `BounceStuff`. Names clearly indicate their state-specific usage.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ChooseAttack(inst)`
*   **Description:** High-level attack selector. Prioritizes pound if on cooldown, else spore bomb if targets exist and not on cooldown, else mushroom bomb if not on cooldown. Invokes `inst.sg:GoToState(...)` directly.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if an attack state was transitioned to; `false` otherwise.

### `OnStartChannel(inst)`
*   **Description:** Starts the channeling state: initializes/continues channel timer, starts `channeltick` timer, sets a huge negative sanity aura, and stores mushroom angles.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnEndChannel(inst)`
*   **Description:** Ends channeling: kills looping sound, cancels shake task, pauses timers, sets cooldowns, clears memory, and resets sanity aura to `0`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnTickChannel(inst)`
*   **Description:** Called periodically during channel: spawns mushroom sprouts, scares entities nearby, and restarts the `channeltick` timer.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ClearRecentlyBounced(inst, other)`
*   **Description:** Removes `other` from the `recentlybounced` table after a delay, preventing repeated bouncing of the same entity.
*   **Parameters:** `inst` (entity), `other` (entity).
*   **Returns:** Nothing.

## Events & listeners
**Listens to:**  
`doattack`, `attacked`, `roar`, `startchanneling`, `flee`, `timerdone`, `animover`, `corpsechomped`, `freezestart`, `freezefinish`, `electrocute`, `sleep`, `wake`, `falldownvoid`  
**Pushes:**  
`epicscare`, and internally reuses common event patterns (`invincibletoggle`, etc.) via `health`/`health` component interactions.

Events are primarily handled in state definitions (`events = { ... }`), with `EventHandler` and `CommonHandlers` helpers used to determine transitions and actions (e.g., interrupting channeling on hit, triggering burrow on flee).