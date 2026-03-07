---
id: ghostlybond
title: GhostlyBond
description: Manages a spectral companion (ghost) tied to a player, handling summoning, recall, bonding progression, and state synchronization.
tags: [ghost, summoning, bond, pet, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: eda01229
system_scope: entity
---

# GhostlyBond

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GhostlyBond` manages a spectral companion (ghost) that bonds with a player entity. It tracks bonding progression across up to three levels, handles summoning the ghost into the world and recalling it to the player, synchronizes state across network clients via `OnSave`/`OnLoad`, and coordinates with the `pethealthbar` component to update the ghost’s visual skin. It is typically attached to player prefabs that can summon and bond with ghosts.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("ghostlybond")
inst.components.ghostlybond:Init("abigail", 30)  -- 30 seconds per bond level
inst.components.ghostlybond:SetBondTimeMultiplier("player_speed", 1.5, "speed_mod")
inst.components.ghostlybond:SummonComplete()
```

## Dependencies & tags
**Components used:** `pethealthbar` (via `SetPetSkin`)
**Tags:** `ghostfriend_summoned`, `ghostfriend_notsummoned` (added/removed dynamically by internal helpers)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheEcsEntity` | *(injected)* | The entity instance that owns this component. |
| `ghost` | `TheEcsEntity?` | `nil` | Reference to the spawned ghost entity; `nil` if not currently active. |
| `ghost_prefab` | `string?` | `nil` | Name of the prefab to spawn for the ghost. |
| `bondlevel` | number | `1` | Current bond level (1 to `maxbondlevel`). |
| `maxbondlevel` | number | `3` | Maximum allowed bond level. |
| `bondleveltimer` | number? | `nil` | Time accumulated toward next bond level; `nil` when at max level. |
| `bondlevelmaxtime` | number? | `nil` | Time (in seconds) required to advance one bond level. |
| `paused` | boolean | `false` | Whether bond progression is paused. |
| `summoned` | boolean | `false` | Whether the ghost is currently in the world (not recalled). |
| `notsummoned` | boolean | `true` | Whether the ghost is currently bound to the player. |
| `externalbondtimemultipliers` | `SourceModifierList` | *(instantiated)* | Manages speed modifiers applied to bond timer progression. |

## Main functions
### `Init(ghost_prefab, bond_levelup_time)`
*   **Description:** Initializes the component with the ghost prefab and time required per bond level. Begins a delayed task to spawn the ghost after a `0`-second delay.
*   **Parameters:**  
    - `ghost_prefab` (string) — Name of the ghost prefab to spawn (e.g., `"abigail"`).  
    - `bond_levelup_time` (number) — Seconds required to progress one bond level.
*   **Returns:** Nothing.

### `SpawnGhost()`
*   **Description:** Spawns the ghost prefab, links it to the player, sets up event listeners, sets bond level to `1`, and marks the ghost as recalled (`notsummoned = true`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None — always succeeds if the prefab spawns.

### `Summon(summoningitem, pos)`
*   **Description:** Mobilizes the ghost into the world if it is currently in `notsummoned` state. Updates the ghost’s position, removes its scene parent, updates its skin via `TheSim:ReskinEntity`, and syncs the skin to the `pethealthbar` component.
*   **Parameters:**  
    - `summoningitem` (table) — Must contain `linked_skinname` (string) and `skin_id` (number). Used to reskin the ghost.  
    - `pos` (`Vector3?`) — Optional world position to place the ghost. If omitted, uses the player’s current position.  
*   **Returns:** `true` if the ghost was successfully summoned; `false` if summoning conditions are not met (e.g., ghost is already summoned).
*   **Error states:** Returns `false` if `ghost == nil` or `not notsummoned`.

### `SummonComplete()`
*   **Description:** Finalizes the summoning state, updating internal flags to `summoned = true` and `notsummoned = false`, then fires the `ghostlybond_summoncomplete` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Recall(was_killed)`
*   **Description:** Initiates recall of the ghost if it is currently `summoned` and the player is not in a "dissipate" state. Invokes the optional `onrecallfn` callback.
*   **Parameters:**  
    - `was_killed` (boolean) — Indicates whether the recall was triggered by the ghost’s death.
*   **Returns:** `true` if recall was initiated; `nil` if recall was skipped.
*   **Error states:** Returns `nil` if ghost is `nil`, already `notsummoned`, or player is in `"dissipate"` state.

### `RecallComplete()`
*   **Description:** Moves the ghost back to the player (parenting to the player’s entity, setting position to `{0,0,0}`, and removing from scene). Sets state to `notsummoned = true`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Notes:** Always fires `ghostlybond_recallcomplete`.

### `SetBondLevel(level, time, isloading)`
*   **Description:** Updates the bond level, clamping it to `maxbondlevel`. Resets or clears the bond timer depending on whether max level is reached. Fires `ghostlybond_level_change` event if level changed.
*   **Parameters:**  
    - `level` (number) — Desired bond level (capped at `maxbondlevel`).  
    - `time` (number?) — Time already accumulated toward the next level (used only if `level < maxbondlevel`). Defaults to `0`.  
    - `isloading` (boolean?) — Indicates whether the call is part of loading saved data.
*   **Returns:** Nothing.

### `SetBondTimeMultiplier(src, mult, key)`
*   **Description:** Sets a named multiplier source for bond timer speed (e.g., `"speed"` mod). Internally updates `externalbondtimemultipliers`.
*   **Parameters:**  
    - `src` (string) — Unique identifier for the modifier source.  
    - `mult` (number) — Multiplicative factor applied to bond timer speed (`1.0` = normal speed).  
    - `key` (string) — Optional key used for modifier deduplication or removal.
*   **Returns:** Nothing.

### `ResumeBonding()` / `PauseBonding()`
*   **Description:** Controls whether bond progression is active. `ResumeBonding()` restarts updates if the timer is non-`nil`; `PauseBonding()` stops updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)` / `LongUpdate(dt)`
*   **Description:** Progresses bond progression by accumulating `dt * externalbondtimemultipliers:Get()` into `bondleveltimer`. If the timer exceeds `bondlevelmaxtime`, increments bond level.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string describing ghost presence, current bond level, remaining time to next level, speed multiplier, and pause state.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"Entity (abigail): GUID 123, 2, 12.34, mult: 1.50"`.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on ghost) — Triggers `_ghost_onremove` to respawn the ghost if removed.  
  - `"death"` (on ghost) — Triggers `_ghost_death` to reset bond level and initiate recall.  
