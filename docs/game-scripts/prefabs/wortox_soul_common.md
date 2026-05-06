---
id: wortox_soul_common
title: Wortox Soul Common
description: Utility module providing shared logic for Wortox soul harvesting, healing, and spawning mechanics.
tags: [wortox, utility, soul, mechanics, healing]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 864790ab
system_scope: combat
---

# Wortox Soul Common

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wortox_soul_common.lua` is a utility module returning a table of helper functions used by Wortox-related prefabs (e.g., `wortox_soul`, `wortox`). It encapsulates logic for soul harvesting validation, soul spawning positioning, and the "Soul Hop" healing mechanic. It does not define a spawnable entity itself but is required by other prefab files to access `fns.DoHeal`, `fns.HasSoul`, etc. The module relies heavily on `TUNING` constants for balance values and global entity lists (`AllPlayers`) for targeting.

## Usage example
```lua
local fns = require("prefabs/wortox_soul_common")

-- Check if an entity drops a soul:
if fns.HasSoul(victim) then
    local count = fns.GetNumSouls(victim)
    fns.SpawnSoulsAt(victim, count)
end

-- Heal nearby players (called from a soul release action):
fns.DoHeal(inst)

-- Give stacked souls to a player inventory:
fns.GiveSouls(player_inst, 5, player_inst:GetPosition())
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- Global balance constants for healing amounts, ranges, and skill multipliers.
- `AllPlayers` -- Global list of player entities used for healing target iteration.
- `SpawnPrefab` -- Instantiates soul and FX prefabs (`wortox_soul`, `wortox_soul_spawn`, `wortox_soul_heal_fx`).
- `TheNet` -- Networking global used to check PVP status.
- `SOULLESS_TARGET_TAGS` -- Global table of tags that prevent soul drops.
- `GetRandomWithVariance`, `TWOPI`, `PI` -- Math utilities for positioning logic.

**Components used:**
- `health` -- Checked for `IsDead`, `IsHurt`, `DoDelta`.
- `combat` -- Checked for `CanTarget`, `IsAlly`, `hiteffectsymbol`.
- `sanity` -- Checked for `DoDelta`.
- `inventory` -- Used in `GiveSouls` to transfer items.
- `stackable` -- Used in `GiveSouls` to set soul stack size.
- `murderable` -- Checked in `HasSoul` as an alternative to combat/health.
- `transform` -- Used to get world position for spawning and range checks.

