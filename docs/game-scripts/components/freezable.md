---
id: freezable
title: Freezable
description: Manages freeze states, coldness accumulation, and visual/tactical effects (e.g., freezing, shattering, tinting) for entities in response to cold damage.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c4a5085a
---

# Freezable

## Overview
The `freezable` component tracks coldness levels and controls freeze-related behavior for an entity, including state transitions (NORMAL → FROZEN → THAWING → NORMAL), visual tinting, shatter FX, resistance management, and response to attacks while frozen. It integrates with the Entity Component System to apply and manage cold-based mechanics dynamically.

## Dependencies & Tags
- **Component dependencies**: None directly added via `AddComponent` in the constructor.
- **Tags added**: `"freezable"` is added on construction and removed on entity removal.
- **Event listeners**: `"attacked"` (handles shatter logic when damage is taken while frozen).
- **Optional component usage**:
  - `colouradder` (if present, used for tinting; fallback to `AnimState:SetAddColour`)
  - `health` (checked for death state before applying freeze effects)
  - `combat`, `locomotor`, `brain` (used to halt actions during freeze/unfreeze)
  - `shatterfx` (applied to spawned FX prefabs)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | string | `"NORMAL"` | Current freeze state: `"NORMAL"`, `"FROZEN"`, or `"THAWING"`. |
| `resistance` | number | `1` | Base cold resistance threshold before freezing occurs. |
| `coldness` | number | `0` | Accumulated coldness; compared against `resistance` to determine freeze state. |
| `wearofftime` | number | `10` | Default duration (seconds) for wear-off timer before transitioning states. |
| `damagetotal` | number | `0` | Total damage taken while frozen (used for shatter threshold). |
| `damagetobreak` | number | `0` | Damage threshold that, when exceeded while frozen, triggers un-freeze (shatter). |
| `fxlevel` | number | `1` | Shatter FX level (applied to spawned shatter particles). |
| `fxdata` | table | `{}` | List of FX definitions (prefab, offset, follow symbol) for shatter effects. |
| `extraresist` | number | `nil` | Bonus resistance (used for diminishing returns, typically boss-specific). |
| `diminishingtask` | task | `nil` | Periodic task reducing `extraresist` over time (if enabled). |

*Note:* Properties `diminishingreturns`, `redirectfn`, and `onfreezefn` are declared but commented out or left as `nil` by default; they are not active unless explicitly set externally.

## Main Functions

### `AddColdness(coldness, freezetime, nofreeze)`
* **Description:** Adds coldness to the entity and determines whether it freezes, thaws, or merely starts wearing off based on current coldness vs. resistance. Handles state transitions (e.g., freeze, wear-off scheduling).
* **Parameters:**
  - `coldness` (number): Amount of coldness to add (positive = add, negative = remove).
  - `freezetime` (number, optional): Duration for the freeze wear-off timer if freezing occurs.
  - `nofreeze` (boolean, optional): If true, prevents immediate freezing even if `coldness >= resistance`.

### `Freeze(freezetime)`
* **Description:** Immediately sets the state to `"FROZEN"`, halts the entity's brain and locomotion, stops combat targeting, schedules wear-off, spawns shatter FX (if configured), updates tint, and optionally adds bonus resistance if `diminishingreturns` is enabled. Only triggers if the entity is visible and not dead.
* **Parameters:**
  - `freezetime` (number, optional): Overrides `wearofftime` for the initial freeze wear-off delay.

### `Unfreeze()`
* **Description:** Resets state to `"NORMAL"`, clears `coldness` and `damagetotal`, spawns shatter FX, resets tint, restarts the brain (with `"frozen"` reason), and pushes the `"unfreeze"` event. Prevents immediate re-attack for 0.3s if `combat` component exists.

### `Thaw(thawtime)`
* **Description:** Transitions from `"FROZEN"` to `"THAWING"` (only if not dead), sets `coldness = 0`, pushes the `"onthaw"` event, and schedules wear-off with the given or resolved time. Does *not* immediately thaw completely—requires subsequent wear-off.

### `StartWearingOff(wearofftime)`
* **Description:** Schedules the `WearOff` callback to run after a delay. `WearOff` handles state progression (e.g., frozen → thawing → unfreeze) based on current state and residual coldness.
* **Parameters:**
  - `wearofftime` (number, optional): Overrides default `wearofftime` for scheduling.

### `SetResistance(resist)`
* **Description:** Updates the base cold resistance threshold (`resistance`). Affects how much `coldness` is needed to freeze.

### `SetDefaultWearOffTime(wearofftime)`
* **Description:** Updates the default `wearofftime` used by `StartWearingOff`.

### `SetExtraResist(resist)`
* **Description:** Sets bonus resistance (`extraresist`) with clamping (0 to `resistance * 2.5`). If positive, starts or restarts the `diminishingtask` to decay `extraresist` over time (every 30s). Used for persistent resistances (e.g., boss mechanics).

### `ResolveResistance()`
* **Description:** Returns the effective resistance: `resistance + extraresist` (capped at `resistance * 2.5`) if `extraresist` exists; otherwise returns `resistance`.

### `ResolveWearOffTime(t)`
* **Description:** Returns adjusted wear-off time based on `extraresist`. Higher `extraresist` increases duration (capped at 10% of original time).

### `UpdateTint()`
* **Description:** Applies or removes a blueish tint (`FREEZE_COLOUR`) via `colouradder` or `AnimState.SetAddColour`, proportional to coldness relative to resistance.

### `AddShatterFX(prefab, offset, followsymbol)`
* **Description:** Adds a shatter FX definition (prefab, positional offset, optional follow symbol) to `fxdata` for later spawning during `Unfreeze`/`Thaw`.

### `SpawnShatterFX()`
* **Description:** Spawns and positions all registered shatter FX prefabs (using `FollowSymbol` or direct child positioning). Applies `fxlevel` if the spawned prefab has a `shatterfx` component.

### `IsFrozen()`, `IsThawing()`, `GetTimeToWearOff()`, `GetDebugString()`
* **Description:** Helper/query functions for state checking and diagnostics. `GetTimeToWearOff()` returns remaining time on the wear-off task.

### `Reset()`
* **Description:** Resets `state` to `"NORMAL"` and `coldness` to `0`, updating tint. Does *not* push events.

### `OnSave()`, `OnLoad(data)`
* **Description:** Save/load hooks for persistence. `OnSave` returns `extraresist` (if >0) scaled to 0.1 precision; `OnLoad` restores it.

## Events & Listeners
- **Listens to:**
  - `"attacked"` → triggers `OnAttacked` (shatters frozen entities when damage exceeds `damagetobreak`)
- **Pushes events:**
  - `"freeze"` → on transition to `"FROZEN"` (only if state changed)
  - `"unfreeze"` → on transition to `"NORMAL"` (only if not dead)
  - `"onthaw"` → on transition to `"THAWING"`