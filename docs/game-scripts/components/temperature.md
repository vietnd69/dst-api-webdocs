---
id: temperature
title: Temperature
description: Manages an entity's thermal state, including temperature changes, insulation, environmental interactions, and health impacts from overheating or freezing.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: be308083
---

# Temperature

## Overview
The `temperature` component calculates and maintains an entity's current temperature by integrating ambient environmental conditions, equipped/insulated items, moisture, shelter status, proximity to heaters/cooler entities, belly temperature effects, and seasonal/ambient modifiers. It periodically updates the entity's temperature, applies health damage when temperatures exceed safe thresholds, and broadcasts temperature-related events to other systems (e.g., UI, player classified state).

## Dependencies & Tags
- **Component Dependencies**: None explicitly added via `AddComponent` within this script, but relies on optional presence of:
  - `health` — for damage application
  - `inventory` — to access insulated/heating items
  - `moisture` — for moisture-based cooling penalty
  - `beard` — for beard-based insulation adjustment
  - `sleepingbag` — for ambient override when inside
  - `preserver` — on owner for rate multiplier (e.g., in冷冻箱)
  - `player_classified` — to sync UI temperature display
- **Tags**:
  - Internally respects tags `INLIMBO`, `HASHEATER`, `spawnlight`, `nocool`, `pocketdimension_container`, `fridge`, `lowcool`, `player`.
  - `sheltered` event is listened for.
  - Uses `seasontags` via `SEASONS.WINTER`, `SEASONS.SUMMER` enum references.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the parent entity instance. |
| `settemp` | `number?` | `nil` | Optional explicit target temperature override. |
| `current` | `number` | `TUNING.STARTING_TEMP` | Current entity temperature in Celsius. |
| `maxtemp` | `number` | `TUNING.MAX_ENTITY_TEMP` | Upper temperature limit. |
| `mintemp` | `number` | `TUNING.MIN_ENTITY_TEMP` | Lower temperature limit. |
| `overheattemp` | `number` | `TUNING.OVERHEAT_TEMP` | Threshold above which overheating damage occurs. |
| `hurtrate` | `number` | `TUNING.WILSON_HEALTH / TUNING.FREEZING_KILL_TIME` | Per-second health damage when freezing (current < 0°C). |
| `overheathurtrate` | `number?` | `nil` | Per-second health damage when overheating; defaults to `hurtrate`. |
| `inherentinsulation` | `number` | `0` | Base winter insulation from entity (e.g., fur). |
| `inherentsummerinsulation` | `number` | `0` | Base summer insulation (often 0). |
| `shelterinsulation` | `number` | `TUNING.INSULATION_MED_LARGE` | Insulation bonus when sheltered (e.g., under trees). |
| `maxmoisturepenalty` | `number` | `TUNING.MOISTURE_TEMP_PENALTY` | Maximum cooling penalty from full moisture. |
| `totalmodifiers` | `number` | `0` | Sum of all temperature modifiers (e.g., clothing, status effects). |
| `externalheaterpower` | `number` | `0` | Cumulative heating effect from nearby heaters. |
| `delta` | `number` | `0` | Ideal per-update temperature change before rate limiting. |
| `rate` | `number` | `0` | Actual per-second temperature change rate after constraints. |
| `sheltered` | `boolean` | `false` | Whether the entity is currently under shelter. |
| `sheltered_level` | `number` | `1` | Shelter level (e.g., `1` = open, `>1` = deeper shelter). |
| `temperature_modifiers` | `table?` | `nil` | Named map of numeric modifiers applied to temperature change target. |
| `ignoreheatertags` | `table` | `{ "INLIMBO" }` | Tags to ignore when scanning for heater entities. |
| `usespawnlight` | `boolean?` | `nil` | If true, use spawn light logic for ambient temperature fallback. |
| `bellytemperaturedelta` | `number?` | `nil` | Temperature effect from recently eaten food. |
| `bellytime` | `number?` | `nil` | Timestamp when belly effect expires. |
| `bellytask` | `Task?` | `nil` | Scheduled task to clear belly effect. |

## Main Functions

