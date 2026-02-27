---
id: grogginess
title: Grogginess
description: Manages the grogginess state and effects—including knockouts and speed reduction—for an entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 8af1bddb
---

# Grogginess

## Overview
The `Grogginess` component tracks and governs an entity’s grogginess level—determining whether it becomes knocked out, slows down, or recovers—by managing grogginess accumulation, resistance modifiers, decay, and state transitions. It integrates with the entity’s locomotion system to apply speed modifiers and interacts with state graphs to trigger knockout events.

## Dependencies & Tags
- **Component Dependencies**:  
  - `inst.components.locomotor` (used to apply/remove speed multipliers)  
  - `inst.components.health` (checked for death or fire damage during knockout conditions)  
  - `inst.components.burnable` (checked for burning status during knockout conditions)
- **Tags Added/Removed**:  
  - Adds `"groggy"` tag when `isgroggy` becomes true (and speed mod is enabled)  
  - Removes `"groggy"` tag when `isgroggy` becomes false (or speed mod is disabled)  
- **Modifier Lists Used** (internal):  
  - `RESISTANCE_MODIFIER_LIST_KEY = "groggyresistance"` (additive)  
  - `IMMUNITY_MODIFIER_LIST_KEY = "groggyimmunity"` (boolean)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the parent entity. |
| `resistance` | `number` | `1` | Base grogginess threshold; exceeding it may trigger knockout. |
| `grog_amount` | `number` | `0` | Current accumulated grogginess value. |
| `knockouttime` | `number` | `0` | Time elapsed in current knockout state. |
| `knockoutduration` | `number` | `0` | Target duration (in seconds) for knockout. |
| `wearofftime` | `number` | `0` | Time elapsed during wearoff recovery phase. |
| `wearoffduration` | `number` | `TUNING.GROGGINESS_WEAR_OFF_DURATION` | Total duration for the wearoff transition. |
| `decayrate` | `number` | `TUNING.GROGGINESS_DECAY_RATE` | Rate at which `grog_amount` decreases per second. |
| `speedmod` | `number?` | `nil` | Cached speed modifier value (applied to locomotor). |
| `speedmodmult` | `number` | `1` | Multiplier applied to `speedmod` when setting locomotor speed. |
| `enablespeedmod` | `boolean` | `true` | Whether grogginess should apply speed modifiers. |
| `isgroggy` | `boolean` | `false` | Whether entity is currently in groggy state. |
| `knockedout` | `boolean` | `false` | Whether the entity is currently knocked out. |
| `_resistance_sources` | `SourceModifierList` | — | Tracks additive resistance modifiers. |
| `_immunity_sources` | `SourceModifierList` | — | Tracks boolean immunity (prevents grogginess buildup/decay). |
| `knockouttestfn` | `function?` | `DefaultKnockoutTest` | Function returning `true` if entity should enter knockout. |
| `cometotestfn` | `function?` | `DefaultComeToTest` | Function returning `true` if knockout should end. |
| `whilegroggyfn` | `function?` | `DefaultWhileGroggy` | Function called each tick while groggy (applies speed mod). |
| `whilewearingofffn` | `function?` | `DefaultWhileWearingOff` | Function called each tick during wearoff. |
| `onwearofffn` | `function?` | `DefaultOnWearOff` | Function called when wearoff completes. |

## Main Functions
### `SetSpeedModMultiplier(mult)`
* **Description:** Sets a multiplier applied to the calculated groggy speed modifier (e.g., from items or traits). Only effective when speed modulation is enabled.  
* **Parameters:**  
  - `mult`: `number` — additional multiplier (e.g., 0.9 for 10% penalty). Updates the locomotor immediately if `speedmod` is active.

### `SetResistance(resist)`
* **Description:** Sets the base resistance value. Does *not* add modifiers; only sets the raw threshold.  
* **Parameters:**  
  - `resist`: `number` — new base resistance.

### `GetResistance()`
* **Description:** Returns total resistance, including additive modifier sources.  
* **Parameters:** None.  
* **Returns:** `number` — `resistance + modifier list value`.

