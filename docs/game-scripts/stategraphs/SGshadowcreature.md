---
id: SGshadowcreature
title: Sgshadowcreature
description: Manages the state machine and behavior of shadow-based entities, including movement, combat transitions, teleportation, and despawning logic.
tags: [ai, stategraph, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1d342194
system_scope: entity
---

# Sgshadowcreature

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowcreature` defines the stategraph for shadow-themed entities (e.g., Terrorbeak). It orchestrates behavioral transitions between idle, movement, attack, hit, taunt, death, and teleport states. It integrates with the `combat`, `health`, `locomotor`, and `lootdropper` components to implement AI-driven combat logic, particle effects, sound management, and loot generation upon death or teleportation. The stategraph also handles dynamic target dropping, forced despawn conditions, and special teleport-to-sea mechanics used in certain boss encounters.

## Usage example
```lua
-- Typically assigned automatically via the entity prefab definition, not manually added.
-- Example internal usage in a prefab:
inst:AddStateGraph("shadowcreature")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`
**Tags:** Checks/tags include: `idle`, `canrotate`, `attack`, `busy`, `hit`, `teleporting`, `noattack`, `NOCLICK`. Also uses `inst:AddTag("NOCLICK")` and `inst:RemoveTag("NOCLICK")`.

## Properties
No public properties.

## Main functions
### `canteleport(inst)`
*   **Description:** Determines whether the entity is allowed to teleport, based on current state and health.
*   **Parameters:** `inst` (Entity) - the entity instance.
*   **Returns:** Boolean (`true` if teleport is permitted, `false` otherwise).
*   **Error states:** Returns `false` if currently attacking, being hit, teleporting, marked as `noattack`, or dead.

### `PlayExtendedSound(inst, soundname)`
*   **Description:** Plays a sound and registers a delayed callback to remove it from cache and potentially trigger entity removal if no sounds remain.
*   **Parameters:** `soundname` (string) - name of the sound to play.
*   **Returns:** Nothing.

### `FinishExtendedSound(inst, soundid)`
*   **Description:** Callback used to terminate an extended sound by ID and check if the entity can be safely removed.
*   **Parameters:** `soundid` (number) - unique ID of the sound to stop.
*   **Returns:** Nothing.

### `OnAnimOverRemoveAfterSounds(inst)`
*   **Description:** Handles cleanup after an animation completes — either removes the entity if no extended sounds are playing, or hides it and marks for deferred removal.
*   **Parameters:** `inst` (Entity) - the entity instance.
*   **Returns:** Nothing.

### `TryDropTarget(inst)`
*   **Description:** Attempts to drop the current combat target if the entity does not have a `ShouldKeepTarget` override or if the target no longer meets retention criteria.
*   **Parameters:** `inst` (Entity) - the entity instance.
*   **Returns:** Boolean (`true` if target was dropped, `false` otherwise).

### `TryDespawn(inst)`
*   **Description:** Triggers the `"disappear"` state if forced despawn is requested or if the entity wishes to despawn and has no active target.
*   **Parameters:** `inst` (Entity) - the entity instance.
*   **Returns:** Boolean (`true` if state transition was initiated, `false` otherwise).

## Events & listeners
- **Listens to:** `attacked`, `death`, `doattack`, `teleport_to_sea`, `animover`, `animqueueover`, `onlocomote`.
- **Pushes:** None directly — relies on stategraph event propagation (`GoToState`) and component events (`droppedtarget` via `combat`).
- **Event handlers defined:**
  - `"attacked"` → transitions to `"hit"` state if allowed.
  - `"death"` → transitions to `"death"` state.
  - `"doattack"` → initiates `"attack"` state with provided target.
  - `"teleport_to_sea"` → initiates teleport sequence if `canteleport` allows.
  - `"animover"` and `"animqueueover"` → drive state transitions based on animation completion.
  - `"onlocomote(false, true)"` → added via `CommonHandlers`, enables walking state transitions.