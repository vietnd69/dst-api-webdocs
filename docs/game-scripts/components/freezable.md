---
id: freezable
title: Freezable
description: Manages freeze states, coldness accumulation, and thawing behavior for entities, including visual tinting, shatter effects, and resistance mechanics.
tags: [freeze, visual, combat, state, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c4a5085a
system_scope: entity
---

# Freezable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Freezable` manages the freeze state lifecycle (`NORMAL`, `FROZEN`, `THAWING`) and coldness accumulation for an entity. It integrates with `combat` (to halt targeting/movement), `locomotor` (to stop movement), `health` (to check death status), `colouradder` (for visual tinting), and `shatterfx` (for shatter effects on unfreeze). It is typically added to entities that can be frozen by environmental or enemy attacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("freezable")
inst.components.freezable:SetResistance(50)
inst.components.freezable:AddColdness(30, 10) -- Start cold accumulation
inst.components.freezable:Freeze(15) -- Manually freeze with custom freeze duration
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `colouradder`, `shatterfx`
**Tags:** Adds `freezable`; checks for `nofreeze` state tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | string | `"NORMAL"` | Current freeze state (`"FROZEN"`, `"THAWING"`, `"NORMAL"`). |
| `resistance` | number | `1` | Base coldness required to freeze the entity. |
| `extraresist` | number | `0` | Additional resistance added via diminishing returns (e.g., bosses). |
| `coldness` | number | `0` | Current accumulated coldness. |
| `wearofftime` | number | `10` | Default time (seconds) before coldness decays after freeze ends. |
| `damagetobreak` | number | `0` | Total damage needed to break a frozen state. |
| `damagetotal` | number | `0` | Accumulated damage taken while frozen. |
| `fxlevel` | number | `1` | Shatter effect level. |
| `fxdata` | table | `{}` | List of shatter FX prefabs with offsets. |

## Main functions
### `AddColdness(coldness, freezetime, nofreeze)`
*   **Description:** Adds coldness to the entity and triggers freezing, thawing, or wear-off behavior based on resistance thresholds. Does *not* update state if `coldness <= 0`.
*   **Parameters:**  
    `coldness` (number) — Amount of coldness to add (positive to accumulate, negative to reduce).  
    `freezetime` (number?) — Time in seconds the entity stays frozen before thawing (optional; uses `wearofftime` if nil).  
    `nofreeze` (boolean?) — If true, entity will not freeze even if `coldness >= resistance`.  
*   **Returns:** Nothing.
*   **Error states:**Early exit if a redirect function (set via `SetRedirectFn`) returns true.

### `Freeze(freezetime)`
*   **Description:** Immediately freezes the entity, stopping movement, targeting, and brain activity. Plays no events if already frozen or dead.
*   **Parameters:**  
    `freezetime` (number) — Duration in seconds the freeze persists before starting to thaw.
*   **Returns:** Nothing.
*   **Error states:** No effect if entity is dead (`health:IsDead()` is true) or not visible.

### `Thaw(thawtime)`
*   **Description:** Transitions the entity from `FROZEN` to `THAWING`, clearing coldness and starting the wear-off timer. Fires the `onthaw` event.
*   **Parameters:**  
    `thawtime` (number?) — Duration (seconds) before thaw completes (optional; defaults to `wearofftime`).
*   **Returns:** Nothing.
*   **Error states:** No effect if not currently `FROZEN` or if entity is dead.

### `Unfreeze()`
*   **Description:** Fully thaws the entity, resets coldness/damage counters, spawns shatter FX, and restarts the brain. Fires the `unfreeze` event and briefly blocks attacks.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if not currently frozen.

### `SetResistance(resist)`
*   **Description:** Sets the base coldness resistance required to freeze the entity.
*   **Parameters:**  
    `resist` (number) — New resistance value.
*   **Returns:** Nothing.

### `SetExtraResist(resist)`
*   **Description:** Increases or decreases extra resistance (used for boss scaling), with a decay task that gradually reduces `extraresist`.
*   **Parameters:**  
    `resist` (number) — Extra resistance value (clamped between `0` and `resistance * 2.5`).
*   **Returns:** Nothing.

### `ResolveResistance()`
*   **Description:** Returns the effective coldness resistance (base + extra, or base alone if no extra).
*   **Parameters:** None.
*   **Returns:** number — Effective resistance.

### `ResolveWearOffTime(t)`
*   **Description:** Adjusts the wear-off time based on `extraresist` (longer coldness retention when extra resistance is high).
*   **Parameters:**  
    `t` (number) — Base wear-off time in seconds.
*   **Returns:** number — Adjusted time (minimum 0.1× base, maximum 1× base).

### `AddShatterFX(prefab, offset, followsymbol)`
*   **Description:** Registers a shatter FX prefab to be spawned on unfreeze, optionally as a follower.
*   **Parameters:**  
    `prefab` (string) — Prefab name of the FX entity.  
    `offset` (vector3) — Local position offset `{x, y, z}`.  
    `followsymbol` (string?) — Symbol name to follow (if present, spawns as follower).
*   **Returns:** Nothing.

### `SetShatterFXLevel(level)`
*   **Description:** Sets the shatter effect level, passed to spawned shatter FX via `ShatterFX:SetLevel`.
*   **Parameters:**  
    `level` (number) — Effect level (clamped to `#fxlevels` in `shatterfx`).
*   **Returns:** Nothing.

### `SpawnShatterFX()`
*   **Description:** Instantiates all registered shatter FX prefabs at the entity’s position (or as followers), applies `fxlevel` via `ShatterFX:SetLevel`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsFrozen()`
*   **Description:** Checks if the entity is currently frozen (`FROZEN` or `THAWING`).
*   **Parameters:** None.
*   **Returns:** boolean — `true` if frozen.

### `IsThawing()`
*   **Description:** Checks if the entity is currently thawing (`THAWING`).
*   **Parameters:** None.
*   **Returns:** boolean — `true` if thawing.

### `UpdateTint()`
*   **Description:** Updates visual tint using `PushColour`/`PopColour` (wraps `colouradder`), applying partial or full freeze tint based on `coldness` vs `resistance`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetRedirectFn(fn)`
*   **Description:** Sets an optional callback that can intercept and override coldness addition logic.
*   **Parameters:**  
    `fn` (function) — Signature: `fn(inst, coldness, freezetime, nofreeze) -> boolean` (return `true` to skip internal logic).
*   **Returns:** Nothing.

### `GetTimeToWearOff()`
*   **Description:** Returns remaining time until coldness begins to decay.
*   **Parameters:** None.
*   **Returns:** number? — Remaining seconds, or `nil` if no wear-off task is active.

### `Reset()`
*   **Description:** Resets the entity to `NORMAL` state and clears coldness, but does *not* fire any events.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — Adds damage taken while frozen; triggers unfreeze if `damagetotal >= damagetobreak`.
- **Pushes:** `freeze` — When transitioning to `FROZEN` (state change only).  
- **Pushes:** `unfreeze` — When transitioning to `NORMAL` (state change only, not dead).  
- **Pushes:** `onthaw` — When transitioning to `THAWING`.
