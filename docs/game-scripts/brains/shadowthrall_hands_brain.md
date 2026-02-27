---
id: shadowthrall_hands_brain
title: Shadowthrall Hands Brain
description: Controls the AI behavior of Shadow Thrall's hands, managing attack timing coordination with allies, movement, and combat initiation.
tags: [ai, combat, coordination, boss]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 85b4a6b0
---

# Shadowthrall Hands Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component implements the behavior tree for the Shadow Thrall's hands entity. It governs coordination with the Shadow Thrall's other body parts (horns and wings) to ensure only one entity attacks at a time, preventing overlapping attacks. It uses a priority-based behavior tree (`BT`) with a custom attack-turn mechanism, wander logic, and leash constraints to manage movement relative to the target or home location. Key responsibilities include determining attack priority via `IsMyTurnToAttack`, leash positioning via `GetFormationPos`, and synchronizing attack events with the host entity's state graph.

## Usage example
This brain is typically attached to a non-player entity (e.g., the "hands" part of the Shadow Thrall boss). It is not meant to be instantiated or used directly in mod code.

```lua
-- Example usage in a prefab file (not for modder runtime use)
inst:AddBrain("shadowthrall_hands_brain")
```

## Dependencies & tags
**Components used:**  
- `combat` (`InCooldown()`, `TargetIs(target)`, `target` property)  
- `entitytracker` (`GetEntity(name)`)  
- `knownlocations` (`GetLocation(name)`)  

**Tags:** None identified.

## Properties
None defined in the constructor. All state is maintained internally in the behavior tree and `inst.sg` memory.

## Main functions
### `ShadowThrallHandsBrain:OnStart()`
* **Description:** Initializes the behavior tree root node with a priority-based structure that handles waiting for turn order, leashing and positioning, target tracking, chasing/attacking, and wandering. This method must be called during the entity's startup.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None beyond standard behavior tree execution behavior (`bt` assignment may fail if parent `Brain` initialization fails).

## Helper Functions (Internal)
These functions are defined in the script and used internally by the behavior tree:

### `GetHome(inst)`
* **Description:** Returns the spawn point location used for wandering.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Position table (`x`, `y`, `z`) or `nil` if location not set.
* **Error states:** Returns `nil` if `knownlocations` component is missing or no `"spawnpoint"` is defined.

### `GetTarget(inst)`
* **Description:** Retrieves the current combat target or, if none, returns the entity currently devoured by the horns (if the state memory exists).
* **Parameters:** `inst` (Entity instance).
* **Returns:** Target entity or `nil`.
* **Error states:** May return `nil` if `combat.target` and `"horns"` entity or its state memory are invalid.

### `IsTarget(inst, target)`
* **Description:** Checks whether the given `target` is the currently tracked combat target or the devoured entity of the horns.
* **Parameters:**  
  - `inst` (Entity instance)  
  - `target` (Entity instance or `nil`)  
* **Returns:** `true` if target matches `combat.target` or the horns' `statemem.devoured`; `false` otherwise.
* **Error states:** Returns `false` if either the combat component or horns entity/state memory is missing.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the current target, or `nil` if no target exists.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Position table or `nil`.
* **Error states:** Returns `nil` if no target exists.

### `GetFormationPos(inst)`
* **Description:** Computes a position around the target based on the `inst.formation` angle (in degrees) and `FORMATION_DIST`. Used to position the hands relative to the target during non-attack phases.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Position table or `nil` if no target or `inst.formation` is `nil`.
* **Error states:** Uses basic trigonometry with `FORMATION_DIST = 6`; assumes standard DST coordinate system.

### `IsTheirTurnToAttack(inst, teammate)`
* **Description:** Determines if a specified teammate ( `"horns"` or `"wings"`) should attack *instead* of this instance, based on who attacked more recently and whether they share the same target.
* **Parameters:**  
  - `inst` (Entity instance)  
  - `teammate` (String identifier, e.g., `"horns"`)  
* **Returns:** `true` if teammate has priority; `false` otherwise.
* **Error states:** Returns `false` if teammate is missing, has no state graph, or no attack time recorded.

### `IsMyTurnToAttack(inst)`
* **Description:** Determines whether this instance may currently attack, based on cooldown status and coordination with teammates.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `true` if allowed to attack; `false` otherwise.
* **Error states:** Always returns `false` while in a `"running"` state tag context (per behavior tree structure).

## Events & listeners
This component does not register or push any events directly. It interacts with events indirectly via the behavior tree’s `ConditionWaitNode`, which calls `self.inst:PushEvent("doattack", { ... })` to trigger attacks on the entity's state graph.

- **Pushes (via behavior tree):**  
  - `"doattack"` with `{ target = self.inst.components.combat.target }` — triggered from within `ConditionWaitNode` when it is time to attack.

- **Listens to:** None explicitly. The component relies on external listeners (e.g., `Combat`, `StateGraph`, `EntityTracker`) to handle events.

---