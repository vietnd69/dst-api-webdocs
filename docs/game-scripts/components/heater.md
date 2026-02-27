---
id: heater
title: Heater
description: The Heater component manages heat emission and absorption properties for an entity, supporting configurable heat values, radii, falloff behavior, and exothermic/endothermic states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2fdc4844
---

# Heater

## Overview  
The Heater component enables an entity to provide or absorb heat in the game world. It supports multiple heat sources—passive (base), carried (when held), and equipped (when worn)—with optional function-based or static heat values. It also controls thermal behavior via exothermic (heat-emitting) and endothermic (heat-absorbing) flags, and can optionally enforce radius-based heat falloff.

## Dependencies & Tags  
- Adds the `"HASHEATER"` tag to the entity on construction.  
- Removes the `"HASHEATER"` tag when the component is removed from the entity.

## Properties  

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `heat` | `number?` | `nil` | Static base heat value (used if `heatfn` is not set). |
| `heatfn` | `function?` | `nil` | Optional function `(inst, observer) → number` returning dynamic base heat. |
| `equippedheat` | `number?` | `nil` | Static heat value applied when the item is equipped (e.g., worn). |
| `equippedheatfn` | `function?` | `nil` | Optional function `(inst, observer) → number` returning dynamic equipped heat. |
| `carriedheat` | `number?` | `nil` | Static heat value applied when the item is carried (e.g., in inventory). |
| `carriedheatfn` | `function?` | `nil` | Optional function `(inst, observer) → number` returning dynamic carried heat. |
| `carriedheatmultiplier` | `number` | `1` | Multiplier applied to `carriedheat` (or result of `carriedheatfn`) when computing net carried heat. |
| `exothermic` | `boolean` | `true` | If `true`, the heater emits heat (positive effect on temperature). |
| `endothermic` | `boolean` | `false` | If `true`, the heater absorbs heat (negative effect on temperature). |
| `stop_falloff` | `boolean` | `false` (implicit) | If `true`, disables heat falloff; otherwise, heat decreases with distance. |
| `radius_cutoff` | `number?` | `nil` | Distance at which heat falls to zero (if falloff is enabled). |

## Main Functions  

### `SetThermics(exo, endo)`
* **Description:** Sets whether the heater is exothermic (emits heat) and/or endothermic (absorbs heat).  
* **Parameters:**  
  - `exo` (`boolean`) — whether the heater is exothermic.  
  - `endo` (`boolean`) — whether the heater is endothermic.

### `IsEndothermic()`
* **Description:** Returns whether the heater is endothermic.  
* **Parameters:** None.  
* **Returns:** `boolean`.

### `IsExothermic()`
* **Description:** Returns whether the heater is exothermic.  
* **Parameters:** None.  
* **Returns:** `boolean`.

### `SetShouldFalloff(should_falloff)`
* **Description:** Enables or disables heat falloff over distance.  
* **Parameters:**  
  - `should_falloff` (`boolean`) — if `true`, heat decreases with distance from the heater; if `false`, heat is applied uniformly (no falloff).

### `ShouldFalloff()`
* **Description:** Returns whether heat falloff is enabled.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if falloff is enabled.

### `SetHeatRadiusCutoff(radius_cutoff)`
* **Description:** Sets the distance at which heat delivery drops to zero.  
* **Parameters:**  
  - `radius_cutoff` (`number`) — maximum effective range of the heater.

### `GetHeatRadiusCutoff()`
* **Description:** Returns the configured heat radius cutoff.  
* **Parameters:** None.  
* **Returns:** `number?` — the cutoff radius, or `nil` if unset.

### `GetHeat(observer)`
* **Description:** Returns the effective base heat value for a given observer.  
* **Parameters:**  
  - `observer` (`Entity`) — the entity computing heat (used for dynamic functions).  
* **Returns:** `number?` — the heat value (from `heatfn` if present, else `heat`), or `nil`.

### `GetHeatRate(observer)`
* **Description:** Returns the heat rate (e.g., speed of temperature change) for an observer.  
* **Parameters:**  
  - `observer` (`Entity`) — the entity computing heat rate.  
* **Returns:** `number` — heat rate value (from `heatratefn` if present, else `heatrate`, defaulting to `1` if neither is set).

### `GetEquippedHeat(observer)`
* **Description:** Returns the heat value when the item is equipped (e.g., worn).  
* **Parameters:**  
  - `observer` (`Entity`) — the entity computing heat.  
* **Returns:** `number?` — equipped heat (from `equippedheatfn` if present, else `equippedheat`), or `nil`.

### `GetCarriedHeat(observer)`
* **Description:** Returns the effective carried heat and its multiplier for an observer.  
* **Parameters:**  
  - `observer` (`Entity`) — the entity computing carried heat.  
* **Returns:** `number, number` — carried heat value (from `carriedheatfn` if present, else `carriedheat`) and the `carriedheatmultiplier`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing current heat configuration.  
* **Parameters:** None.  
* **Returns:** `string` — comma-separated heat values and thermic flags for inspection.

## Events & Listeners  
None identified.