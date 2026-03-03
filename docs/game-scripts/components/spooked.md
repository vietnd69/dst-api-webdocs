---
id: spooked
title: Spooked
description: Manages seasonal spook level accumulation and triggers spook events (e.g., tree-specific FX) when spook level exceeds a threshold.
tags: [season, environment, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a8c2fa3d
system_scope: environment
---

# Spooked

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Spooked` tracks a numerical spook level on an entity (typically the player), which increases over time and in response to specific environmental interactions (e.g., chopping certain trees). When the level surpasses a configurable threshold (`spookedthreshold`), it can trigger special effects (`battreefx` or custom FX prefabs) via `Spook` and `TryCustomSpook`. It integrates with `age`, `growable`, and `workable` components to make spook decisions context-aware (e.g., only triggering for fully grown or workable trees). The component also accounts for special immunity states (e.g., Halloween potion buffs, wereplayers) and spook level decay over time.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("spooked")

-- Trigger spook from a workable tree
inst.components.spooked:Spook(source_tree)

-- Manually increase spook level with custom FX
inst.components.spooked:TryCustomSpook(source, "custom_spook_fx", 0.8)
```

## Dependencies & tags
**Components used:** `age`, `growable`, `workable`  
**Tags:** Checks `wereplayer`, `woodcutter`; checks debuff `halloweenpotion_bravery_buff`. No tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spookedlevel` | number | `0` | Current accumulated spook level; increases on events, decays over time. |
| `spookedthreshold` | number | `70` | Minimum `spookedlevel` required to consider triggering a spook event. |
| `maxspookedlevel` | number | `100` | Upper bound on `spookedlevel`. |
| `maxspookdelta` | number | `3.5` | Maximum incremental increase in `spookedlevel` per spook event (from standard `Spook`). |
| `maxspookage` | number | `TUNING.SEASON_LENGTH_HARSH_DEFAULT * TUNING.TOTAL_DAY_TIME` | Normalized age reference used to scale spook accumulation over time. |
| `lastspooktime` | number | `GetTime()` at creation | Last timestamp when `spookedlevel` was updated. |

## Main functions
### `ShouldSpook()`
* **Description:** Determines whether a spook event should proceed based on current `spookedlevel`, immunity status, and luck. Returns `true` only if spook level exceeds the threshold and luck roll passes.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a spook effect should trigger, `false` otherwise.
* **Error states:** Returns `false` if `spookedlevel <= spookedthreshold`, if entity has debuff `halloweenpotion_bravery_buff`, or if entity has tag `wereplayer`.

### `Spook(source)`
* **Description:** Increases `spookedlevel` using the provided source entity (e.g., a tree), applies age scaling, and optionally spawns spook FX and fires `spooked` event if `ShouldSpook()` passes. Resets `spookedlevel` to `0` on success. Only triggers FX for sources with valid prefabs and final growth/work stage.
* **Parameters:** `source` (Entity) — the object triggering the spook event (e.g., a tree).
* **Returns:** Nothing.
* **Error states:** No FX or event occurs if `source` is not a finished chopping event (i.e., stage ≠ `4` or not workable/choppable), or if `ShouldSpook()` fails.

### `TryCustomSpook(source, fxprefab, mult)`
* **Description:** Similar to `Spook`, but allows specifying a custom FX prefab and scaling multiplier (`mult`). Spook level is calculated with full `maxspookedlevel` scaling, often resulting in max spook unless `mult < 1`.
* **Parameters:**  
  * `source` (Entity) — the source entity triggering the spook.  
  * `fxprefab` (string) — prefab name for the FX entity to spawn.  
  * `mult` (number, optional) — multiplier for spook level increment; defaults to `1`.
* **Returns:** `Entity` — the spawned FX entity (e.g., `battreefx`), or `nil` if no spook was triggered.
* **Error states:** Returns `nil` if `ShouldSpook()` returns `false`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string representing the current decayed `spookedlevel`.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"spookedlevel = X.XX"` where `X.XX` is the current decayed value.

### `CalcSpookedLevelDecay(t)`
* **Description:** Calculates how much spook level has decayed since `lastspooktime` up to time `t`. Used internally to prevent spook level from persisting indefinitely.
* **Parameters:** `t` (number, optional) — current time; defaults to `GetTime()`.
* **Returns:** `number` — non-negative decayed spook level.
* **Error states:** Always returns `0` or positive number.

## Events & listeners
- **Listens to:** None directly. Uses `ThePlayer:DoTaskInTime(...)` delays to fire events asynchronously.
- **Pushes:** `spooked` — fired with `{ source = source }` data after a delay (8 or 10 frames for `woodcutter` or default), via the `DoSpooked` helper function.