- **Pushes:**  
  - `"ghostlybond_level_change"` — Fired when `bondlevel` changes (data: `{ghost, level, prev_level, isloading}`).  
  - `"ghostlybond_summoncomplete"` — Fired after `SummonComplete()` succeeds (payload: `ghost` entity).  
  - `"ghostlybond_recallcomplete"` — Fired after `RecallComplete()` completes (payload: `ghost` entity).

## Events & listeners (Saving/Loading)
- **`OnSave()`** — Returns a table containing `bondlevel`, `elapsedtime`, and ghost state (`GetSaveRecord()` and `inlimbo`).  
- **`OnLoad(data)`** — Restores bond level, timer, and ghost entity using the saved record; handles summon/re recall completion.

## Notes
- `ghost` is linked to the player via `ghost:LinkToPlayer(self.inst)` during spawn.
- Ghost skins are synced to the `pethealthbar` component via `inst.components.pethealthbar:SetPetSkin(...)`.
- Paused state (`self.paused`) affects timer updates, but the `paused` flag can be overridden per-call via `ResumeBonding()`/`PauseBonding()`.
- Internal tag helpers (`setsummoned`, `setnotsummoned`) automatically add/remove `"ghostfriend_summoned"` and `"ghostfriend_notsummoned"` tags.
