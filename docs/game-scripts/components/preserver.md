---
id: preserver
title: Preserver
description: Controls per-item preservation multipliers for perish and temperature decay rates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2d5c1697
---

# Preserver

## Overview
The `Preserver` component allows an entity (typically a container or wearable item) to modify the rates at which *other* items (e.g., perishable food or temperature-sensitive items) decay—either by altering their spoilage speed or their response to ambient temperature changes. It does not decay itself but acts as a modifier component applied to entities that influence item preservation properties.

## Dependencies & Tags
None identified.

## Properties
| Property                     | Type     | Default Value | Description |
|------------------------------|----------|---------------|-------------|
| `perish_rate_multiplier`     | `number` or `function` | `1` | Multiplier applied to the perish rate of affected items. Can be a constant number or a function returning a value. |
| `temperature_rate_multiplier`| `number` or `function` | `1` | Multiplier applied to the temperature decay rate of affected items. Can be a constant number or a function returning a value. |

## Main Functions
### `SetPerishRateMultiplier(rate)`
* **Description:** Sets the multiplier used to scale the perish rate of items affected by this preserver.
* **Parameters:**  
  `rate` (`number` or `function`) — The new multiplier. If a function, it should accept `(inst, item)` arguments and return a numeric multiplier.

### `GetPerishRateMultiplier(item)`
* **Description:** Returns the current perish rate multiplier, evaluating it as a function (if necessary) using the `FunctionOrValue` utility. Ensures safe handling of both constant and dynamic multipliers.
* **Parameters:**  
  `item` (`GObject?`) — The item whose preservation rate is being queried (passed to the multiplier function, if applicable).

### `SetTemperatureRateMultiplier(rate)`
* **Description:** Sets the multiplier used to scale the temperature decay rate of items affected by this preserver.
* **Parameters:**  
  `rate` (`number` or `function`) — The new multiplier. If a function, it should accept `(inst, item)` arguments and return a numeric multiplier.

### `GetTemperatureRateMultiplier(item)`
* **Description:** Returns the current temperature rate multiplier, evaluating it as a function (if necessary) using the `FunctionOrValue` utility. Ensures safe handling of both constant and dynamic multipliers.
* **Parameters:**  
  `item` (`GObject?`) — The item whose temperature preservation rate is being queried (passed to the multiplier function, if applicable).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the current multiplier values (e.g., `"PerishRate: 0.5, TemperatureRate: FN"`). Used in debugging UIs or tools.
* **Parameters:** None.

## Events & Listeners
None.