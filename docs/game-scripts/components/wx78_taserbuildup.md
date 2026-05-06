---
id: wx78_taserbuildup
title: Wx78 Taserbuildup
description: Manages WX-78's taser buildup mechanic, tracking charge accumulation from attacks and releasing explosive shock damage at maximum buildup.
tags: [wx78, combat, electricity, skills]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 5b5ce764
system_scope: entity
---

# Wx78 Taserbuildup

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_TaserBuildup` tracks electrical charge accumulation on WX-78 when attacked or blocked. Buildup increases from incoming damage and drains over time after a buffer period. At maximum buildup, the component triggers a shock explosion that damages nearby entities and temporarily bypasses insulation. Visual FX are spawned to indicate charge level, with flash effects scaling based on current buildup percentage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wx78_taserbuildup")

-- Configure buildup parameters
inst.components.wx78_taserbuildup:SetMaxBuildup(100)
inst.components.wx78_taserbuildup:SetBuildupGainRate(1.5)

-- Check current charge
local percent = inst.components.wx78_taserbuildup:GetBuildupPercent()

-- Manually trigger explosion at 50% charge
inst.components.wx78_taserbuildup:SetCurrentBuildup(50)
inst.components.wx78_taserbuildup:ReleaseBuildup(3)
```

## Dependencies & tags
**External dependencies:**
- `TUNING.SKILLS.WX78` -- tuning constants for buildup max, drain rate, damage, radius, and timing
- `GetString` -- retrieves localized announcement strings for buildup states
- `SpawnPrefab` -- spawns the wx78_taser_projectile_fx visual effect entity
- `GetTime` -- retrieves current simulation time for drain buffer calculations

**Components used:**
- `inventory` -- calls `ForceNoInsulated(true)` during explosion to bypass electrical resistance
- `talker` -- calls `Say()` for buildup and explosion announcement lines

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `TUNING.SKILLS.WX78.TASER_MAXBUILDUP` | Maximum buildup value before explosion triggers. |
| `current` | number | `0` | Current buildup charge. Clamped between 0 and `max`. |
| `drain_rate` | number | `TUNING.SKILLS.WX78.TASER_BUILDUP_DRAIN_RATE` | Buildup drain rate per second when draining is active. |
| `gainratemultiplier` | number | `1` | Multiplier applied to buildup gain from attacks. |
| `blast_damage` | number | `TUNING.SKILLS.WX78.TASER_BUILDUP_DAMAGE` | Base damage for shock explosion. Scaled by buildup percent. |
| `blast_radius` | number | `TUNING.SKILLS.WX78.TASER_BUILDUP_RADIUS` | Base radius for shock explosion. Scaled by buildup percent. |
| `is_draining` | boolean | `false` | Whether buildup is currently draining (after buffer time expires). |
| `last_buildup_time` | number | `GetTime()` | Timestamp of last buildup change. Used for drain buffer calculation. |
| `effect_cooldown` | number | `1` | Cooldown timer between flash effects. Decrements in `OnUpdate`. |
| `detonate_time` | number | `nil` | Remaining time until scheduled explosion. Set by `SetDetonateTimer`. |
| `detonate_cb` | function | `nil` | Callback function executed after explosion completes. |
| `fx` | entity | `nil` | Visual effect entity (wx78_taser_projectile_fx). Spawned in constructor. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Removes event listeners and detaches FX entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetMaxBuildup(max)`
* **Description:** Sets the maximum buildup threshold.
* **Parameters:** `max` -- number, new maximum buildup value
* **Returns:** nil
* **Error states:** None

### `GetMaxBuildup()`
* **Description:** Returns the current maximum buildup threshold.
* **Parameters:** None
* **Returns:** number, the max buildup value
* **Error states:** None

### `SetCurrentBuildup(value)`
* **Description:** Sets current buildup value, clamped between 0 and max. Triggers announcements at thresholds (50 and max) and starts/stops component updating based on whether buildup is active.
* **Parameters:** `value` -- number, new buildup value (clamped internally)
* **Returns:** nil
* **Error states:** Errors if `inst.components.talker` is nil when announcement thresholds are crossed (no nil guard present).

### `GetBuildupPercent()`
* **Description:** Returns current buildup as a percentage of max (0 to 1).
* **Parameters:** None
* **Returns:** number, buildup percentage (current / max)
* **Error states:** None

### `SetBuildupPercent(percent)`
* **Description:** Sets buildup based on percentage of max.
* **Parameters:** `percent` -- number, percentage value (0 to 1)
* **Returns:** nil
* **Error states:** None

### `SetBuildupDrainRate(rate)`
* **Description:** Sets the rate at which buildup drains per second.
* **Parameters:** `rate` -- number, drain rate per second
* **Returns:** nil
* **Error states:** None

### `GetBuildupDrainRate()`
* **Description:** Returns the current drain rate.
* **Parameters:** None
* **Returns:** number, drain rate per second
* **Error states:** None

### `SetBuildupGainRate(rate)`
* **Description:** Sets the multiplier for buildup gain from attacks.
* **Parameters:** `rate` -- number, gain rate multiplier
* **Returns:** nil
* **Error states:** None

### `GetBuildupGainRate()`
* **Description:** Returns the current gain rate multiplier.
* **Parameters:** None
* **Returns:** number, gain rate multiplier
* **Error states:** None

### `SetBlastDamage(damage)`
* **Description:** Sets the base damage for shock explosion.
* **Parameters:** `damage` -- number, base blast damage
* **Returns:** nil
* **Error states:** None

### `GetBlastDamage()`
* **Description:** Returns the base blast damage.
* **Parameters:** None
* **Returns:** number, base blast damage
* **Error states:** None

### `SetBlastRadius(radius)`
* **Description:** Sets the base radius for shock explosion.
* **Parameters:** `radius` -- number, base blast radius
* **Returns:** nil
* **Error states:** None

### `GetBlastRadius()`
* **Description:** Returns the base blast radius.
* **Parameters:** None
* **Returns:** number, base blast radius
* **Error states:** None

### `SetDetonateTimer(time, cb)`
* **Description:** Sets a delayed explosion timer. When timer expires, `DoShockExplosion` is called.
* **Parameters:**
  - `time` -- number, seconds until explosion
  - `cb` -- function (optional), callback executed after explosion
* **Returns:** nil
* **Error states:** None

### `DetachFX()`
* **Description:** Removes the visual effect entity and cleans up its event listener.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SpawnFX()`
* **Description:** Spawns the wx78_taser_projectile_fx visual effect and attaches it to the owner. Registers onremove listener for cleanup.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `SpawnPrefab("wx78_taser_projectile_fx")` returns nil (no guard present).

