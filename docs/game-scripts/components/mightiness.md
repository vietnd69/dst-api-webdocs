---
id: mightiness
title: Mightiness
description: Manages Wolfgang's physical transformation system based on his current mightiness level, dynamically adjusting stats, animations, sounds, and gameplay modifiers.
tags: [player, transformation, combat, work, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f093f786
system_scope: player
---

# Mightiness

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mightiness` implements the transformation logic for the character Wolfgang, switching between `wimpy`, `normal`, and `mighty` states based on a dynamic `current` value relative to `max`. It responds to hunger changes and gym usage, and synchronizes skin, sound, animation scale, insulation, and work multipliers across connected components. It integrates closely with `combat`, `temperature`, `hunger`, `expertsailor`, `workmultiplier`, `efficientuser`, `skinner`, `talker`, `rider`, `rider`, `coach`, `health`, and `rider` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mightiness")
inst.components.mightiness:SetMax(TUNING.MIGHTINESS_MAX)
inst.components.mightiness:DoDelta(100) -- raise mightiness
inst.components.mightiness:DelayDrain(5) -- prevent drain for 5 seconds
```

## Dependencies & tags
**Components used:** `combat`, `temperature`, `hunger`, `expertsailor`, `workmultiplier`, `efficientuser`, `skinner`, `talker`, `rider`, `coach`, `health`, `strongman`, `rider`  
**Tags:** Adds `mightiness_wimpy`, `mightiness_normal`, or `mightiness_mighty`; checks `mightiness_wimpy`, `mightiness_normal`, `mightiness_mighty`, `playerghost`, `ingym`, `nomorph`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `TUNING.MIGHTINESS_MAX` | Maximum mightiness threshold. |
| `current` | number | `max / 2` | Current mightiness value. |
| `rate` | number | `TUNING.MIGHTINESS_DRAIN_RATE` | Base drain rate per second. |
| `drain_multiplier` | number | `TUNING.MIGHTINESS_DRAIN_MULT_NORMAL` | Multiplier applied to drain rate based on hunger level. |
| `ratescale` | number | `RATE_SCALE.NEUTRAL` | Global scale factor for drain rate. |
| `draining` | boolean | `true` | Controls whether mightiness automatically drains over time. |
| `state` | string | `"normal"` | Current transformation state: `"wimpy"`, `"normal"`, or `"mighty"`. |
| `invincible` | boolean | `false` | Prevents drain when true (set via `invincibletoggle` event). |
| `overmaxmax` | number | `0` | Additional buffer above `max` (typically set by gym). |

## Main functions
### `DoDelta(delta, force_update, delay_skin, forcesound, fromgym)`
*   **Description:** Adjusts `current` mightiness by `delta`, triggers state transitions, and updates all associated game systems.
*   **Parameters:** `delta` (number) - amount to change current mightiness; `force_update` (boolean) - skip checks and force transformation; `delay_skin` (boolean) - delay skin update; `forcesound` (boolean) - play sound even in silent context; `fromgym` (boolean) - allows raising above `max`.
*   **Returns:** Nothing.
*   **Error states:** `delta` can be negative or positive; negative values reduce mightiness, positive values increase it (capped at `max + overmaxmax` if `fromgym` is true).

### `BecomeState(state, silent, delay_skin, forcesound)`
*   **Description:** Transitions to a new state (`"wimpy"`, `"normal"`, or `"mighty"`), applying skins, sounds, scales, tags, and modifier updates.
*   **Parameters:** `state` (string) - target state; `silent` (boolean) - skip announce/sound events; `delay_skin` (boolean) - defer skin update; `forcesound` (boolean) - override silence for sound.
*   **Returns:** Nothing.
*   **Error states:** Returns early without action if transformation is blocked (e.g., ghost, dead, in `nomorph` state, or same state).

### `GetScale()`
*   **Description:** Returns the animation scale factor associated with the current state.
*   **Parameters:** None.
*   **Returns:** `number` (scale factor, e.g., `0.9`, `1.0`, or `1.2`).

### `SetRate(rate)`
*   **Description:** Overrides the base drain rate.
*   **Parameters:** `rate` (number) - new per-second drain rate.
*   **Returns:** Nothing.

### `SetRateScale(ratescale)`
*   **Description:** Sets the global rate multiplier.
*   **Parameters:** `ratescale` (number, e.g., `RATE_SCALE.SLOW`, `RATE_SCALE.FAST`) - multiplier factor.
*   **Returns:** Nothing.

### `DelayDrain(time)`
*   **Description:** Extends the cooldown before drain resumes (used after gaining mightiness or using dumbbells).
*   **Parameters:** `time` (number) - seconds from now to delay drain until.
*   **Returns:** Nothing.

### `SetMax(amount)`
*   **Description:** Resets `max` and `current` to the new value.
*   **Parameters:** `amount` (number) - new maximum mightiness.
*   **Returns:** Nothing.

### `SetOverMax(amount)`
*   **Description:** Sets additional buffer above `max` (e.g., from gym upgrades).
*   **Parameters:** `amount` (number) - extra capacity above `max`.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns current mightiness as a fraction of `max`.
*   **Parameters:** None.
*   **Returns:** `number` in range `[0, 1]`.

### `SetPercent(percent, force_update, delay_skin, forcesound)`
*   **Description:** Sets `current` to `percent * max`.
*   **Parameters:** `percent` (number) - target fraction (e.g., `0.5`); other args same as `DoDelta`.
*   **Returns:** Nothing.

### `IsMighty()`, `IsNormal()`, `IsWimpy()`
*   **Description:** Convenience methods to check current state.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `OnHungerDelta(data)`
*   **Description:** Updates `drain_multiplier` based on hunger percentage (`data.newpercent`). Used as an event listener.
*   **Parameters:** `data` (table, optional) - must contain `newpercent` if present.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `hungerdelta` – updates `drain_multiplier` based on hunger level.  
  `invincibletoggle` – sets `invincible` flag (prevents drain).  
  `mounted` – resets animation scale to `1`.  
  `dismounted` – re-applies mightiness-based scale.  
- **Pushes:**  
  `mightinessdelta` – fired after each `DoDelta`, with `{ oldpercent, newpercent, delta }`.  
  `mightiness_statechange` – fired after each state change, with `{ previous_state, state }`.  

### Additional Notes
- Network synchronization: `current` and `ratescale` use networked replica properties (`player_classified.currentmightiness`, `player_classified.mightinessratescale`) for client-server consistency.
- The component automatically runs a periodic task (every `1` second) to apply drain if `draining` is `true` and not paused/invincible.
- Skin updates for `mighty`/`wimpy` states are deferred by `88` frames unless `delay_skin` is `false`.
