---
id: SGcrabkingclaw
title: Sgcrabkingclaw
description: Manages the state machine for the Crab King's claw entity, handling transitions between idle, emerge, submerge, attack, hit, and death states, including AI-driven actions and animation synchronization with a shadow entity.
tags: [ai, boss, combat, stategraph, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a02d8ad2
system_scope: entity
---

# Sgcrabkingclaw

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcrabkingclaw` defines the state graph for the Crab King's claw entity in Don't Starve Together. It orchestrates behavior during combat and lifecycle events through a set of named states (`idle`, `emerge`, `submerge`, `attack`, `hit`, `death`), including animation control, physics interaction, and attack logic via `DoArcAttack`. It leverages components like `combat`, `freezable`, `health`, `locomotor`, and `lootdropper` to coordinate interactions with the world and other entities.

## Usage example
This state graph is not directly instantiated by modders. It is used internally by the `crabkingclaw` prefab to define its behavior. A typical usage in the game code involves the stategraph being returned from the file and registered as the behavior controller for a specific entity.

```lua
-- This is how the game internally references the stategraph:
return StateGraph("crabkingclaw", states, events, "idle", actionhandlers)
```

## Dependencies & tags
**Components used:** `combat`, `freezable`, `health`, `locomotor`, `lootdropper`
**Tags:** The state graph defines and manipulates state tags including `idle`, `canrotate`, `busy`, `nointerrupt`, `noattack`, `invisible`, `temp_invincible`, `hit`. It also imports common state handlers (`OnLocomote`, `OnFreeze`, `OnElectrocute`, `OnDeath`) from `commonstates`.

## Properties
No public properties.

## Main functions
This file returns a `StateGraph` definition and does not expose standalone functions for direct use by modders. However, it defines two internal helper functions used within state logic.

### `DoArcAttack(inst, radius, arc, arcoffset, targets)`
*   **Description:** Computes a cone-shaped area-of-effect attack centered on the entity's facing direction. Targets within the cone and radius (with padding) that meet tag requirements and pass combat validation are attacked via `combat:DoAttack`.
*   **Parameters:**  
  - `inst` (`Entity`) – The entity performing the attack (the claw).  
  - `radius` (`number`) – Effective attack radius in tiles.  
  - `arc` (`number`) – Total cone angle in degrees.  
  - `arcoffset` (`number`) – Rotation offset added to the entity's facing angle.  
  - `targets` (`table`) – A table used to track already-hit targets (prevents double hits in one attack).
*   **Returns:** Nothing.
*   **Error states:** Targets are skipped if they are invalid, in limbo, dead, or fail `combat:CanTarget`. Combat component flags `ignorehitrange` are temporarily set to `true` during search.

### `play_shadow_animation(inst, anim, loop)`
*   **Description:** Plays a given animation on the main entity and, if present, on its associated shadow entity (a child `inst.shadow`).
*   **Parameters:**  
  - `inst` (`Entity`) – The owning entity.  
  - `anim` (`string`) – Animation name.  
  - `loop` (`boolean`) – Whether to loop the animation.
*   **Returns:** Nothing.

### `push_shadow_animation(inst, anim, loop)`
*   **Description:** Pushes a given animation onto the queue of the main entity and, if present, on its shadow entity.
*   **Parameters:** Same as `play_shadow_animation`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `animover` – Triggers state transitions when animations complete (used in `idle`, `emerge`, `submerge`, `attack`, `hit`, `death`).
  - `attacked` – May interrupt to `hit` state unless `busy` with no interruption permission or frozen.
  - `doattack` – Requests an immediate transition to `attack` state (if not busy/dead).
  - `emerge` – Requests transition to `emerge` state (unless `nointerrupt` or dead).
  - `submerge` – Requests transition to `submerge` state; may defer if busy and not frozen by storing `wantstosubmerge`.
  - Common event handlers imported via `CommonHandlers`: `OnLocomote`, `OnFreeze`, `OnElectrocute`, `OnDeath`.
- **Pushes:** None defined directly in this stategraph. It reacts to events rather than emitting custom ones.
