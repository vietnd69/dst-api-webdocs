---
id: beefalobrain
title: Beefalobrain
description: Controls the AI behavior and decision-making logic for beefalo entities, including greeting feeders, loitering, wandering, and following leaders or herd members.
tags: [ai, locomotion, social, halloween, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 32285bac
system_scope: brain
---

# Beefalobrain

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`BeefaloBrain` is a behavior tree (BT) implementation that defines the decision-making logic for beefalo entities in DST. It orchestrates high-priority responses (e.g., panic, combat), interaction states (greeting feeders with a bell, loitering), and movement behaviors (wandering, following). It interacts heavily with components like `domesticatable`, `follower`, `hitchable`, `knownlocations`, `rideable`, and `writeable`, using helper functions to determine target positions, states, and priority actions.

## Usage example
```lua
-- Typically added automatically to beefalo prefabs
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrain("beefalobrain")
-- No direct manual interaction needed; the game engine handles activation
```

## Dependencies & tags
**Components used:** `combat`, `domesticatable`, `follower`, `hitchable`, `inventory`, `inventoryitem`, `knownlocations`, `rideable`, `writeable`  
**Tags:** Checks `hitched`, `notarget`, `playerghost`, `bell`, `pocketdimension_container`; uses `ACTIONS.HITCH`

## Properties
No public properties. All state and data are managed internally via local constants, component properties, and closure-scoped variables.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node with a priority-based hierarchical task network for beefalo AI. It constructs a complex `PriorityNode` with sub-trees for panic responses, combat, naming, hitching, following, greeting, loitering, wandering, and saltlick anchoring.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None — assumes all required components exist or are properly guarded by `IfNode`/`WhileNode` conditions.

### `GetFaceTargetFn(inst)`
*   **Description:** Determines a target for the beefalo to face (e.g., a nearby player). Returns `nil` if the beefalo is domesticated or seeking salt, or if no valid player is within range and not tagged `notarget`.
*   **Parameters:** `inst` (entity instance) — the beefalo entity.
*   **Returns:** `entity?` — closest player within `START_FACE_DIST`, or `nil`.
*   **Error states:** Returns `nil` if the player is ghosted or has `notarget`.

### `KeepFaceTargetFn(inst, target)`
*   **Description:** Continues facing a target only if both entities are valid, within `KEEP_FACE_DIST`, not domesticated/seeking salt, and the target is neither a ghost nor tagged `notarget`.
*   **Parameters:**  
    - `inst` (entity) — the beefalo.  
    - `target` (entity) — current facing target.
*   **Returns:** `boolean` — `true` if continue facing, else `false`.
*   **Error states:** Returns `false` if either entity is invalid or out of range.

### `GetGreetTarget(inst)`
*   **Description:** Finds the target the beefalo should greet — either its Beef Bell owner (if bell is nearby) or the closest player on land within `GREET_SEARCH_RADIUS`.
*   **Parameters:** `inst` (entity).
*   **Returns:** `entity?` — bell owner or closest player, or `nil`.
*   **Error states:** Returns `nil` if no bell or player is within search radius.

### `GetLoiterAnchor(inst)`
*   **Description:** Maintains and updates the loiter anchor position using `knownlocations`. Resets it if too far from the current anchor (`LOITER_ANCHOR_RESET_DIST`), or if herd location is nearby, updates anchor to herd position.
*   **Parameters:** `inst` (entity).
*   **Returns:** `vec3?` — stored anchor position from `knownlocations`.
*   **Error states:** None — ensures anchor is always present.

### `ShouldWaitForHeavyLifter(inst, target)`
*   **Description:** Determines if the beefalo should pause to wait for a heavy-lifting entity approaching it (e.g., a player carrying a large item).
*   **Parameters:**  
    - `inst` (entity) — the beefalo.  
    - `target` (entity) — potential target (e.g., player holding item).
*   **Returns:** `boolean` — `true` if target is heavy lifting and moving toward the beefalo.
*   **Error states:** Returns `false` if target is invalid, not heavy lifting, or not moving in the right direction.

### `InState(inst, state)`
*   **Description:** Helper to determine if the beefalo is currently in a given state (`GREETING`, `LOITERING`, or `WANDERING`) by comparing elapsed time since `_startgreettime`.
*   **Parameters:**  
    - `inst` (entity).  
    - `state` (string) — one of `"greeting"`, `"loitering"`, `"wandering"`.
*   **Returns:** `boolean` — whether current state matches expected state.
*   **Error states:** If `_startgreettime` is `nil`, initializes it to a large negative value to force `WANDERING` initially.

### `TryBeginGreetingState(inst)`
*   **Description:** Begins greeting state if domestication level > 0 and a greet target exists; sets `_startgreettime`.
*   **Parameters:** `inst` (entity).
*   **Returns:** `boolean` — `true` if greeting started, else `false`.
*   **Error states:** Returns `false` if in mood or no valid greet target.

### `TryBeginLoiterState(inst)`
*   **Description:** Transitions from greeting to loitering state if greeting duration has elapsed or is still active; resets timer if loitering prematurely.
*   **Parameters:** `inst` (entity).
*   **Returns:** `boolean` — `true` if loitering should start or timer reset, `false` if still in mood.
*   **Error states:** Returns `false` if in mood; resets timer to avoid loiter state exit.

## Events & listeners
- **Listens to:** `newcombattarget` — stops listening via `RemoveEventCallback` when unhitching (handled in `Hitchable:Unhitch`, not directly in this file).
- **Pushes:** None — this brain does not emit events itself. Actions (`Follow`, `Wander`, etc.) may fire their own callbacks internally.
