---
id: heater
title: Heater
description: Manages thermal output properties and behavior for an entity, supporting configurable heat sources, carried heat, and endothermic/exothermic states.
tags: [thermal, environment, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2fdc4844
system_scope: environment
---

# Heater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Heater` component defines and exposes thermal properties for an entity, enabling it to act as a heat source or sink. It supports dynamic heat generation via functions or static values, and accounts for heat in different states: active (heating), carried (when equipped or held), and endothermic/exothermic behavior. The component adds the `HASHEATER` tag to its owning entity upon construction and removes it on cleanup.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("heater")
inst.components.heater:SetHeat(15) -- static heat value
inst.components.heater:SetCarriedHeat(10, 0.5) -- carried heat with multiplier
inst.components.heater:SetThermics(true, false) -- exothermic only
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `HASHEATER` to `inst`; removes `HASHEATER` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `heat` | number or `nil` | `nil` | Base static heat output when no `heatfn` is set. |
| `heatfn` | function or `nil` | `nil` | Optional function `(inst, observer) -> number` to compute dynamic heat. |
| `equippedheat` | number or `nil` | `nil` | Static heat when entity is equipped. |
| `equippedheatfn` | function or `nil` | `nil` | Optional function `(inst, observer) -> number` for dynamic equipped heat. |
| `carriedheat` | number or `nil` | `nil` | Static heat when entity is carried. |
| `carriedheatfn` | function or `nil` | `nil` | Optional function `(inst, observer) -> number, multiplier` for dynamic carried heat. |
| `carriedheatmultiplier` | number | `1` | Multiplier applied to carried heat (used with `carriedheatfn` or `carriedheat`). |
| `exothermic` | boolean | `true` | If `true`, entity emits heat; otherwise, it absorbs heat. |
| `endothermic` | boolean | `false` | If `true`, entity absorbs heat (overrides/excludes `exothermic`). |
| `stop_falloff` | boolean | `false` | If `true`, heat does not fall off with distance (inverted via `ShouldFalloff`). |
| `radius_cutoff` | number or `nil` | `nil` | Optional radius beyond which heat output is considered zero. |

## Main functions
### `SetThermics(exo, endo)`
*   **Description:** Configures whether the entity is exothermic (emits heat) or endothermic (absorbs heat).
*   **Parameters:**  
    - `exo` (boolean) — sets `exothermic` flag.  
    - `endo` (boolean) — sets `endothermic` flag.  
*   **Returns:** Nothing.

### `IsEndothermic()`
*   **Description:** Returns the endothermic state.
*   **Parameters:** None.  
*   **Returns:** (boolean) — `true` if the entity is endothermic.

### `IsExothermic()`
*   **Description:** Returns the exothermic state.
*   **Parameters:** None.  
*   **Returns:** (boolean) — `true` if the entity is exothermic.

### `SetShouldFalloff(should_falloff)`
*   **Description:** Sets whether heat output should falloff with distance.  
*   **Parameters:** `should_falloff` (boolean) — if `true`, falloff is enabled; heat falls off with distance.  
*   **Returns:** Nothing.

### `ShouldFalloff()`
*   **Description:** Returns whether heat falloff is enabled (inverse of internal `stop_falloff` flag).  
*   **Parameters:** None.  
*   **Returns:** (boolean) — `true` if heat should falloff (i.e., `not self.stop_falloff`).  

### `SetHeatRadiusCutoff(radius_cutoff)`
*   **Description:** Sets an optional distance cutoff for heat emission; beyond this radius, heat output is effectively zero.  
*   **Parameters:** `radius_cutoff` (number) — distance threshold.  
*   **Returns:** Nothing.

### `GetHeatRadiusCutoff()`
*   **Description:** Returns the configured heat radius cutoff.  
*   **Parameters:** None.  
*   **Returns:** (number or `nil`) — the cutoff radius, or `nil` if unset.

### `GetHeat(observer)`
*   **Description:** Computes and returns the current heat output, using either a dynamic function or a static value.  
*   **Parameters:** `observer` (entity instance) — the entity querying heat (used by function-based heat).  
*   **Returns:** (number or `nil`) — heat value; `nil` if no heat source is set.

### `GetHeatRate(observer)`
*   **Description:** Returns the heat rate (unused in current codebase), supporting dynamic or static definitions.  
*   **Parameters:** `observer` (entity instance) — passed to `heatratefn` if defined.  
*   **Returns:** (number) — heat rate; defaults to `1` if neither `heatratefn` nor `heatrate` are set.

### `GetEquippedHeat(observer)`
*   **Description:** Returns heat output when the entity is equipped (e.g., held by a player).  
*   **Parameters:** `observer` (entity instance) — used by dynamic function if present.  
*   **Returns:** (number or `nil`) — equipped heat value; `nil` if unset.

### `GetCarriedHeat(observer)`
*   **Description:** Returns heat output and multiplier when the entity is carried (e.g., in inventory).  
*   **Parameters:** `observer` (entity instance) — used by dynamic function if present.  
*   **Returns:** (number, number) — carried heat value and multiplier (always returns two values; multiplier defaults to `carriedheatmultiplier`).

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging, summarizing all heat-related fields.  
*   **Parameters:** None.  
*   **Returns:** (string) — formatted like `"heat: <value> carriedheat: <value> equippedheat: <value> EXO:true ENDO:false"`. Function-based fields appear as `<fn>`.

## Events & listeners
Not applicable.
