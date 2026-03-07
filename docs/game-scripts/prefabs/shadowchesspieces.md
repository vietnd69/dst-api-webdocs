---
id: shadowchesspieces
title: Shadowchesspieces
description: Defines prefabs and shared logic for Shadow Chesspiece monsters (rook, knight, bishop), including level-up progression, combat tuning, music triggers, and loot generation.
tags: [combat, ai, boss, progression, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cf20e959
system_scope: entity
---

# Shadowchesspieces

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowchesspieces.lua` is a prefab factory script that defines and configures Shadow Chesspiece entities (shadow_rook, shadow_knight, shadow_bishop, and shadow_bishop_fx) used in the game. These entities are hostile NPCs with dynamic level-up mechanics (up to level 3), scaling stats, and behavior tied to player proximity (e.g., triggering music and epic music events). The script centralizes common logic—such as retargeting, loot generation, health redirection for level-up protection, and despawn behavior—via a shared `commonfn` function, while customizing per-piece behavior in `rookfn`, `knightfn`, and `bishopfn`.

Key relationships include:
- `combat`: Sets damage, range, attack period, and retarget function; uses `ShareTarget` on attack to call allies.
- `health`: Implements damage redirection during level-up (`nodmglevelingup`), which absorbs incoming damage if the entity is actively leveling up.
- `lootdropper`: Configures conditional loot based on the chesspiece's level.
- `epicscare` and `sanityaura`: Adjust aggro and sanity effects for epic-level entities.
- `locomotor`: Configures walkspeed and creep settings.
- State graphs and brains are assigned dynamically per piece type.

## Usage example
While this file defines prefabs rather than a standalone component, modders typically reference its prefabs or extend its logic in custom prefabs:

```lua
-- Example: Spawning a Shadow Rook at level 2
local inst = SpawnPrefab("shadow_rook")
inst.level = 2
inst:LevelUp(2)  -- Apply level-up scaling and animations

-- Example: Checking if an entity wants to level up
if inst.WantsToLevelUp and inst.WantsToLevelUp(inst) then
    print("Entity is ready to level up")
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `sanityaura`, `epicscare`, `drownable`, `explosiveresist`  
**Tags:** `monster`, `hostile`, `notraptrigger`, `shadowchesspiece`, `shadow_aligned`, `epic`, `smallepic`, `noepicmusic`, `FX`

## Properties
No public properties are exposed directly on the component itself. The script defines **prefab-level instance variables** attached to the `inst` object:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Current level of the chesspiece (1–3). |
| `levelupsource` | table | `{}` | List of prefabs whose levels contributed to this entity's level-up. |
| `_music` | `net_bool` | `false` | Networked boolean indicating whether epic music is playing. |
| `_musictask` | `task` | `nil` | Ongoing task for music trigger checks. |
| `_despawntask` | `task` | `nil` | Task scheduled during sleep to despawn if still alive. |

## Main functions
### `commonfn(name, sixfaced)`
* **Description:** Core constructor function used by all Shadow Chesspieces. Sets up transforms, physics, animations, sound emitter, and network sync, then attaches shared components and events.
* **Parameters:**  
  `name` (string) — Prefab name (e.g., `"shadow_rook"`); determines bank/build/brain and `PHYS_RADIUS`.  
  `sixfaced` (boolean) — If true, sets 6-sided facing; otherwise 4-sided.
* **Returns:** `inst` (Entity) — The fully initialized entity (prefab).
* **Error states:** On non-master servers, returns early after basic (client-only) setup.

### `commonlevelup(inst, overridelevel)`
* **Description:** Handles level-up logic for all chesspieces: scaling visuals, physics, health, tag updates, and music triggers.
* **Parameters:**  
  `inst` (Entity) — The chesspiece entity.  
  `overridelevel` (number?) — Optional specific level to set; defaults to `inst.level + 1` (capped at `MAX_LEVEL`).
* **Returns:** `{level = number, scale = number}` on success; `nil` if already at max level or dead.
* **Error states:** Returns early if `inst.components.health:IsDead()` is `true`.

### `rooklevelup`, `knightlevelup`, `bishoplevelup`
* **Description:** Piece-specific level-up callbacks. Apply combat, locomotion, and animation overrides based on per-piece tuning values.
* **Parameters:** Same as `commonlevelup`.
* **Returns:** Same as `commonlevelup`.
* **Error states:** Same as `commonlevelup`.

### `retargetfn(inst)`
* **Description:** Custom retarget function for `combat`. Finds the nearest valid player within range if current target is invalid or player is too far/fleeing.
* **Parameters:**  
  `inst` (Entity) — The chesspiece.
* **Returns:** `{target = Entity?, force = boolean}` — The chosen target and whether to force reselection.
* **Error states:** Returns `nil, true` if no player is in range.

### `lootsetfn(lootdropper)`
* **Description:** Sets loot table based on chesspiece `level`. Only triggers on `lootdropper` update.
* **Parameters:**  
  `lootdropper` (LootDropper component) — Component instance.
* **Returns:** Nothing. Loot is assigned via `lootdropper:SetLoot(...)`.
* **Error states:** Loot table is empty unless `level >= 2` (and ≥3 for epic drops).

### `OnLevelUp(inst, data)`
* **Description:** Event listener to track which prefabs contributed to this entity's level growth.
* **Parameters:**  
  `data` (table) — Event payload, expected to contain `source` (Entity) that triggered the level-up.
* **Returns:** Nothing. Modifies `inst.levelupsource`.

### `OnAttacked(inst, data)`
* **Description:** Event listener to acquire attacker as target and request nearby allies to assist.
* **Parameters:**  
  `data` (table) — Event payload with `attacker` (Entity).
* **Returns:** Nothing.

### `StartMusic`, `StopMusic`, `PushMusic`, `OnMusicDirty`
* **Description:** Manage epic music and related tasks based on `_music` state and player proximity.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnEntitySleep`, `OnEntityWake`, `OnDespawn`
* **Description:** Handle despawning logic during sleep state (e.g., via teleport or night).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` — Triggers `OnAttacked`.
  - `death` — Calls `StopMusic`.
  - `levelup` — Calls `OnLevelUp`.
  - `musicdirty` (client only) — Calls `OnMusicDirty`.
  - `animover` (client only, `shadow_bishop_fx`) — Calls `inst.Remove`.
- **Pushes:**
  - `triggeredevent` (client only) — With `{ name = "shadowchess" }` when `PushMusic` detects nearby player.
