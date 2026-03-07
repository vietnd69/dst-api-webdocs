---
id: transparentonsanity
title: Transparentonsanity
description: Adjusts an entity's transparency and sound volume based on the player's sanity and combat state, with optional custom logic.
tags: [visual, audio, sanity, client]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8a5789c3
system_scope: visual
---
# Transparentonsanity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TransparentOnSanity` is a client-side component that dynamically adjusts an entity's visual transparency (alpha) and sound volume based on the player's sanity level and whether the entity is targeting the player. It also supports a custom function for defining transparency percentage. The component runs only on the client and should not drive server-side logic. It integrates with the `AnimState` and `SoundEmitter` components to apply alpha and volume overrides, respectively.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("transparentonsanity")

-- Optional: Provide custom transparency calculation
inst.components.transparentonsanity.calc_percent_fn = function(ent, player)
    return player.replica.sanity:GetPercent() * 0.5
end

-- Optional: Provide callback when alpha changes
inst.components.transparentonsanity.onalphachangedfn = function(inst, alpha, most_alpha)
    print("Alpha changed to", alpha)
end

inst:AddTag("transparent_entity")
```

## Dependencies & tags
**Components used:** `animstate`, `soundemitter`, `combat` (replica), `sanity` (replica)
**Tags:** None added, removed, or checked by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offset` | number | `math.random()` | Internal phase offset for sine wave oscillation. |
| `osc_speed` | number | `0.25 + math.random() * 2` | Speed of alpha oscillation. |
| `osc_amp` | number | `0.25` | Amplitude of alpha oscillation (variance). |
| `alpha` | number | `0` | Current alpha value applied to the entity. |
| `most_alpha` | number | `0.4` | Maximum alpha value used as baseline scaling. |
| `target_alpha` | number or `nil` | `nil` | Desired alpha value computed each update. |
| `calc_percent_fn` | function or `nil` | `nil` | Optional custom function `(inst, player) => pct`. |
| `onalphachangedfn` | function or `nil` | `nil` | Optional callback `(inst, alpha, most_alpha) => nil`. |

## Main functions
### `CalcaulteTargetAlpha()`
* **Description:** Computes the target alpha based on the player's sanity and combat state. Returns `0` if no player is available.
* **Parameters:** None.
* **Returns:** `number` — the computed target alpha.
* **Error states:** Returns `0` if `ThePlayer` is `nil`. Uses default logic if no custom `calc_percent_fn` or sanity data is available.

### `DoUpdate(dt, force)`
* **Description:** Updates the current alpha toward `target_alpha` over time, using linear interpolation when `force` is false. Applies the new alpha to `AnimState` and `SoundEmitter`.
* **Parameters:**
  * `dt` (number) — delta time since last frame.
  * `force` (boolean) — if `true`, sets `alpha` directly to `target_alpha`; otherwise interpolates.
* **Returns:** Nothing.
* **Error states:** No explicit error states; handles `nil` `SoundEmitter` gracefully.

### `ForceUpdate()`
* **Description:** Immediately updates and applies the current target alpha without interpolation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Called when the entity goes to sleep; stops component updates to save resources.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Called when the entity wakes up; resumes component updates and performs a forced update.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation of the current alpha.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"alpha = 0.28"`.

## Events & listeners
None identified.