**Tags:**
- `playerghost` -- Excluded from healing targets.
- `health_as_oldage` -- Excluded from healing targets (Wanda specific).
- `soulstealer` -- Receives sanity instead of health in `DoHeal`.
- `saddled` -- Excluded from soul harvesting in `SoulDamageTest`.
- `player` -- Checked against PVP settings in `SoulDamageTest`.
- `dualsoul` -- Causes `GetNumSouls` to return 2.
- `epic` -- Causes `GetNumSouls` to return 7-8.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fns` | table | --- | The returned module table containing all exported helper functions. |
| `DoHeal` | function | --- | Exported key. Triggers healing and sanity logic for nearby players. |
| `HasSoul` | function | --- | Exported key. Validates if an entity is eligible to drop a soul. |
| `SoulDamageTest` | function | --- | Exported key. Validates if a kill event should harvest a soul. |
| `GetNumSouls` | function | --- | Exported key. Determines soul count based on entity tags. |
| `SpawnSoulAt` | function | --- | Exported key. Spawns a single soul prefab at coordinates. |
| `SpawnSoulsAt` | function | --- | Exported key. Spawns multiple souls with positioning logic. |
| `GiveSouls` | function | --- | Exported key. Spawns stacked soul item and adds to inventory. |

## Main functions
### `DoHeal(inst)`
*   **Description:** Iterates through `AllPlayers` within range and applies healing or sanity based on target state. Healing amount is reduced per additional target unless `inst.soul_heal_player_efficient` is true. Targets with `wortox_inclination == "naughty"` receive reduced healing (`TUNING.SKILLS.WORTOX.NAUGHTY_SOULHEAL_RECEIVED_MULT`). Soulstealers receive sanity instead of health if not in overload state. Spawns `wortox_soul_heal_fx` for each healed target.
*   **Parameters:**
    - `inst` -- Entity instance (typically Wortox or released soul) acting as the source. Must have `Transform` component.
*   **Returns:** None
*   **Error states:** Errors if `inst` is nil or missing `Transform` component (unguarded `inst.Transform:GetWorldPosition()`). Errors if `AllPlayers` contains an entity without `components.health`.

### `HasSoul(victim)`
*   **Description:** Determines if an entity is valid for soul harvesting. Returns true if the entity has `combat` + `health` OR `murderable` components, and does not possess any tags in `SOULLESS_TARGET_TAGS`.
*   **Parameters:**
    - `victim` -- Entity instance to check.
*   **Returns:** `true` if eligible, `false` otherwise.
*   **Error states:** Errors if `victim` is nil (unguarded `victim.components` access).

### `SoulDamageTest(inst, ent, owner)`
*   **Description:** Validates if a damage event should result in a soul drop. Checks if `ent` is the `owner` (self-damage), if `owner` can target `ent`, if `ent` is dead, saddled, or a player in non-PVP. Falls back to `HasSoul(ent)` if all checks pass.
*   **Parameters:**
    - `inst` -- Unused in logic (legacy parameter).
    - `ent` -- Entity taking damage.
    - `owner` -- Entity dealing damage (source of soul harvest).
*   **Returns:** `true` if soul should drop, `false` otherwise.
*   **Error states:** Errors if `ent` is nil (unguarded `ent.components` access). `owner` nil is handled safely.

### `GetNumSouls(victim)`
*   **Description:** Returns the number of souls to drop based on entity tags. `dualsoul` returns 2. `epic` returns random 7-8. Default is 1.
*   **Parameters:**
    - `victim` -- Entity instance that died.
*   **Returns:** Integer count of souls.
*   **Error states:** Errors if `victim` is nil or missing `HasTag` method.

### `SpawnSoulAt(x, y, z, victim, marksource)`
*   **Description:** Spawns a single `wortox_soul` prefab at the specified coordinates. Calls `fx:Setup(victim)` to initialize soul data. If `marksource` is true, copies `_soulsource` from victim to the new soul.
*   **Parameters:**
    - `x` -- World X coordinate.
    - `y` -- World Y coordinate.
    - `z` -- World Z coordinate.
    - `victim` -- Source entity (passed to `Setup`).
    - `marksource` -- Boolean flag to propagate `_soulsource` reference.
*   **Returns:** None
*   **Error states:** Errors if `SpawnPrefab("wortox_soul")` returns nil (missing prefab) and code attempts to access `fx.Transform`.

### `SpawnSoulsAt(victim, numsouls)`
*   **Description:** Spawns multiple souls around the victim. If `numsouls == 2`, spawns in a tight cluster. If `> 1`, distributes in a circle of radius ~1.6-2.0. Ensures at least one soul spawns at the exact victim position (via `marksource = true` on the first call).
*   **Parameters:**
    - `victim` -- Entity instance to spawn around.
    - `numsouls` -- Integer count of souls to spawn.
*   **Returns:** None
*   **Error states:** Errors if `victim` is nil or missing `Transform` component.

### `GiveSouls(inst, num, pos)`
*   **Description:** Spawns a single `wortox_soul` prefab, sets its stack size to `num` via `stackable` component, and adds it to `inst`'s inventory at `pos`.
*   **Parameters:**
    - `inst` -- Entity instance receiving the souls (must have `inventory`).
    - `num` -- Integer stack size.
    - `pos` -- Vector3 position for the drop (passed to `GiveItem`).
*   **Returns:** None
*   **Error states:** Errors if `inst` is nil or missing `inventory` component. Errors if `wortox_soul` prefab is missing.

## Events & listeners
**Listens to:** None identified. This is a utility module; functions are called directly by other code rather than triggered by entity events.

**Pushes:** None identified. No `inst:PushEvent()` calls in this module.

**World state watchers:** None identified. No `inst:WatchWorldState()` calls in this module.