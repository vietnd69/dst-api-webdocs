---
id: pigelite
title: Pigelite
description: Creates and configures elite pig warrior prefabs with combat, squad, and sleeper functionality for DST's boss encounters.
tags: [combat, ai, boss, squad, prefab]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b9bf6096
system_scope: entity
---

# Pigelite

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pigelite.lua` defines a factory function that generates four distinct elite pig variants (`pigelite1` through `pigelite4`) used as boss minions in DST. It initializes a complete entity with visual, audio, physics, and gameplay components—including combat, inventory, sleeper, and squad membership—tailored for boss arena encounters. The prefabs are heavily integrated with the `SGpigelite` stategraph and rely on the `pigelitebrain` for high-level AI behavior.

## Usage example
```lua
-- The prefabs are automatically registered and accessible by name
local elite_pig = SpawnPrefab("pigelite2")
elite_pig.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `talker`, `locomotor`, `health`, `combat`, `minigame_participator`, `squadmember`, `burnable`, `hauntable`, `inspectable`, `inventory`, `knownlocations`, `entitytracker`, `sleeper`, `freezable`  
**Tags added:** `character`, `pig`, `pigelite`, `scarytoprey`, `noepicmusic`, `minigame_participator`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cheatflag` | `Task` or `nil` | `nil` | Timer handle used to detect cheat triggers (ignition, teleport, root). |
| `SetCheatFlag` | function | — | Helper to start a 5-second cheat-detection timer. |
| `WasCheated` | function | — | Returns `true` if cheat-detection conditions are active. |
| `IsSquadAlreadyTargeting` | function | — | Checks if another squad member is already targeting a given entity within range. |

## Main functions
### `MakePigElite(variation)`
*   **Description:** Factory function that constructs and returns a Prefab for one of the four elite pig variants based on the `variation` string ("1"–"4").
*   **Parameters:** `variation` (string) — One of `"1"`, `"2"`, `"3"`, or `"4"`, selecting the visual build variation.
*   **Returns:** `Prefab` — A pre-configured prefab definition for `pigelite<variation>`.
*   **Error states:** None. Invalid variation strings produce no prefabs silently (only "1"–"4" are handled).

### `RetargetFn(inst)`
*   **Description:** Combat retargeting logic that selects the nearest valid player within range, respecting king proximity constraints and squad targeting rules.
*   **Parameters:** `inst` (Entity) — The elite pig instance requesting a new target.
*   **Returns:** `{player, force}` — The chosen target entity and a `true` flag, or `nil` if no suitable target exists.
*   **Error states:** Returns `nil` when no eligible players are within range or when the king constraint fails.

### `KeepTargetFn(inst, target)`
*   **Description:** Decision function determining whether the elite pig should maintain its current target.
*   **Parameters:**  
    - `inst` (Entity) — The elite pig instance.  
    - `target` (Entity) — The candidate target to retain.  
*   **Returns:** `boolean` — `true` if the target should be kept; `false` otherwise.
*   **Error states:** Returns `false` if the pig is weaponless, the target is out of range, the king constraint fails, or another squad member is targeting the same entity.

### `OnEquip(inst, data)`
*   **Description:** Event handler triggered on hand-slot equipment changes; re-evaluates combat target when a weapon is equipped.
*   **Parameters:**  
    - `inst` (Entity) — The elite pig instance.  
    - `data` (table) — Contains `eslot = EQUIPSLOTS.HANDS`.  
*   **Returns:** Nothing.
*   **Error states:** No effect if `data.eslot` is not `EQUIPSLOTS.HANDS`.

### `OnUnequip(inst, data)`
*   **Description:** Event handler triggered on hand-slot unequipment; clears the combat target when the weapon is removed.
*   **Parameters:** Same as `OnEquip`.
*   **Returns:** Nothing.

### `RefreshSleeperExtraResist(inst)`
*   **Description:** Periodic task ensuring sleeper resistance remains at least `5` seconds.
*   **Parameters:** `inst` (Entity) — The elite pig instance.
*   **Returns:** Nothing.

### `SetCheatFlag(inst)`
*   **Description:** Sets a 5-second timer to mark the elite pig as "cheated" (e.g., after being ignited or teleported).
*   **Parameters:** `inst` (Entity) — The elite pig instance.
*   **Returns:** Nothing.

### `WasCheated(inst)`
*   **Description:** Checks whether the elite pig is currently in a "cheated" state.
*   **Parameters:** `inst` (Entity) — The elite pig instance.
*   **Returns:** `boolean` — `true` if the pig was recently cheated, asleep, frozen, on fire, or panicking.

## Events & listeners
- **Listens to:**  
  - `equip` — Triggers `OnEquip` to update combat targeting.  
  - `unequip` — Triggers `OnUnequip` to clear combat targeting.  
  - `onignite` — Calls `SetCheatFlag` to record cheat state.  
  - `teleported` — Calls `SetCheatFlag` to record cheat state.  
  - `rooted` — Calls `SetCheatFlag` to record cheat state.  
- **Pushes:** None (no events are directly fired by this component/prefab).