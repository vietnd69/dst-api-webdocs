---
id: insulator
title: Insulator
description: Manages insulation properties and seasonal type for an entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: df161c46
---

# Insulator

## Overview
This component tracks and exposes an entity's insulation value and current seasonal type (SUMMER or WINTER). It provides methods to set and retrieve insulation level, as well as to query or update the seasonal context—used primarily to influence temperature-related gameplay mechanics such as overheat or hypothermia rates.

## Dependencies & Tags
None identified

## Properties
| Property   | Type           | Default Value | Description                                      |
|------------|----------------|---------------|--------------------------------------------------|
| `insulation` | `number`     | `0`           | Numeric insulation value applied to the entity. |
| `type`     | `SEASONS` enum | `SEASONS.WINTER` | Current seasonal type (`SUMMER` or `WINTER`). |

## Main Functions
### `SetSummer()`
* **Description:** Sets the component's seasonal type to `SEASONS.SUMMER`.
* **Parameters:** None.

### `SetWinter()`
* **Description:** Sets the component's seasonal type to `SEASONS.WINTER`.
* **Parameters:** None.

### `GetType()`
* **Description:** Returns the current seasonal type.
* **Parameters:** None.

### `IsType(type)`
* **Description:** Compares the current seasonal type against the provided `type` and returns `true` if equal.
* **Parameters:**
  * `type` (`SEASONS` enum): The season type to compare against.

### `SetInsulation(val)`
* **Description:** Sets the insulation value to the specified numeric value.
* **Parameters:**
  * `val` (`number`): The new insulation value.

### `GetInsulation()`
* **Description:** Returns the current insulation value and the current seasonal type as a two-value return.
* **Parameters:** None.

## Events & Listeners
None