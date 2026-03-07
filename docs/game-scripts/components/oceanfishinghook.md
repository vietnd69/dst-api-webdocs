---
id: oceanfishinghook
title: Oceanfishinghook
description: Manages fishing lure behavior and fish attraction mechanics in the ocean, including charm calculation, interest tracking, and reel-based modifiers.
tags: [fishing, environment, fish, attraction, multiplayer]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a844668f
system_scope: environment
---

# Oceanfishinghook

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`OceanFishingHook` is a component that enables entities (typically fishing hooks) to interact with fish in the ocean. It calculates attraction ("charm") based on lure properties, time of day, weather, fish preferences, and perish status. It also tracks fish-specific interest levels and supports reel-motion detection via physics velocity updates. It integrates with the `perishable` component to scale charm based on freshness.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanfishinghook")
local lure_data = {
    charm = 1.0,
    reel_charm = 0.5,
    timeofday = { ["day"] = 1.2, ["dusk"] = 1.0, ["night"] = 0.8 },
    weather = { ["raining"] = 1.5, ["snowing"] = 0.7, ["default"] = 1.0 },
    style = "worm",
}
local lure_fns = { charm_mod_fn = function(fish) return fish.GUID % 2 == 0 and 1.2 or 1.0 end }
inst.components.oceanfishinghook:SetLureData(lure_data, lure_fns)
inst.components.oceanfishinghook:TestInterest(some_fish)
```

## Dependencies & tags
**Components used:** `perishable` (for `GetPercent()`), `physics` (for velocity), `net` (for `IsServerPaused()`), `the_world` (for world state: `israining`, `issnowing`, `phase`)
**Tags:** Adds `fishinghook` on construction; removes on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `interest` | table | `{}` | Map of fish GUID → interest level (number), used to track attraction decay/growth. |
| `lure_data` | table or `nil` | `nil` | Lure configuration including `charm`, `reel_charm`, `timeofday`, `weather`, and `style`. |
| `lure_fns` | table | `{}` | Optional function table, e.g., `charm_mod_fn`. |
| `reel_mod` | number | `0` | Multiplier applied to `reel_charm` when the hook is moving (velocity-based). |
| `debug_fish_lure_prefs` | table or `nil` | `nil` | Internal cache used for debug output. |

## Main functions
### `SetLureData(lure_data, lure_fns)`
* **Description:** Assigns lure configuration and optional modifier functions. Begins periodic updates if `lure_data.reel_charm` is set.
* **Parameters:**  
  - `lure_data` (table) — Must contain at least `charm` (number) and optionally `reel_charm`, `timeofday`, `weather`, and `style`.  
  - `lure_fns` (table, optional) — Function table; supports `charm_mod_fn(fish)`.
* **Returns:** Nothing.
* **Error states:** If `lure_data.reel_charm ~= nil`, starts component updates via `StartUpdatingComponent`.

### `:ClacCharm(fish)`
* **Description:** Computes the total charm (attraction score) for a given fish, combining base charm, reel modifier, perish freshness, time of day, weather, lure style compatibility, and custom modifier functions. *(Note: Function name appears to be a typo for `CalcCharm`.)*
* **Parameters:**  
  - `fish` (table/entity with `fish_def.lures`, `GUID`) — The fish to evaluate.
* **Returns:** Number — The computed charm value (≥ 0).
* **Error states:** Returns early with `0` if `lure_data.timeofday[phase]` or `lure_data.weather[weather]` are missing and no fallback exists.

### `HasLostInterest(fish)`
* **Description:** Checks whether interest in the specified fish has dropped to zero (i.e., attraction exhausted).
* **Parameters:**  
  - `fish` (table/entity with `GUID`) — The fish to check.
* **Returns:** Boolean — `true` if `interest[fish.GUID] <= 0`, otherwise `false`.

### `SetLostInterest(fish)`
* **Description:** Explicitly sets interest in a fish to `0`.
* **Parameters:**  
  - `fish` (table/entity with `GUID`) — The fish whose interest is to expire.
* **Returns:** Nothing.

### `ClearLostInterestList()`
* **Description:** Resets the entire interest tracking table.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateInterestForFishable(fish)`
* **Description:** Updates and returns the interest level for a fish. Grows interest if not already present or already positive; otherwise does nothing.
* **Parameters:**  
  - `fish` (table/entity with `GUID`) — The fish to update interest for.
* **Returns:** Number — Current interest level (may be `nil` initially).
* **Error states:** Returns early with current value if interest is already `<= 0`.

### `TestInterest(fish)`
* **Description:** Determines whether a fish is still a valid target for fishing — checks both interest and proximity within `lure_data.radius`.
* **Parameters:**  
  - `fish` (table/entity with `GUID`) — The fish to test.
* **Returns:** Boolean — `true` if interest exists and fish is within range.
* **Error states:** Returns `false` if `interest[fish.GUID]` is missing or `<= 0`, or if distance check fails.

### `GetDebugString()`
* **Description:** Generates a multi-line debug string summarizing current charm components and per-fish interest levels.
* **Parameters:** None.
* **Returns:** String — Human-readable charm breakdown and interest table.

### `OnUpdate(dt)`
* **Description:** Called periodically while the component is active (e.g., when `reel_charm` is enabled). Updates `reel_mod` based on physics velocity — sets to `1` when moving (`vx² + vz² >= 0.1`), otherwise decays toward `0`.
* **Parameters:**  
  - `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `OnWallUpdate(dt)`
* **Description:** Proxy method for wall update callbacks. Delegates to `onwallupdate` if set.
* **Parameters:**  
  - `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns immediately if `TheNet:IsServerPaused()` is `true`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
