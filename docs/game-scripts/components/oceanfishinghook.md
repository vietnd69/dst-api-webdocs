---
id: oceanfishinghook
title: Oceanfishinghook
description: Calculates and manages fishing lure charm and interest for fish entities, updating interest over time based on charm modifiers and movement.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: a844668f
---

# Oceanfishinghook

## Overview
The `OceanFishingHook` component manages the fishing hook's interaction with fish by calculating charm-based attraction, tracking interest in specific fish over time, and adjusting attraction based on lure movement, perishability, time of day, weather, and lure style. It is attached to fishing hook entities and operates as part of the Entity Component System in Don't Starve Together.

## Dependencies & Tags
- Adds the tag `"fishinghook"` to the host entity.
- Uses `self.inst:StartWallUpdatingComponent(self)` to register for wall updates (likely for server-side logic).
- Requires presence of `perishable` component for charm calculation (if present).
- Uses `TheWorld.state` (e.g., `raining`, `issnowing`, `phase`, `israining`) and `TheNet:IsServerPaused()` for conditional logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity (the fishing hook). |
| `interest` | `table` | `{}` | Map of fish GUIDs to interest values (negative values indicate lost interest). |
| `lure_data` | `table` or `nil` | `nil` | Lure configuration data (charm, reel_charm, timeofday, weather, style, radius). |
| `lure_fns` | `table` | `{}` | Custom hook functions (e.g., `charm_mod_fn`). |
| `reel_mod` | `number` | `0` | Movement-based modifier (1 when moving, lerps to 0 when stationary). |

## Main Functions
### `SetLureData(lure_data, lure_fns)`
* **Description:** Sets the lure configuration and optional custom functions. Starts component updates if `reel_charm` is present in `lure_data`.
* **Parameters:**
  - `lure_data`: Table containing charm values and modifiers (e.g., `charm`, `reel_charm`, `timeofday`, `weather`, `style`, `radius`).
  - `lure_fns`: Optional table of functions (e.g., `charm_mod_fn(fish)`).

### `_ClacCharm(fish)`
* **Description:** Computes the total charm (attraction strength) for a given fish, applying modifiers for perishability, time of day, weather, lure style, and custom functions. Note: Function name likely contains typo (`Clac` → `Calc`).
* **Parameters:**
  - `fish`: The fish entity to evaluate (used for style preferences and charm functions).

### `HasLostInterest(fish)`
* **Description:** Returns `true` if interest in the given fish has been depleted (i.e., interest value ≤ 0).
* **Parameters:**
  - `fish`: The fish entity to check.

### `SetLostInterest(fish)`
* **Description:** Marks the fish as no longer interesting by setting its interest value to `0`.
* **Parameters:**
  - `fish`: The fish entity to update.

### `ClearLostInterestList()`
* **Description:** Resets all interest values (clears the `interest` table).

### `UpdateInterestForFishable(fish)`
* **Description:** Increases interest in the given fish if not already lost. Interest accumulates using charm × 0.2 per update; initial entry uses full charm.
* **Parameters:**
  - `fish`: The fish entity whose interest is being updated.

### `OnUpdate(dt)`
* **Description:** Called during component updates (when `reel_charm` is active). Adjusts `reel_mod` based on hook velocity (1 if moving, lerps to 0 if stationary).
* **Parameters:**
  - `dt`: Delta time since last frame.

### `TestInterest(fish)`
* **Description:** Determines whether the hook should attempt to catch the fish (interest must be positive or unset, and fish must be within lure radius).
* **Parameters:**
  - `fish`: The fish entity to test.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing current charm factors, interest values, and modifiers for inspection.
* **Parameters:** None.

### `OnWallUpdate(dt)`
* **Description:** Server-side update hook (likely for wall updates during fishing). Delegates to a custom `onwallupdate` handler if set.
* **Parameters:**
  - `dt`: Delta time since last frame.

## Events & Listeners
None identified.