---
id: worldmeteorshower
title: Worldmeteorshower
description: Controls meteor loot generation logic, including conditional replacement of moon rocks with moon rock shells based on accumulated odds.
tags: [meteor, loot, world, weather, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 99bc8c48
system_scope: world
---

# Worldmeteorshower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldmeteorshower` is a world-level component that manages the probability and logic for replacing standard moon rocks (`rock_moon`) with moon rock shells (`rock_moon_shell`) during meteor showers. It tracks a cumulative chance (`moonrockshell_chance`) that increases when a moon rock is dropped, and uses this to determine whether a shell should be generated instead. It also supports additive modifiers to the base chance via `SourceModifierList`.

This component is intended to be attached only to the master simulation world entity (`TheWorld`), as enforced by an assertion in the constructor.

## Usage example
```lua
if TheWorld.ismastersim then
    TheWorld:AddComponent("worldmeteorshower")
    local prefab = TheWorld.components.worldmeteorshower:GetMeteorLootPrefab("rock_moon")
    local instance = SpawnPrefab(prefab)
end
```

## Dependencies & tags
**Components used:** `SourceModifierList` (from `util/sourcemodifierlist.lua`)  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `moonrockshell_chance` | number | `0` | Accumulated probability (0–1) that the next moon rock drop will be replaced with a moon rock shell. |
| `moonrockshell_chance_additionalodds` | SourceModifierList | `SourceModifierList(self.inst, 0, SourceModifierList.additive)` | Additive modifier list for adjusting the base moonrock shell chance (e.g., via game mode tuning or events). |

## Main functions
### `GetRockMoonWaveOdds()`
*   **Description:** Returns the current additional odds (from modifiers) for a moonrock shell to appear *if* the base `moonrockshell_chance` is less than `1`. Used to expose modifier-driven adjustments for UI or logic.
*   **Parameters:** None.
*   **Returns:** number — the current total additive odds value, or `0` if `moonrockshell_chance >= 1`.

### `GetMeteorLootPrefab(prefab)`
*   **Description:** Determines the actual loot prefab to spawn based on meteor loot rules. For `"rock_moon"`, it may replace it with `"rock_moon_shell"` depending on accumulated chance and random check. For `"rock_moon_shell"`, ensures no duplicates and updates state. Returns the final prefab name and optionally a flag indicating special handling.
*   **Parameters:**  
  `prefab` (string) — The requested loot prefab (`"rock_moon"` or `"rock_moon_shell"`).
*   **Returns:**  
  `prefab` (string) — The actual prefab to spawn.  
  *(optional)* `is_shell_duplicate` (boolean) — `true` only when the input was `"rock_moon_shell"` but it was downgraded to `"rock_moon"` to avoid duplicates.
*   **Error states:**  
  - If `moonrockshell_chance >= 1` and input is `"rock_moon_shell"`, it returns `"rock_moon"` and a `true` flag to indicate it was downgraded.  
  - Otherwise, if the chance conditions are met, it sets `moonrockshell_chance = 1` and returns `"rock_moon_shell"`.

### `SpawnMeteorLoot(prefab)` *(Deprecated)*
*   **Description:** Legacy wrapper to spawn meteor loot. Internally calls `GetMeteorLootPrefab()` and then `SpawnPrefab()`. Kept for mod compatibility.
*   **Parameters:**  
  `prefab` (string) — The requested loot prefab.
*   **Returns:** entity — The spawned instance from `SpawnPrefab()`.
*   **Error states:** None beyond what `SpawnPrefab()` may throw.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
