---
id: spooked
title: Spooked
description: This component tracks a player's "spooked" level and triggers visual/attack events when they chop certain trees during specific seasonal conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: a8c2fa3d
---

# Spooked

## Overview
The `Spooked` component manages a player's accumulated "spooked" state, which increases upon chopping specific trees (e.g., evergreen, deciduous, twiggy, marsh, mushroom types). When the spooked level exceeds a configurable threshold and the player lacks certain protections (e.g., bravery buffs or wereform), it may trigger a spook event—rendering a tree-themed FX and dispatching a `"spooked"` event that initiates an attack. The spooked level decays over time based on in-game time elapsed.

## Dependencies & Tags
**Component Dependencies:**
- `inst.components.age` (optional, used to calculate spook age factor)
- `source.components.growable` (optional, to determine growth stage)
- `source.components.workable` (optional, to verify chopping completion)

**Tags:**
- None directly added/removed by this component. However, it responds to tags on the *inst* (e.g., `"wereplayer"`, `"woodcutter"`) and the *source*.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity (typically a player) the component is attached to. |
| `spookedlevel` | `number` | `0` | Current accumulated spooked level, ranging from 0 to `maxspookedlevel`. |
| `spookedthreshold` | `number` | `70` | Minimum `spookedlevel` required before spook attempts are considered. |
| `maxspookedlevel` | `number` | `100` | Upper bound of the spooked level. |
| `maxspookdelta` | `number` | `3.5` | Max increase per `Spook()` call (before decay adjustment). |
| `maxspookage` | `number` | `TUNING.SEASON_LENGTH_HARSH_DEFAULT * TUNING.TOTAL_DAY_TIME` | Max age (in seconds) considered for spooking effect decay. |
| `lastspooktime` | `number` | `GetTime()` at instantiation | Timestamp of the last spook-related event, used for decay calculation. |

## Main Functions

### `ShouldSpook()`
* **Description:** Determines whether a spook event should be attempted based on current spooked level, player buffs, and luck. Returns `true` if the player is likely to be spooked.
* **Parameters:** None.

### `CalcSpookedLevelDecay(t)`
* **Description:** Calculates the current spooked level after decay since `lastspooktime`. Uses a quadratic decay model over elapsed time.
* **Parameters:**
  - `t` (*number*, optional): Current time. Defaults to `GetTime()`.

### `Spook(source)`
* **Description:** Increases the spooked level based on the `source` tree, checks if a spook event should trigger, and—on success—spawns a tree-type-specific FX and schedules a `"spooked"` event. Resets `spookedlevel` to 0 after triggering.
* **Parameters:**
  - `source` (*Entity*): The tree entity being chopped. Must be one of the supported prefabs; its `growable.stage` and `workable` components determine FX selection and logic.

### `TryCustomSpook(source, fxprefab, mult)`
* **Description:** A more flexible variant of `Spook()` that allows specifying a custom FX prefab and spook multiplier. Does *not* check chopping state (i.e., does *not* restrict to "old" growth stages).
* **Parameters:**
  - `source` (*Entity*): The source entity triggering the spook.
  - `fxprefab` (*string*): Name of the FX prefab to spawn.
  - `mult` (*number*, optional): Multiplier for spook level increase (defaults to `1`, fully maxing the spooked level if not reduced by age decay).

### `GetDebugString()`
* **Description:** Returns a debug-ready string representation of the current (decayed) spooked level.
* **Parameters:** None.

## Events & Listeners
- **Listens to:** None (component does not register any event listeners itself).
- **Emits:**
  - `"spooked"` via `inst:PushEvent("spooked", { source = source })`—triggered by the `DoSpooked` callback after a delay.