### `SetFreezingHurtRate(rate)`
* **Description:** Sets the per-second health damage rate when the entity is freezing (current temperature < 0°C).
* **Parameters:**
  - `rate` (`number`): Health damage per second while freezing.

### `SetOverheatHurtRate(rate)`
* **Description:** Sets the per-second health damage rate when the entity is overheating (current temperature > `overheattemp`).
* **Parameters:**
  - `rate` (`number`): Health damage per second while overheating.

### `DoDelta(delta)`
* **Description:** Applies a temperature change (`delta`) subject to seasonal insulation resistance. Used to smoothly transition temperature over time.
* **Parameters:**
  - `delta` (`number`): Raw temperature change to apply before insulation dampening.

### `SetTemperatureInBelly(delta, duration)`
* **Description:** Applies a temporary temperature effect from digested food (warming or chilling). The effect lasts for `duration` seconds or until cancelled.
* **Parameters:**
  - `delta` (`number`): Temperature change amount (positive = warming, negative = cooling).
  - `duration` (`number`): Time in seconds the effect persists.

### `OnRemoveFromEntity()`
* **Description:** Cleanup logic when component is removed: clears belly effect and removes event listener for `"sheltered"`.

### `OnSave()`
* **Description:** Returns a serializable table containing `current`, `bellytemperaturedelta`, and remaining `bellytime` (as relative time).
* **Return Value:** `table?`

### `OnLoad(data)`
* **Description:** Restores component state from saved data, handling temperature and belly effect. Applies logic to reconcile player log-off temperature changes against current world temperature.
* **Parameters:**
  - `data` (`table?`): Data from `OnSave()`.

### `IgnoreTags(...)`
* **Description:** Extends the list of tags ignored when scanning for heaters/cooler entities. Starts with `{ "INLIMBO" }`.
* **Parameters:**
  - `...` (`...string`): Additional tags to ignore.

### `SetTemp(temp)`
* **Description:** Sets the `settemp` override. If non-`nil`, forces the current temperature to `temp` (bypassing normal updates until reset).
* **Parameters:**
  - `temp` (`number?`): Temperature to enforce; `nil` disables override.

### `SetTemperature(value)`
* **Description:** Directly sets the `current` temperature. Triggers `"startfreezing"/"stopfreezing"` and `"startoverheating"/"stopoverheating"` events if crossing thresholds. Always emits `"temperaturedelta"` event.
* **Parameters:**
  - `value` (`number`): New temperature value.

### `GetInsulation()`
* **Description:** Computes seasonal insulation values by summing:
  - Inherent insulation (e.g., beard in winter).
  - Insulated equipment items (`equipslots`) by season.
  - Shelter bonus (`shelterinsulation`) when sheltered.
  - Dusk/night insulation bonuses in Overworld.
* **Return Value:** `number, number` — winter insulation, summer insulation (clamped to ≥ 0).

### `GetMoisturePenalty()`
* **Description:** Returns cooling penalty (negative number) due to moisture level.
* **Return Value:** `number` — penalty amount (e.g., `-10`), or `0` if no moisture component.

### `OnUpdate(dt, applyhealthdelta)`
* **Description:** Core temperature update loop. Calculates ambient target temperature, applies modifiers, insulation dampening, heater/cooler proximity, moisture, shelter, food belly effect, and season/night/dusk bonuses. Enforces bounds and applies health damage if freezing/overheating.
* **Parameters:**
  - `dt` (`number`): Delta time since last update (seconds).
  - `applyhealthdelta` (`boolean?`): Whether to apply health damage. Defaults to `true`.

### `TransferComponent(newinst)`
* **Description:** Transfers temperature state (including belly effect) to a new entity instance (e.g., during avatar transfer).
* **Parameters:**
  - `newinst` (`Entity`): Target entity instance.

## Events & Listeners
- **Listens for:**
  - `"sheltered"` → triggers `onsheltered(self.inst, data)`
- **Emits:**
  - `"startfreezing"` or `"stopfreezing"` — when temperature crosses 0°C.
  - `"startoverheating"` or `"stopoverheating"` — when temperature crosses `overheattemp`.
  - `"temperaturedelta"` — every `SetTemperature` call, with payload `{ last = number, new = number, hasrate = boolean }`.