### `ReleaseBuildup(time, cb)`
* **Description:** Initiates the explosion sequence if buildup is at least 25%. Sets detonate timer and triggers FX flash. If detonate_time is already set, only updates the callback instead of initiating a new sequence. Returns nil if buildup < 25%.
* **Parameters:**
  - `time` -- number (optional), flash duration, defaults to 3
  - `cb` -- function (optional), callback after explosion
* **Returns:** boolean, `true` if explosion was initiated, `nil` if buildup < 25%
* **Error states:** Errors if `self.fx` is nil when calling `DoFlash` (no nil guard present).

### `DoShockExplosion()`
* **Description:** Executes the shock explosion. Damage and radius scale with buildup percentage. Insulation bypass via ForceNoInsulated only occurs if entity has stategraph and lacks wxshielding/spinning tags. Pushes electrocute event, resets buildup to 0, and spawns new FX. Executes detonate callback if set.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.inst.components.inventory` is nil (no nil guard on ForceNoInsulated calls). Errors if `self.fx` is nil when calling `Explode` (no nil guard present).

### `OnAttacked()`
* **Description:** Called when entity is attacked or blocked. Resets drain state, updates buildup time, reduces effect cooldown by half, and adds buildup delta.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `DoDelta(delta)`
* **Description:** Applies a buildup delta and updates last_buildup_time if delta is positive. Calls SetCurrentBuildup with the new value.
* **Parameters:** `delta` -- number, positive or negative buildup change
* **Returns:** nil
* **Error states:** None

### `GetEffectCooldown()`
* **Description:** Calculates the cooldown between flash effects. Scales down based on buildup percentage (higher buildup = shorter cooldown).
* **Parameters:** None
* **Returns:** number, cooldown duration in seconds
* **Error states:** None

### `GetEffectDuration()`
* **Description:** Calculates the flash effect duration. Scales up based on buildup percentage (higher buildup = longer flash).
* **Parameters:** None
* **Returns:** number, flash duration in seconds
* **Error states:** None

### `FlashEffect()`
* **Description:** Triggers a visual flash on the FX entity if buildup is at least 25%. Flash intensity scales with buildup percentage.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.fx` is nil when calling `DoFlash` (no nil guard present).

### `OnUpdate(dt)`
* **Description:** Periodic update function. Handles detonate timer countdown, effect cooldown and flash triggering, and buildup drain after buffer time expires. Drain activates when current time exceeds last_buildup_time by TUNING.SKILLS.WX78.TASER_BUILDUP_DRAIN_BUFFER_TIME.
* **Parameters:** `dt` -- number, delta time in seconds
* **Returns:** nil
* **Error states:** None

### `OnSave()`
* **Description:** Returns save data containing current buildup value.
* **Parameters:** None
* **Returns:** table, `{ current = self.current }`
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores buildup value from save data.
* **Parameters:** `data` -- table, save data with `current` field
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns debug information showing current buildup value.
* **Parameters:** None
* **Returns:** string, debug info
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `attacked` -- triggers OnAttacked; adds buildup from incoming damage
  - `blocked` -- triggers OnAttacked; adds buildup from blocked attacks
  - `onremove` (on fx entity) -- triggers DetachFX; cleans up FX when removed
- **Pushes:**
  - `electrocute` -- fired via PushEventImmediate in DoShockExplosion; applies electrical damage to nearby entities. Data: none