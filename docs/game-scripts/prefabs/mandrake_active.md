---
id: mandrake_active
title: Mandrake Active
description: Controls the active-phase behavior of the mandrake plant, including movement toward the nearest player, day-cycle destruction, sleep-inducing area effect upon being cooked or respawned, and state transitions between planted and inactive forms.
tags: [combat, ai, boss, environment, npc]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c349bde9
system_scope: entity
---

# Mandrake Active

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mandrake_active` is the active, mobile form of the mandrake entity in DST. It spawns when a planted mandrake is picked and navigates toward the nearest player. It is designed to be fragile and perishable during daylight hours, automatically triggering death if not replanted. The component orchestrates transitions to other mandrake forms (`mandrake_planted`, `mandrake_inactive`) and supports cooking mechanics. It integrates closely with the `follower`, `health`, `locomotor`, `freezable`, and `burnable` components to manage behavior and interactions during gameplay.

## Usage example
This component is not added directly via `inst:AddComponent("mandrake_active")`. Instead, it is instantiated as part of the `mandrake_active` prefab definition, typically triggered when a `mandrake_planted` is picked by a player.

```lua
-- Internally, when a planted mandrake is picked:
inst.onpicked(inst)  -- Triggers picking logic (e.g., set state, start leader search, schedule daylight death)

-- The active instance remains in play until:
-- - Daytime arrives → health:Kill()
-- - Killed →ondeath → becomes "mandrake_inactive"
-- - Cooked →oncooked → spawns "cookedmandrake" with sleep effect
```

## Dependencies & tags
**Components used:**  
- `inspectable`, `combat`, `health`, `locomotor`, `follower`, `burnable`, `freezable`  
- Also uses `rider`, `sleeper`, `grogginess`, `pinnable`, `fossilizable` via external component checks during area effect.

**Tags:**  
- Adds: `character`, `small`, `smallcreature`  
- Checks: `player`, `playerghost`, `FX`, `DECOR`, `INLIMBO`, `sleeper`, `ridden` (via rider)

## Properties
No public properties are defined directly in the `mandrake_active` constructor or logic. All state is managed internally or via attached components (e.g., `health.currenthealth`, `locomotor.walkspeed`).

## Main functions
### `CheckDay(inst)`
*   **Description:** Checks if it is currently daytime. If true, unfreezes the entity (if frozen) and kills it.
*   **Parameters:** `inst` (Entity) — the mandrake active instance.
*   **Returns:** Nothing.
*   **Error states:** No error handling; always performs the check and kill if day.

### `doareasleep(inst, range, time)`
*   **Description:** Causes sleep or grogginess in nearby entities within the specified range. Applies varying effects depending on entity type (sleeper, player, grogginess-capable, or generic knock-out).
*   **Parameters:**  
    - `inst` (Entity) — the source of the effect.  
    - `range` (number) — radius in world units.  
    - `time` (number) — duration for sleep/grogginess (modified by `math.random()`).  
*   **Returns:** Nothing.
*   **Error states:** Skips entities that are frozen, stuck, fossilized, ghosts, FX, decorators, or in limbo. PvP rules are respected for player targeting.

### `canplant(inst)`
*   **Description:** Determines whether the mandrake can be replanted. Returns false if frozen or burning.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if not frozen and not burning; otherwise `false`.

### `replant(inst, retries)`
*   **Description:** Attempts to transform the active instance back into `mandrake_planted`. Retries for up to `DEATH_TIMER` (5) seconds if conditions (`canplant`) are not met; otherwise calls `CheckDay`.
*   **Parameters:**  
    - `inst` (Entity).  
    - `retries` (number, optional, default `1`) — current attempt count.  
*   **Returns:** Nothing.
*   **Error states:** Fails and triggers death after 5 retries.

### `ondeath(inst)`
*   **Description:** Transforms the instance into `mandrake_inactive` on death, playing the death animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `oncooked(inst)`
*   **Description:** Transforms into `cookedmandrake` and triggers a delayed area-sleep effect after `0.5` seconds.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `FindNewLeader(inst)`
*   **Description:** Locates the nearest player within 5 units and sets it as the follower’s leader.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StartFindLeaderTask(inst)` / `StopFindLeaderTask(inst)`
*   **Description:** Starts or cancels a periodic task (`1` second interval) that calls `FindNewLeader`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onpicked(inst)`
*   **Description:** Entry point when the entity is picked up (e.g., from planting). Switches state graph to `"picked"`, starts seeking a leader, and schedules daylight death in `26 * FRAMES`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"startday"` (world state) → calls `replant`  
  - `"startfollowing"` → stops leader search task  
  - `"stopfollowing"` → starts leader search task  
- **Pushes:**  
  - `"yawn"` (for players, triggers grogginess)  
  - `"ridersleep"` (for mounted riders)  
  - `"knockedout"` (for entities without sleeper/grogginess)  
  - `"leaderchanged"` (via follower component)  
  - `"unfreeze"` (via freezable component)  
