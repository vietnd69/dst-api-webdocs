---
id: battlesongdefs
title: Battlesongdefs
description: Defines configuration and behavior for Wathgrithr's battlesong buffs and instant-use battle quotes in Don't Starve Together.
tags: [combat, audio, buff, character, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d6d0a76
system_scope: entity
---

# Battlesongdefs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`battlesongdefs.lua` defines the structure, behavior hooks, and network identifiers for Wathgrithr's battlesong mechanics. It does not implement a component itself but serves as a centralized data and utility module. The `song_defs` table contains configuration for both sustained buffs (e.g., durability bonus, health gain) and instant-use "quote" songs (e.g., taunt, panic, revive). Each song definition includes lifecycle callbacks (`ONAPPLY`, `ONDETACH`, `ONINSTANT`) that interact with core components like `health`, `sanity`, `combat`, `damagetyperesist`, `damagetypebonus`, and `hauntable`.

## Usage example
```lua
-- Access a battlesong definition (e.g., healthgain song)
local song_defs = require "prefabs/battlesongdefs"
local healthgain_def = song_defs.song_defs.battlesong_healthgain

-- Add a battlesong item (e.g., in a prefab file)
local function OnSpawn(inst)
    inst:AddComponent("singinginspiration")
    -- The component 'singinginspiration' uses song_defs to apply buffs
end
```

## Dependencies & tags
**Components used:** `health`, `sanity`, `combat`, `damagetyperesist`, `damagetypebonus`, `hauntable`, `inventory`, `weapon`, `finiteuses`, `projectile`, `singinginspiration`.  
**Tags:** No tags are added or removed directly by this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `song_defs` | table | — | Dictionary mapping song identifiers (e.g., `"battlesong_healthgain"`) to configuration tables. |
| `GetBattleSongDefFromNetID(netid)` | function | — | Returns the song definition corresponding to a given network ID; used for client-server sync. |
| `AddNewBattleSongNetID(prefab, song_def)` | function | — | Registers a new song definition with a unique network ID and asserts the maximum song count (7) is not exceeded. |

## Main functions
### `AddDurabilityMult(inst, equip)`
*   **Description:** Applies a durability reduction multiplier (`TUNING.BATTLESONG_DURABILITY_MOD`) to the target's weapon if the target is equipped with a valid weapon and `finiteuses` component. Called when applying the durability song.
*   **Parameters:** `inst` (Entity) — the song's source entity; `equip` (Entity or `nil`) — the equipped weapon item.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `equip` or its `weapon`/`finiteuses` components are missing.

### `RemoveDurabilityMult(inst, equip)`
*   **Description:** Removes the durability multiplier applied by `AddDurabilityMult`.
*   **Parameters:** `inst` (Entity), `equip` (Entity or `nil`).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `equip` or its components are missing.

### `CheckValidAttackData(attacker, data)`
*   **Description:** Validates that an `onattackother` event represents a legitimate attack (not a bounced projectile or a dummy AOE weapon like a flamethrower FX).
*   **Parameters:** `attacker` (Entity), `data` (table or `nil`) — event payload containing `projectile` and/or `weapon` subtables.
*   **Returns:** `true` if the attack should count; `false` otherwise.

### `DoRevive(target, singer)`
*   **Description:** Triggers the revive effect for a ghost player: pushes a `respawnfromghost` event and spawns a lightning strike at the target's position.
*   **Parameters:** `target` (Entity), `singer` (Entity) — the battlesong user.
*   **Returns:** Nothing.

### `AddNewBattleSongNetID(prefab, song_def)`
*   **Description:** Assigns a unique network ID to a battlesong definition for replication across clients (e.g., `inspirationSong1`, `inspirationSong2`). Asserts that fewer than 8 songs exist.
*   **Parameters:** `prefab` (string) — the song definition key; `song_def` (table) — the song definition table.
*   **Returns:** Nothing.
*   **Error states:** Throws an assertion failure if 8 or more songs are registered.

## Events & listeners
- **Listens to:** `equip`, `unequip` — updates durability multiplier when the target equips/unequips an item in the `HANDS` slot.
- **Pushes:** `respawnfromghost`, `ms_sendlightningstrike` — used by `DoRevive` to coordinate player revival and visual effect.
