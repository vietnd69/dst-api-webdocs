---
id: clockwork_common
title: Clockwork common
description: Provides shared utility functions for clockwork-related AI behaviors, including home positioning, combat retargeting, trading, regeneration, and befriendability logic.
tags: [ai, combat, bot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d3f883b6
system_scope: ai
---

# Clockwork common

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`clockwork_common` is a utility module that encapsulates common AI behaviors and state logic used by clockwork-themed entities (e.g., clockwork soldiers, clockwork birds) in DST. It centralizes functions for home定位, combat interactions (including retargeting and AOE targeting), health regeneration coordination, trading state, and befriendability — notably avoiding the use of an ECS component in favor of a module returning reusable functions. These functions are typically integrated into entity stategraphs or brains.

## Usage example
```lua
local clockwork_common = require("prefabs/clockwork_common")

local function OnInstanceInit(inst)
    clockwork_common.InitHomePosition(inst)
    clockwork_common.MakeBefriendable(inst)
    clockwork_common.MakeHealthRegen(inst)

    inst:ListenForEvent("onenterstate", function()
        clockwork_common.sgTrySetBefriendable(inst)
    end)

    inst:ListenForEvent("onexitstate", function()
        clockwork_common.sgTryClearBefriendable(inst)
    end)
end
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `follower`, `followermemory`, `freezable`, `health`, `knownlocations`, `leader`, `minigame_participator`, `playercontroller`.  
**Tags:** Adds/Removes `befriendable_clockwork` in stategraph context.

## Properties
No public properties. All values are internal or passed as function parameters.

## Main functions
### `InitHomePosition(inst)`
*   **Description:** Sets up event listeners for `entitysleep` and `entitywake` to initialize and preserve the entity's home position upon first waking.
*   **Parameters:** `inst` (Entity) - the entity to initialize home tracking for.
*   **Returns:** Nothing.

### `GetHomePosition(inst)`
*   **Description:** Returns the stored home position if the entity has no leader; otherwise returns `nil`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `vector3?` — the home position or `nil`.

### `ShouldSleep(inst)`
*   **Description:** Determines if the entity can safely sleep (e.g., is far from home, no combat, burning, frozen, or visible nearby threats).
*   **Parameters:** `inst` (Entity).
*   **Returns:** `boolean` — `true` if the entity should enter sleep state, otherwise `false`.

### `ShouldWake(inst)`
*   **Description:** Convenience wrapper for negation of `ShouldSleep`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `boolean`.

### `IsAlly(inst, target)`
*   **Description:** Checks whether `target` is an ally of `inst`, considering both generic combat ally logic and clockwork-specific “wild chess” logic.
*   **Parameters:** `inst` (Entity), `target` (Entity).
*   **Returns:** `boolean`.

### `Retarget(inst, range, extrafilterfn)`
*   **Description:** Finds a new valid combat target for a wild clockwork entity (i.e., one not currently following a player), optionally filtered by `extrafilterfn`. Returns `nil` if it has a remembered leader or is out of range of home.
*   **Parameters:**
    *   `inst` (Entity) — the entity performing retargeting.
    *   `range` (number) — search radius.
    *   `extrafilterfn` (function?) — optional filter function taking `(inst, guy)` and returning `boolean?`.
*   **Returns:** `Entity?` — the selected target or `nil`.

### `FindAOETargetsAtXZ(inst, x, z, radius, fn)`
*   **Description:** Iterates over all entities within an AOE area at `x,z` (using `radius`) and invokes `fn(target, inst)` for each eligible target (visible, targetable, not an ally, and either the current target or currently targeting `inst`).
*   **Parameters:**
    *   `inst` (Entity).
    *   `x` (number) — X coordinate center.
    *   `z` (number) — Z coordinate center.
    *   `radius` (number) — AOE radius.
    *   `fn` (function) — callback invoked for each valid AOE target.
*   **Returns:** Nothing.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether to continue chasing or holding a target based on distance from home or self, and whether the target is no longer an ally.
*   **Parameters:** `inst` (Entity), `target` (Entity).
*   **Returns:** `boolean` — `true` if target should be retained.

### `OnAttacked(inst, data)`
*   **Description:** Called when `inst` is attacked. Sets the attacker as the new combat target and, if `inst` is a wild clockwork, shares the aggro with nearby wild clockwork allies.
*   **Parameters:** `inst` (Entity), `data` (table) — event data including `attacker`.
*   **Returns:** Nothing.

### `OnNewCombatTarget(inst, data)`
*   **Description:** Marks whether the newly assigned combat target was an ally at the time of assignment (for `KeepTarget` logic).
*   **Parameters:** `inst` (Entity), `data` (table) — event data including `target`.
*   **Returns:** Nothing.

### `MakeBefriendable(inst)`
*   **Description:** Enables befriendability logic by adding the `followermemory` component (if missing) and setting up leader-lost and leader-reunite callbacks that rehome or re-friend the entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `sgTrySetBefriendable(inst)`
*   **Description:** Adds the `befriendable_clockwork` tag if the `inst.TryBefriendChess` function exists (used to signal availability to traders in stategraph).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `sgTryClearBefriendable(inst)`
*   **Description:** Removes the `befriendable_clockwork` tag unless `inst.sg.statemem.keepbefriendable` is `true`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeHealthRegen(inst)`
*   **Description:** Connects health regeneration behavior: regenerates when out of combat, cancels when entering combat.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `WaitForTrader(inst)`
*   **Description:** Returns a PriorityNode sequence that handles waiting for a nearby trader, switching targets if necessary, and pausing behavior if the trader changed.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `table` — a PriorityNode suitable for use in an AI brain.

## Events & listeners
- **Listens to:**
    - `entitysleep`, `entitywake` — to initialize home location.
    - `newcombattarget` — to halt regeneration on combat entry.
    - `droppedtarget` — to resume regeneration when combat ends.
    - `healthdelta` — to trigger delayed health regeneration.
- **Pushes:** None directly; integrates into events raised by other components and stategraphs.