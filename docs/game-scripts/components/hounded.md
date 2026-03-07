---
id: hounded
title: Hounded
description: Manages timed, escalating hound waves targeting players based on world age and group proximity.
tags: [combat, ai, boss, world, scheduling]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aa3b57c8
system_scope: world
---

# Hounded

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hounded` is a server-side component that coordinates the spawning and release of hounds (and seasonal variants like `icehound` and `firehound`) against players. It implements an escalating difficulty schedule based on average player age in days, supports grouping of nearby players (to avoid overwhelming spawns), and handles location-based immunity (e.g., water, vaults, arena). It interacts with `combat`, `houndedtarget`, `spawnfader`, `talker`, and `age` components to synchronize spawning, targeting, warnings, and sound cues.

## Usage example
```lua
local hounded = inst:AddComponent("hounded")
hounded:SetSpawnData(my_custom_data)
hounded:SpawnModeNormal()  -- default escalating mode
hounded:ForceReleaseSpawn(target)  -- manually spawn a hound targeting a player
hounded:ForceNextWave()  -- immediately trigger the next wave
```

## Dependencies & tags
**Components used:** `age`, `combat`, `houndedtarget`, `spawnfader`, `talker`, `sourcemodifierlist`

**Tags:** Checks `NOCLICK` (via `spawnfader:FadeIn`); no tags added/removed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance (typically the world) that owns this component. |
| `max_thieved_spawn_per_thief` | number | `3` | Maximum extra hounds that can be assigned to a player with `IsHoundThief()` per wave. |

*Note:* All core state variables (e.g., `_timetoattack`, `_warning`, `_activeplayers`) are private and managed internally.

## Main functions
### `GetTimeToAttack()`
* **Description:** Returns the remaining time (in seconds) until the next hound wave spawns.
* **Parameters:** None.
* **Returns:** `number` — time remaining, or `0` if spawning has started.

### `GetWarning()`
* **Description:** Indicates whether the current warning phase for the next wave is active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if warning phase is in progress, `false` otherwise.

### `GetAttacking()`
* **Description:** Indicates whether hounds are currently being spawned (i.e., the attack phase has started).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if hounds are spawning, `false` otherwise.

### `SetSpawnData(data)`
* **Description:** Replaces the internal `_spawndata` table with custom behavior (e.g., changing spawn prefabs, wave scaling, upgrade logic).
* **Parameters:** `data` (table) — must include keys such as `base_prefab`, `winter_prefab`, `summer_prefab`, `upgrade_spawn`, `attack_levels`, `attack_delays`, `warning_speech`, `warning_sound_thresholds`, and `ShouldUpgrade`.
* **Returns:** Nothing.

### `GetWorldEscalationLevel()`
* **Description:** Returns the current escalation level table (based on world cycles) used for loot drops; not used by core hounded mechanics. Matches logic in `CalcEscalationLevel`.
* **Parameters:** None.
* **Returns:** `table` — e.g., `attack_levels.light`.

### `GetSpawnPrefab(upgrade)`
* **Description:** Determines the prefab name (`hound`, `icehound`, `firehound`, or `warglet`) for the next spawn, based on season and upgrade flags.
* **Parameters:** `upgrade` (boolean) — whether to return the upgrade spawn prefab.
* **Returns:** `string` — prefab name.

### `SetSummerVariant(enabled)`
* **Description:** Enables or disables seasonal summer variant spawns (`firehound`/`warglet`).
* **Parameters:** `enabled` (boolean) — if `false`, summer variants are disabled.
* **Returns:** Nothing.

### `SetWinterVariant(enabled)`
* **Description:** Enables or disables seasonal winter variant spawns (`icehound`/`warglet`).
* **Parameters:** `enabled` (boolean) — if `false`, winter variants are disabled.
* **Returns:** Nothing.

### `SetWaveOverrideSettings(data)`
* **Description:** Sets override settings for custom wave types (e.g., `worm_boss`). Used to dynamically adjust wave intensity.
* **Parameters:** `data` (table) — `{ wavetype = "worm_boss", setting = X }`.
* **Returns:** Nothing.

### `SpawnModeNever()`
* **Description:** Disables all hound spawning.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnModeLight()`
* **Description:** Sets constant, minimal hound spawns (equivalent to "heavy" in delay, but light level in intensity).
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnModeNormal()` / `SpawnModeEscalating()`
* **Description:** Enables default escalating difficulty based on player age.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnModeMed()`
* **Description:** Sets constant, moderate difficulty hound spawns (medium wave intensity).
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnModeHeavy()`
* **Description:** Sets constant, high-intensity hound spawns (light delay, heavy wave).
* **Parameters:** None.
* **Returns:** Nothing.

### `ForceReleaseSpawn(target)`
* **Description:** Immediately spawns a hound near `target` and sets it to attack.
* **Parameters:** `target` (`Entity` or `nil`) — the entity to target.
* **Returns:** Nothing.

### `SummonSpawn(pt, radius_override)`
* **Description:** Spawns a hound at world position `pt` (with optional spawn radius deviation).
* **Parameters:** `pt` (`Vector` or `nil`) — spawn center position; `radius_override` (number, optional) — override `SPAWN_DIST` (default `30`).
* **Returns:** `Entity?` — spawned hound, or `nil` on failure.

### `ForceNextWave()`
* **Description:** Forces the next hound wave to start immediately (for debugging).
* **Parameters:** None.
* **Returns:** Nothing.

### `DoWarningSpeech()`
* **Description:** Triggers spoken warning lines (e.g., `"ANNOUNCE_HOUNDS"`) for all land-immune players not in delayed spawn groups.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoWarningSound()`
* **Description:** Fires `houndwarning` event and optional mini-quake events for land-immune players based on time thresholds.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoDelayedWarningSpeech(player, data)`
* **Description:** Handles warning speech for players whose spawns were queued after leaving/rejoining mid-wave.
* **Parameters:** `player` (`Entity`) — the player; `data` (table) — saved spawn info.
* **Returns:** Nothing.

### `DoDelayedWarningSound(player, data)`
* **Description:** Handles warning sounds for delayed players.
* **Parameters:** `player` (`Entity`) — the player; `data` (table) — saved spawn info.
* **Returns:** Nothing.

### `GetWarningSoundList(player)`
* **Description:** Returns the configured `warning_sound_thresholds` table, optionally adjusted for a specific player's state.
* **Parameters:** `player` (`Entity?`) — optional player override.
* **Returns:** `table` — e.g., `{ {time=30, sound="LVL4"}, ... }`.

### `OnUpdate(dt)`
* **Description:** Main simulation loop called every frame. Handles countdown, spawning, warnings, and delayed player updates.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes internal state for world saves, including delayed and missing player spawn info.
* **Parameters:** None.
* **Returns:** `table` — serialized state.

### `OnLoad(data)`
* **Description:** Restores state from a saved world.
* **Parameters:** `data` (table) — deserialized state from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing current state (e.g., `WARNING`, `DORMANT`, or `ATTACKING` with spawn details).
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:**
  - `"ms_playerjoined"` — adds new players to `_activeplayers`, loads their spawn data.
  - `"ms_playerleft"` — saves player spawn data to `_missingplayerspawninfo`, removes them from `_activeplayers`.
  - `"pausehounded"` / `"unpausehounded"` — updates `_pausesources`.
  - `"hounded_setdifficulty"` — sets spawn difficulty via `SetDifficulty`.
  - `"hounded_setsummervariant"` / `"hounded_setwintervariant"` — toggles seasonal variants.
  - `"hounds_worm_boss_setdifficulty"` — sets custom `worm_boss` wave settings.

- **Pushes:** No events directly. Player entities receive `"houndwarning"` and `"ms_miniquake"` events via `PushEvent`.

## Notes
- This component only exists on the **master simulation** (server) and asserts `TheWorld.ismastersim`.
- Hound spawns are grouped by proximity to avoid overwhelming players. Group size affects spawn count scaling.
- Location immunity is tracked in `_targetableplayers`; players on water or in vaults/arenas may be excluded from targeting during a wave.
- Delayed player spawn info is stored for players who join or leave during the warning or attack phase, ensuring continuity across sessions.
