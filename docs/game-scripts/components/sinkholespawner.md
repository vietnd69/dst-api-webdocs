---
id: sinkholespawner
title: Sinkholespawner
description: Manages the spawning and timing of antlion sinkhole attacks targeting specific players during the Antlion event.
tags: [event, boss, combat, environment, network]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6a82fa3b
system_scope: environment
---
# Sinkholespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sinkholespawner` is a component responsible for orchestrating antlion sinkhole attack waves during the Antlion event. It selects one or two player targets based on weighted criteria (e.g., play time), schedules warning periods and attack waves per target, and spawns sinkhole prefabs at validated positions near the target. It interacts with the `talker` component to announce sinkhole warnings and integrates with the world's network system via events to synchronize state across shards.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sinkholespawner")
inst.components.sinkholespawner:StartSinkholes()
-- To stop attacks and clean up:
inst.components.sinkholespawner:StopSinkholes()
```

## Dependencies & tags
**Components used:** `talker` (via `player.components.talker:Say(...)`), `health` (for dead checks), `sleeper` (for sleeping checks), `revivablecorpse`
**Tags:** Reads `antlion_sinkhole_blocker` tag for positioning validation. No tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Inst` | — | The entity instance the component is attached to. |
| `targets` | table | `{}` | List of up to `MAX_TARGETS` (2) target info tables describing active sinkhole attack targets. |

## Main functions
### `StartSinkholes()`
*   **Description:** Initiates a new wave of sinkhole attacks by selecting 1–2 players as targets. Computes number of attacks per target based on player age and remaining season days. Triggers warnings and schedules attacks via internal timers. Starts the component's update loop if targets exist.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no valid players are found or if all candidate players are on non-visual ground (e.g., ocean tiles outside coastal areas).

### `StopSinkholes()`
*   **Description:** Immediately stops all ongoing sinkhole attacks by clearing the target list and firing `onsinkholesfinished`. Stops component updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoTargetWarning(targetinfo)`
*   **Description:** Handles warning behavior for a target (e.g., camera shake, visual FX, and announcement). Decrements the warning counter and schedules the next warning or attack.
*   **Parameters:** `targetinfo` (table) — Target metadata containing `player`, `pos`, `warnings`, `next_warning`, and `client`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `targetinfo.warnings` is `nil` or negative.

### `DoTargetAttack(targetinfo)`
*   **Description:** Attempts to spawn a sinkhole at the target's position. Checks for nearby merges before spawning (to prevent overlapping attacks). Decrements remaining attack count.
*   **Parameters:** `targetinfo` (table) — Target metadata containing `pos` and `attacks`.
*   **Returns:** Nothing.
*   **Error states:** Does not spawn if `pos` is `nil` or if another sinkhole is too close (`< WAVE_MERGE_ATTACKS_DIST_SQ`).

### `SpawnSinkhole(spawnpt)`
*   **Description:** Attempts to spawn a sinkhole (`antlion_sinkhole`) at a position near `spawnpt` with randomized offset, using validation logic (no blockers, passable, valid tile).
*   **Parameters:** `spawnpt` (Vector3) — Approximate target position.
*   **Returns:** Nothing.
*   **Error states:** If no valid position is found within a reasonable search radius, the sinkhole is not spawned.

### `OnUpdate(dt)`
*   **Description:** Called periodically by the engine. Updates remaining warning/attack timers per target, triggers warnings and attacks when timers expire, and removes targets once attacks are complete. Stops updating when all targets are exhausted.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes active sinkhole state for save/load persistence. Only saves targets with known positions (`pos ~= nil`).
*   **Parameters:** None.
*   **Returns:** A table with `targets` array containing `x`, `z`, `attacks`, `next_attack`, and `next_warning` per saved target, or `nil` if none.

### `OnLoad(data)`
*   **Description:** Loads sinkhole state from saved data. Restores active targets with positions and timers. Restarts update loop if targets exist.
*   **Parameters:** `data` (table) — Saved state with `targets` array.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a multiline debug string describing each target's current state (warning or attack phase), remaining count, and timer.
*   **Parameters:** None.
*   **Returns:** `string` — Human-readable debug info for debugging tools.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** `onsinkholesstarted`, `onsinkholesfinished`, and via `TheWorld:PushEvent("master_sinkholesupdate", ...)` to synchronize remote targets.
