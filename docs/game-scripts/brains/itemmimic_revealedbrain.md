---
id: itemmimic_revealedbrain
title: Itemmimic Revealedbrain
description: Controls the AI behavior of a revealed item mimic entity, making it flee from players while scanning for nearby mimicable entities to imitate.
tags: [ai, combat, npc]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: fd2bb287
system_scope: brain
---

# Itemmimic Revealedbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ItemMimic_RevealedBrain` defines the behavior tree for a revealed item mimic — a hostile NPC that prioritizes fleeing from nearby players (`RunAway`) while periodically scanning for valid mimicable entities (e.g., items or small creatures meeting specific tag criteria). When a candidate is found, it queues a `NUZZLE` action to mimic the target, blocking further mimicry attempts via a timer. The brain integrates with the `behaviours.runaway` module and uses timers, locomotion, and event-driven logic.

It inherits from `Brain` and constructs its behavior tree in `OnStart()`. The brain is intended for use on entities that have already transitioned from an initial hidden (non-revealed) state.

## Usage example
```lua
local inst = CreateEntity()
-- ... (add required components like combat, locomotor, timer, itemmimic)
inst:AddBrain("itemmimic_revealedbrain")
inst.components.brain:Start() -- Triggers OnStart and initializes the behavior tree
```

## Dependencies & tags
**Components used:** `locomotor`, `timer`, `itemmimic` (checked on other entities), `playercontroller` (indirect via `LocoMotor`), `inventoryitem` (checked on mimicable candidates).  
**Tags:**  
- Checks tags from `itemmimic_data.MUST_TAGS` and `itemmimic_data.CANT_TAGS` (imported from `"prefabs/itemmimic_data"`) to identify valid mimicable entities.  
- Internal state uses `inst._mimicry_queued`, `inst._try_mimic_task`, and `inst.sg:HasStateTag("jumping")`.

## Properties
No public properties. Internal state is stored on `inst` as private fields:
- `inst._mimicry_queued`: boolean — `true` during a queued mimic action.
- `inst._try_mimic_task`: task handle — the pending task scheduled to initiate mimicry.
- `inst.sg`: stategraph — used to check state tags like `"jumping"`.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree for the brain using a priority node structure. The root node ensures the mimic avoids jumping states, and sub-nodes handle post-spawn panic, player avoidance, mimic scanning, mimic action blocking, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Assumes required components (`locomotor`, `timer`) exist on `self.inst`; otherwise, behavior may fail silently or raise errors.

### `GetClosestPlayer(inst)` (local function)
*   **Description:** Finds the nearest player within `AVOID_PLAYER_DIST` (4 units) squared, ignoring certain conditions (`true` in `FindClosestPlayerInRangeSq` indicates strict filtering). Used by `RunAway` and panic behaviors.
*   **Parameters:** `inst` (entity) — the mimic entity.
*   **Returns:** Player entity or `nil`.

### `LookForMimicAction(inst)` (local function)
*   **Description:** Scans for valid mimicable entities within a 15-unit radius. If one is found and no mimicry is already scheduled or blocked, it schedules `initiate_mimicry` after a 7-second delay and fires the `"eye_up"` event.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst._try_mimic_task` is active or `"mimic_blocker"` timer exists; skips entities that already have the `itemmimic` component.

### `initiate_mimicry(inst, mimicable_entity)` (local function)
*   **Description:** Initiates the mimicry process for a given entity. Creates and pushes a `NUZZLE` buffered action via the `locomotor`. Sets `_mimicry_queued = true` and schedules cleanup, or fires `"eye_down"` on failure. Starts the `"mimic_blocker"` timer to prevent repeated attempts.
*   **Parameters:**  
    - `inst` (entity) — the mimic entity.  
    - `mimicable_entity` (entity) — the target entity to mimic.  
*   **Returns:** Nothing.
*   **Error states:** No action if `mimicable_entity` is invalid, lacks `MUST_TAGS`, or has `CANT_TAGS`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** `"eye_up"` — when a mimicable is found and a mimicry task is scheduled.  
- **Pushes:** `"eye_down"` — on failure of the `NUZZLE` action or if mimicry is aborted.  
- **Listens to internal state events** via `inst.sg:HasStateTag("jumping")` in the behavior tree (stategraph events are external to this brain file but influence behavior).