### `AddGrogginess(grogginess, knockoutduration)`
* **Description:** Increases grogginess amount, may trigger knockout if threshold exceeded and conditions met. Resets wearoff progress.  
* **Parameters:**  
  - `grogginess`: `number` — amount to add. Ignored if ≤ 0 or immunity is active.  
  - `knockoutduration`: `number?` — desired knockout duration (capped at `TUNING.MIN_KNOCKOUT_TIME`). If omitted, defaults to current max.

### `SubtractGrogginess(grogginess)`
* **Description:** Decreases grogginess amount. Ensures component is updating to handle eventual exhaustion.  
* **Parameters:**  
  - `grogginess`: `number` — amount to subtract. Ignored if ≤ 0 or immunity active.

### `ResetGrogginess()`
* **Description:** Sets grogginess to zero by subtracting current amount.  

### `SetPercent(percent)`
* **Description:** Adjusts grogginess to match a percentage of current resistance (0.0–1.0).  
* **Parameters:**  
  - `percent`: `number` — fraction of `resistance` to target.

### `MaximizeGrogginess()`
* **Description:** Adds grogginess up to just below resistance (leaves small buffer).  

### `MakeGrogginessAtLeast(min)`
* **Description:** Increases grogginess if current amount is below `min`.  

### `CapToResistance()`
* **Description:** Clamps `grog_amount` to `resistance`.  

### `ExtendKnockout(knockoutduration)`
* **Description:** Extends current knockout with new duration (only if already knocked out). Also caps grogginess to resistance.  
* **Parameters:**  
  - `knockoutduration`: `number` — new knockout duration.

### `KnockOut()`
* **Description:** Triggers `"knockedout"` event and sets internal `knockedout = true`, if visible and alive.  

### `ComeTo()`
* **Description:** Ends knockout state by resetting `knockedout` and forcing grogginess to resistance level to immediately re-trigger grogginess logic (if needed). Triggers `"cometo"` event.  

### `SetEnableSpeedMod(enable)`
* **Description:** Enables/disables grogginess-based speed modulation. Adds/removes `"groggy"` tag accordingly.  
* **Parameters:**  
  - `enable`: `boolean` — whether to enable speed mod.

### `IsGroggy()`
* **Description:** Returns `true` if grogginess is active (amount > 0, enabled, and not knocked out).  
* **Returns:** `boolean`.

### `HasGrogginess()`
* **Description:** Returns `true` if grogginess amount > 0 and speed mod is enabled (includes knocked-out state).  
* **Returns:** `boolean`.

### `IsKnockedOut()`
* **Description:** Checks if entity’s state graph currently has the `"knockout"` state tag.  
* **Returns:** `boolean`.

### `GetDebugString()`
* **Description:** Returns formatted debug string for in-game diagnostics. Includes KO status, time, grog/resistance, and speed mod status.  
* **Returns:** `string`.

### `AddResistanceSource(source, resistance)`
* **Description:** Adds an additive modifier to the resistance total (e.g., from items or buff effects).  
* **Parameters:**  
  - `source`: `string` — unique identifier for the source.  
  - `resistance`: `number` — additive resistance to apply.

### `RemoveResistanceSource(source)`
* **Description:** Removes a previously added resistance modifier.  

### `AddImmunitySource(source)`
* **Description:** Grants grogginess immunity (prevents buildup and decay).  
* **Parameters:**  
  - `source`: `string` — unique identifier.

### `RemoveImmunitySource(source)`
* **Description:** Removes grogginess immunity.  

### `OnUpdate(dt)`
* **Description:** Main per-frame update logic: decay grogginess, handle knockout progression/wearoff transition, invoke state-specific callbacks.  
* **Parameters:**  
  - `dt`: `number` — delta time in seconds.

### `OnRemoveFromEntity()`
* **Description:** Cleanup on component removal: clears groggy tag, fires wearoff callback if active.  

### `TransferComponent(newinst)`
* **Description:** Transfers current grogginess and wearoff state to another entity’s `Grogginess` component.  
* **Parameters:**  
  - `newinst`: `Entity` — destination entity.

## Events & Listeners
- **Listens for:** None (component is updated explicitly via `StartUpdatingComponent`/`StopUpdatingComponent`).
- **Emits:**  
  - `"knockedout"` — triggered in `KnockOut()` when first entering knockout (if visible and not dead).  
  - `"cometo"` — triggered in `ComeTo()` when exiting knockout (if knocked out and not dead).