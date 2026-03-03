---
id: grogginess
title: Grogginess
description: Manages temporary impairment effects including grogginess, knockouts, and associated speed penalties on an entity.
tags: [knockout, movement, status, combat, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8af1bddb
system_scope: entity
---

# Grogginess

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Grogginess` is a component that tracks and manages temporary impairment effects such as grogginess and knockouts. It calculates and applies movement speed penalties based on the entity's grogginess level, handles transitions between awake, groggy, knocked-out, and recovering states, and supports customizable test functions for state transitions. It integrates closely with the `health`, `burnable`, and `locomotor` components to ensure proper state synchronization and speed modification.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grogginess")
inst.components.grogginess:SetResistance(100)
inst.components.grogginess:AddGrogginess(50, TUNING.MIN_KNOCKOUT_TIME)
```

## Dependencies & tags
**Components used:** `health`, `burnable`, `locomotor`
**Tags:** Adds `groggy` when grogginess is active and speed modulation is enabled; removes on recovery or component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `resistance` | number | `1` | Base grogginess resistance threshold. |
| `grog_amount` | number | `0` | Current accumulated grogginess. |
| `knockouttime` | number | `0` | Elapsed time spent knocked out. |
| `knockoutduration` | number | `0` | Required time to stay knocked out before recovering. |
| `wearofftime` | number | `0` | Elapsed time since grogginess dropped to zero, during recovery phase. |
| `wearoffduration` | number | `TUNING.GROGGINESS_WEAR_OFF_DURATION` | Duration of the recovery (wear-off) phase in seconds. |
| `decayrate` | number | `TUNING.GROGGINESS_DECAY_RATE` | Rate at which grogginess decreases per second. |
| `speedmod` | number or nil | `nil` | Calculated speed multiplier currently applied. |
| `speedmodmult` | number | `1` | Multiplier applied to `speedmod` when setting external speed. |
| `enablespeedmod` | boolean | `true` | Whether speed penalties are actively applied. |
| `isgroggy` | boolean | `false` | Whether the entity is currently in a groggy state. |
| `knockedout` | boolean | `false` | Whether the entity has ever been knocked out (during current activation). |

## Main functions
### `SetSpeedModMultiplier(mult)`
*   **Description:** Sets a bonus multiplier for speed modifiers, applied only while speed modulation is active. Updates the locomotor modifier immediately if speed modulation is enabled and a speed modifier is in effect.
*   **Parameters:** `mult` (number) — the multiplier to apply to the base speed modifier.
*   **Returns:** Nothing.

### `SetResistance(resist)`
*   **Description:** Sets the base resistance value, overriding the default.
*   **Parameters:** `resist` (number) — the new resistance threshold.
*   **Returns:** Nothing.

### `GetResistance()`
*   **Description:** Returns the effective resistance, including additive modifiers from resistance sources.
*   **Parameters:** None.
*   **Returns:** number — total resistance value.

### `SetDecayRate(rate)`
*   **Description:** Configures how quickly grogginess decays per second.
*   **Parameters:** `rate` (number) — new decay rate in grogginess units per second.
*   **Returns:** Nothing.

### `SetWearOffDuration(duration)`
*   **Description:** Sets the duration (in seconds) of the recovery phase after grogginess reaches zero.
*   **Parameters:** `duration` (number) — new wear-off duration.
*   **Returns:** Nothing.

### `SetEnableSpeedMod(enable)`
*   **Description:** Enables or disables speed penalty application. When disabled, removes the `groggy` tag and stops applying speed modifiers; when re-enabled, restores them if applicable.
*   **Parameters:** `enable` (boolean) — whether to enable speed modulation.
*   **Returns:** Nothing.

### `IsKnockedOut()`
*   **Description:** Checks if the entity’s current state graph has the `knockout` state tag.
*   **Parameters:** None.
*   **Returns:** boolean — true if knocked out, false otherwise.

### `IsGroggy()`
*   **Description:** Determines if the entity is currently groggy (i.e., has non-zero grogginess, speed modulation is enabled, and not knocked out).
*   **Parameters:** None.
*   **Returns:** boolean — true if groggy.

### `HasGrogginess()`
*   **Description:** Checks whether the entity has any active grogginess, regardless of speed modulation state or knockout status.
*   **Parameters:** None.
*   **Returns:** boolean — true if `grog_amount` > 0 and speed modulation is enabled.

### `GetDebugString()`
*   **Description:** Returns a formatted string summarizing current grogginess state for debugging.
*   **Parameters:** None.
*   **Returns:** string — formatted debug string.

### `AddGrogginess(grogginess, knockoutduration)`
*   **Description:** Increases accumulated grogginess. May trigger a knockout if grogginess exceeds resistance and no fire-related conditions prevent it.
*   **Parameters:** `grogginess` (number) — amount to add (must be > 0); `knockoutduration` (number or nil) — minimum knockout duration if triggered.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `grogginess <= 0` or if an immunity source is active.

### `MaximizeGrogginess()`
*   **Description:** Adds grogginess to bring the entity to near-maximum resistance level.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetPercent(percent)`
*   **Description:** Sets grogginess to a specified percentage of resistance (0.0–1.0).
*   **Parameters:** `percent` (number) — desired percentage of resistance.
*   **Returns:** Nothing.

### `MakeGrogginessAtLeast(min)`
*   **Description:** Ensures grogginess is at least `min`; adds grogginess only if necessary.
*   **Parameters:** `min` (number) — minimum required grogginess value.
*   **Returns:** Nothing.

### `SubtractGrogginess(grogginess)`
*   **Description:** Decreases grogginess by the specified amount (without going below zero).
*   **Parameters:** `grogginess` (number) — amount to subtract (must be > 0).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `grogginess <= 0` or if an immunity source is active.

### `ResetGrogginess()`
*   **Description:** Fully resets grogginess to zero.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CapToResistance()`
*   **Description:** Caps current grogginess to the current resistance value.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ExtendKnockout(knockoutduration)`
*   **Description:** Extends the knockout time if the entity is currently knocked out; resets `knockouttime` and ensures grogginess remains at or above resistance.
*   **Parameters:** `knockoutduration` (number) — new knockout duration.
*   **Returns:** Nothing.
*   **Error states:** Only takes effect if the entity is knocked out.

### `KnockOut()`
*   **Description:** Fires the `knockedout` event and marks the entity as knocked out (if visible and not dead).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ComeTo()`
*   **Description:** Restores full grogginess after recovering from a knockout; fires the `cometo` event.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only takes effect if the entity is knocked out and not dead.

### `AddResistanceSource(source, resistance)`
*   **Description:** Adds a named source that modifies the entity’s grogginess resistance additively.
*   **Parameters:** `source` (any) — unique identifier for the source; `resistance` (number) — additive resistance bonus/penalty.
*   **Returns:** Nothing.

### `RemoveResistanceSource(source)`
*   **Description:** Removes a previously added resistance source.
*   **Parameters:** `source` (any) — the source identifier to remove.
*   **Returns:** Nothing.

### `AddImmunitySource(source)`
*   **Description:** Adds a named source that grants grogginess immunity (blocks grogginess gain and forces grogginess to zero).
*   **Parameters:** `source` (any) — unique identifier for the immunity source.
*   **Returns:** Nothing.

### `RemoveImmunitySource(source)`
*   **Description:** Removes a previously added immunity source.
*   **Parameters:** `source` (any) — the source identifier to remove.
*   **Returns:** Nothing.

### `TransferComponent(newinst)`
*   **Description:** Transfers the current grogginess state to another entity’s grogginess component.
*   **Parameters:** `newinst` (Entity) — the destination entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on entity removal) — cleanup callback for external speed modifiers (via `LocoMotor`).
- **Pushes:** `knockedout` — when an entity transitions to the knocked-out state (only if visible and not dead).
- **Pushes:** `cometo` — when an entity recovers from a knockout.
