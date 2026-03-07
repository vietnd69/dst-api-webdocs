---
id: wortox_soul_common
title: Wortox Soul Common
description: Provides shared utility functions for Wortox's soul-based mechanics, including healing nearby players, spawning souls on death, and determining valid soul sources.
tags: [combat, utility, wortox, healing]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a3ced559
system_scope: entity
---

# Wortox Soul Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_soul_common` is a Lua module that exports functional utilities used by Wortox’s soul-related systems. It does not define a component itself but rather provides standalone helper functions for handling soul healing logic, soul counting, soul spawning on death, and validating potential soul sources. It leverages core components like `health`, `sanity`, `combat`, and `inventory`, and is intended to be reused across prefabs and state graphs related to Wortox’s soul mechanics.

## Usage example
```lua
local wortox_soul_common = require "prefabs/wortox_soul_common"

-- Check if an entity can yield souls when killed
if wortox_soul_common.HasSoul(victim) then
    local num = wortox_soul_common.GetNumSouls(victim)
    wortox_soul_common.SpawnSoulsAt(victim, num)
end

-- Heal nearby players and give sanity to other soulstealers
wortox_soul_common.DoHeal(inst)
```

## Dependencies & tags
**Components used:** `health`, `sanity`, `combat`, `inventory`, `murderable`, `stackable`, `Transform`  
**Tags:** Checks `player`, `playerghost`, `soulstealer`, `saddled`, `dualsoul`, `epic`, `health_as_oldage`; uses `SOULLESS_TARGET_TAGS`  
**Special constants:** Uses `TUNING.WORTOX_SOULHEAL_RANGE`, `TUNING.WORTOX_SOULHEAL_MINIMUM_HEAL`, `TUNING.WORTOX_SOULHEAL_LOSS_PER_PLAYER`, `TUNING.SKILLS.WORTOX.*`, `TUNING.HEALING_MED`, `TUNING.SANITY_TINY`, `PI`, `TWOPI`

## Properties
No public properties. This module returns a table of functions and is used as a namespace.

## Main functions
### `DoHeal(inst)`
*   **Description:** Heals hurt players and gives small sanity to nearby "soulstealer" players within range of `inst`. Healing amount is dynamically adjusted based on the number of targets and Wortox’s modifiers (e.g., `soul_heal_mult`, `soul_heal_premult`, `soul_heal_player_efficient`). Sanity bonuses depend on the target’s `wortox_inclination` (`"nice"`/`"naughty"`).
*   **Parameters:** `inst` (entity) — the entity performing the soul heal (typically a Wortox player instance).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if no valid healing or sanity targets are found. Healing does not occur for targets with `health_as_oldage` tag or who are dead/ghosted/invisible.

### `HasSoul(victim)`
*   **Description:** Determines whether an entity can yield souls when killed (i.e., is a valid soul source).
*   **Parameters:** `victim` (entity) — the entity to test.
*   **Returns:** `boolean` — `true` if the entity has either `combat`+`health` components or `murderable` component, and does **not** have any tag in `SOULLESS_TARGET_TAGS`.
*   **Error states:** Returns `false` for invalid or non-damageable entities (e.g., structures, soulless creatures).

### `GetNumSouls(victim)`
*   **Description:** Calculates how many souls an entity yields upon death.
*   **Parameters:** `victim` (entity) — must have already been validated with `HasSoul`.
*   **Returns:** `number` — number of souls to spawn: 2 for `dualsoul`, 7–8 for `epic`, or 1 by default.
*   **Error states:** Assumes `HasSoul(victim)` was true; behavior is undefined if called on invalid entities.

### `SpawnSoulAt(x, y, z, victim, marksource)`
*   **Description:** Spawns a `wortox_soul` prefab at world position `(x, y, z)` and links it to the `victim` for tracking (e.g., source attribution or tracking).
*   **Parameters:**
    *   `x, y, z` (numbers) — world coordinates for spawn.
    *   `victim` (entity) — the entity whose soul is being spawned.
    *   `marksource` (boolean) — if `true`, sets `fx._soulsource` to `victim._soulsource`.
*   **Returns:** Nothing ( spawns a prefab and calls `fx:Setup(victim)`).

### `SpawnSoulsAt(victim, numsouls)`
*   **Description:** Spawns `numsouls` soul entities around the victim’s death position, arranging them in a ring or semi-circle depending on count. The first soul is guaranteed; extra souls for `epic`/`dualsoul` are offset by randomized angles and radii.
*   **Parameters:** `victim` (entity) — the source of the souls. `numsouls` (number) — number of souls to spawn.
*   **Returns:** Nothing.
*   **Error states:** If `numsouls < 2`, only one soul is spawned with proper positional logic. Uses `GetRandomWithVariance` for angular deviation.

### `GiveSouls(inst, num, pos)`
*   **Description:** Creates a `wortox_soul` item, sets its stack size to `num`, and places it into `inst`’s inventory at position `pos`.
*   **Parameters:**
    *   `inst` (entity) — the receiving entity (typically Wortox).
    *   `num` (number) — number of souls to stack.
    *   `pos` (Vector3? or nil) — drop position; if `nil`, default inventory logic applies.
*   **Returns:** Nothing.

### `SoulDamageTest(inst, ent, owner)`
*   **Description:** Validates whether a target (`ent`) can be damaged for soul gain by `inst` (or `owner`). Enforces PvP rules, friendly fire checks, and soul existence criteria.
*   **Parameters:**
    *   `inst` (entity) — the entity whose damage is being evaluated.
    *   `ent` (entity) — the potential victim.
    *   `owner` (entity or nil) — the entity giving the damage command (e.g., for pet attacks).
*   **Returns:** `boolean` — `true` if the target is a valid soul source under current conditions.
*   **Error states:** Returns `false` if: `ent == owner`; owner has no `combat` component; owner cannot target `ent` (e.g., friendly); `ent` is dead, saddled, a non-PvP player; or `HasSoul(ent)` is `false`.

## Events & listeners
None. This module is a pure utility library with no event registration or firing.