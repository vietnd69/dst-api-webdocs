---
id: worldmeteorshower
title: Worldmeteorshower
description: This component manages meteor loot spawning behavior on the server, including special handling for Moon Rock Shell drops based on cumulative chance mechanics and world cycle progression.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 99bc8c48
---

# Worldmeteorshower

## Overview
The `worldmeteorshower` component is a server-side-only component that modifies meteor loot dropping logic in the game world. It implements a progressive chance system for `rock_moon_shell` to appear instead of `rock_moon`, adjusts drop rates using additive modifiers, and ensures only one shell per meteor shower event is spawned.

## Dependencies & Tags
- **Component**: None explicitly added or removed.
- **Tag**: None identified.
- **Dependencies**: Relies on `TheWorld.ismastersim` assertion (server-only), `TUNING.MOONROCKSHELL_CHANCE`, `SourceModifierList`, and `SpawnPrefab`.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `moonrockshell_chance` | number | `0` | Tracks cumulative progress toward guaranteed Moon Rock Shell drop; increases toward `1` on Moon Rock spawns, resets on Shell spawns. |
| `moonrockshell_chance_additionalodds` | `SourceModifierList` | `SourceModifierList(self.inst, 0, SourceModifierList.additive)` | Represents additive modifiers (e.g., from gear or effects) that increase the base chance of Moon Rock Shell drops. |

## Main Functions
### `GetRockMoonShellWaveOdds()`
* **Description:** Returns the effective additive odds (modifier + base chance) for Moon Rock Shell drops *only* if the cumulative `moonrockshell_chance` has not yet reached 1. Once `moonrockshell_chance >= 1`, returns `0`.
* **Parameters:** None.

### `GetMeteorLootPrefab(prefab)`
* **Description:** Determines the final prefab to drop when a meteor hits. For `"rock_moon"`, increases cumulative chance and optionally returns `"rock_moon_shell"` based on odds, cycle count, or random roll. For `"rock_moon_shell"`, locks in shell drop (if not yet guaranteed) and returns it with a boolean indicating it's already guaranteed. If a shell already exists and another `"rock_moon_shell"` is requested, downgrades it back to `"rock_moon"` to prevent duplicates.
* **Parameters:**  
  `prefab` (string) — The original loot prefab being considered (`"rock_moon"` or `"rock_moon_shell"`).

### `SpawnMeteorLoot(prefab)` *(Deprecated)*
* **Description:** Wraps `GetMeteorLootPrefab()` and spawns the resulting prefab. Maintained only for mod compatibility.
* **Parameters:**  
  `prefab` (string) — Original loot prefab.

### `OnSave()`
* **Description:** Returns a table containing `moonrockshell_chance` for persistent save data.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores `moonrockshell_chance` from saved data (defaults to `0` if not present).
* **Parameters:**  
  `data` (table) — Save data containing optional `moonrockshell_chance`.

## Events & Listeners
None.