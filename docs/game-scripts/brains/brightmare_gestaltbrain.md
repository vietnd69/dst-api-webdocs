---
id: brightmare_gestaltbrain
title: Brightmare Gestaltbrain
description: AI behavior controller for the Brightmare Gestalt entity, managing hierarchical state-driven combat and movement logic based on behavior level and proximity to threats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 216461e7
---

# Brightmare Gestaltbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component implements the behavior tree for the Brightmare Gestalt entity, defining its reactive and goal-directed AI. It orchestrates movement, combat engagement, and avoidance behaviors using a priority-based tree structure that responds dynamically to the entity's `behaviour_level` and environmental conditions. The brain manages transitions between states such as wandering, relocating, fleeing from shadows or the Brightmare, and engaging players in three progressive aggression tiers. It integrates with the `combat` and `locomotor` components to handle target tracking, attack timing, and motion control.

## Dependencies & Tags

- **Components used:** `combat` (for target management, cooldown checks), `locomotor` (for stopping movement)
- **Tags:** Uses `SHADOW_TAGS` defined as a table of tag sets (`{"nightmarecreature", "shadowcreature", "shadow", "shadowminion", "stalker", "stalkerminion", "nightmare", "shadow_fire"}`) to identify entities that trigger avoidance.
- **Tags checked internally:** `busy` (state tag), `jumping` (state tag)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity instance | — | Owning entity; inherited from `Brain` base class. |
| `bt` | BehaviorTree | `nil` | Behavior tree constructed in `OnStart`; initialized after root node definition. |

## Main Functions

### `GestaltBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree node for the Brightmare Gestalt. Constructs a complex priority tree that evaluates conditions (e.g., state tags, behavior level, target presence) and dispatches appropriate sub-trees such as `Relocate`, `RunAway`, `StandAndAttack`, `ChaseAndAttack`, or `Wander`. Must be called after instantiation to activate AI.
* **Parameters:** None.
* **Returns:** `nil`.

### `ShouldRelocate(inst)`
* **Description:** Utility function that determines whether the entity should attempt to relocate. Returns `true` if the entity is not explicitly ignoring relocation, not in a "busy" state, and is too far from any player (beyond `TUNING.GESTALT_RELOCATED_FAR_DIST`).
* **Parameters:**  
  `inst` — Entity instance to evaluate.
* **Returns:** `boolean` — `true` if relocation is warranted.

### `Relocate(inst)`
* **Description:** Instructs the entity's state graph to transition into the `"relocate"` state.
* **Parameters:**  
  `inst` — Entity instance to act upon.
* **Returns:** `nil`.

### `onrunaway(target, inst)`
* **Description:** Callback executed when the entity flees from a shadow-type entity. Clears the current combat target using `combat:DropTarget()`.
* **Parameters:**  
  `target` — The entity being avoided (unused in logic).  
  `inst` — Entity instance performing the avoidance.
* **Returns:** `true` (always, to indicate successful handler execution).

## Events & Listeners

- **Listens to:** None (uses state graph state tags like `busy` and `jumping` internally via `inst.sg:HasStateTag`).
- **Pushes:** None directly; delegates state transitions to the state graph (e.g., `"relocate"` state) and uses component events (`droppedtarget`, `locomote`) indirectly through component calls.

> Note: This brain does not register custom event listeners itself but relies on state graph transitions and component-managed events (e.g., `droppedtarget` emitted by `Combat:DropTarget`).