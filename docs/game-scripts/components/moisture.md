---
id: moisture
title: Moisture
description: Manages an entity's moisture level, including soaking from rain, drying mechanics, waterproofing modifiers, and associated UI/audio feedback.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 49dc8fd3
---

# Moisture

## Overview
The `Moisture` component tracks and manages how wet an entity becomes over time due to environmental factors (e.g., rain, bathing, water-based interactions) and how it dries out (e.g., via temperature, drying equipment like sleeping bags, or desiccants). It computes dynamic moisture change rates, enforces waterproofing via modifiers, handles state transitions (e.g., damp/wet/wetter/soaked), and synchronizes relevant data to clients via the `player_classified` and `replica.moisture` systems.

## Dependencies & Tags
- Components used: `temperature`, `inventory`, `sheltered`, `rainimmunity`, `moistureabsorberuser`, `talker`
- Tags: none added or removed directly by this component
- Notes: Interacts with `replica.moisture` for networked wet-state (`wet` property) and `player_classified` for client-side UI updates

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxmoisture` | `number` | `100` | Upper bound of moisture level. |
| `moisture` | `number` | `0` | Current moisture level (0–`maxmoisture`). |
| `numSegs` | `number` | `5` | Number of visual moisture segments used for UI and announcement thresholds. |
| `baseDryingRate` | `number` | `0` | Base drying rate coefficient. |
| `maxDryingRate` | `number` | `0.1` | Upper cap on ambient drying rate. |
| `minDryingRate` | `number` | `0` | Lower cap on ambient drying rate. |
| `maxPlayerTempDrying` | `number` | `5` | Max drying boost from high player temperature (≥ 3 full segments). |
| `optimalPlayerTempDrying` | `number` | `2` | Drying boost from moderate player temperature (< 3 full segments). |
| `minPlayerTempDrying` | `number` | `0` | Minimum temperature-based drying boost. |
| `maxMoistureRate` | `number` | `0.75` | Maximum rate of moisture gain during rain. |
| `minMoistureRate` | `number` | `0` | Minimum rate of moisture gain during rain. |
| `inherentWaterproofness` | `number` | `0` | **Deprecated**. Use `waterproofnessmodifiers` instead. |
| `waterproofnessmodifiers` | `SourceModifierList` | `SourceModifierList(inst, 0, additive)` | Aggregates additive waterproofness modifiers (e.g., gear, shelter). |
| `externalbonuses` | `SourceModifierList` | `SourceModifierList(inst, 0, additive)` | Aggregates external rate bonuses (e.g., items boosting drying/moisture gain). |
| `forcedrysources` | `table?` | `nil` | Map of force-dry sources; entity dries instantly to 0 when non-empty. |
| `optimalDryingTemp` | `number` | `50` | Temperature (°C) at which ambient drying rate peaks. |
| `rate` | `number` | `0` | Current computed rate of moisture change (per tick). |
| `ratescale` | `RATE_SCALE` enum | `RATE_SCALE.NEUTRAL` | Rate magnitude category (e.g., `DECREASE_HIGH`, `INCREASE_MED`). |
| `wet` | `boolean` | `false` | Whether entity has ≥2 moisture segments. |

## Main Functions

### `ForceDry(force, source)`
* **Description:** Forces drying (sets moisture to 0 and halts updates) if `force = true`, or cancels force-dry for a given source if `force = false`. Once all sources are removed, normal drying resumes.
* **Parameters:**
  * `force` (`boolean`): Whether to activate or deactivate force-dry.
  * `source` (`Entity`): The actor triggering force-dry (defaults to `self.inst`).

### `DoDelta(num, no_announce)`
* **Description:** Applies a raw moisture delta (e.g., `+25`, `-10`). Clamps result to `[0, maxmoisture]`, updates `wet` flag, and announces state changes (if enabled).
* **Parameters:**
  * `num` (`number`): Amount to add to current moisture.
  * `no_announce` (`boolean?`): If truthy, skips announcements and events.

### `SetMoistureLevel(num)`
* **Description:** Sets moisture directly (clamped to `[0, maxmoisture]`). Unlike `DoDelta`, it does *not* trigger drying updates and only emits `moisturedelta` event.
* **Parameters:**
  * `num` (`number`): Absolute moisture value to set.

### `GetMoistureRate()`
* **Description:** Computes net moisture gain rate due to environmental factors (e.g., rain, floating items, bathing pools). Returns 0 if not raining or immune.
* **Parameters:** None.

### `GetDryingRate(moisturerate)`
* **Description:** Computes net drying rate based on heater power, local temperature, moisture level, and optionally passed-in `moisturerate`.
* **Parameters:**
  * `moisturerate` (`number?`): Current moisture gain rate; used to avoid drying while wetting (e.g., raining). Defaults to `GetMoistureRate()`.

### `GetEquippedMoistureRate(dryingrate)`
* **Description:** Retrieves moisture rate from equipped inventory items (e.g., moisture-absorbing gear or water-repellent items). Adjusts for stability when at saturation.
* **Parameters:**
  * `dryingrate` (`number`): Computed drying rate; used to prevent oscillation when moisture is maxed.

### `AddRateBonus(src, bonus, key)` / `RemoveRateBonus(src, key)` / `GetRateBonus()`
* **Description:** Manages dynamic rate modifiers (e.g., from temporary buff items or status effects). Use `src` + `key` for unique modifier identification.
* **Parameters:**
  * `src` (`Entity` or `any`): Source object identifier.
  * `bonus` (`number`): Rate value to add.
  * `key` (`string` or `any`): Key to identify modifier within `src`.

### `OnUpdate(dt)` / `LongUpdate(dt)`
* **Description:** Called every frame (or long update interval). Computes net moisture change rate (`moisturerate + equipped_rate - dryingrate + bonuses - desiccant`) and applies delta (`rate * dt`) to `moisture`.
* **Parameters:** `dt` (`number`): Delta time in seconds.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing moisture, rate components, and force-dry status.
* **Parameters:** None.

### `GetWaterproofness()`
* **Description:** Computes effective waterproofness from inventory, inherent (deprecated), and `waterproofnessmodifiers`. Returns value clamped to `[0, 1]`.
* **Parameters:** None.

### `GetSegs()`
* **Description:** Returns UI segment count (`full` drops) and alpha (`fractional` part) for rendering.
* **Returns:** 
  * `full` (`number`): Count of fully filled segments (0–`numSegs-1`).
  * `alpha` (`number`): Fractional part for partial segment rendering.

### `AnnounceMoisture(oldSegs, newSegs)`
* **Description:** Triggers dialogue announcements (e.g., "ANNOUNCE_WET") via `talker` component when moisture segments cross thresholds.
* **Parameters:**
  * `oldSegs` (`number`): Previous segment count.
  * `newSegs` (`number`): Current segment count.

## Events & Listeners
- **Listens for:**
  - `"onremove"` on `source` (used in `ForceDry` to clean up force-dry state when source is destroyed)
- **Pushes events:**
  - `"moisturedelta"` — `{ old = oldLevel, new = newLevel }` — emitted when moisture changes (via `DoDelta` or `SetMoistureLevel`)