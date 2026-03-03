---
id: insulator
title: Insulator
description: Tracks and manages insulation level and seasonal type for entities to determine cold resistance.
tags: [seasons, temperature, resistance]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: df161c46
system_scope: entity
---

# Insulator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Insulator` is a simple data-storing component that maintains an entity's current insulation value and active seasonal type (summer or winter). It does not implement logic itself but provides state access for other systems (e.g., temperature or weather components) to calculate cold resistance. It is typically attached to characters, clothing, or equipment that influences thermal protection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("insulator")
inst.components.insulator:SetWinter()
inst.components.insulator:SetInsulation(15)
if inst.components.insulator:IsType(SEASONS.WINTER) then
    print("Insulation:", inst.components.insulator:GetInsulation())
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `insulation` | number | `0` | Numerical insulation value contributing to cold resistance. |
| `type` | `SEASONS` constant | `SEASONS.WINTER` | Current seasonal context (`SEASONS.SUMMER` or `SEASONS.WINTER`). |

## Main functions
### `SetSummer()`
* **Description:** Sets the component's seasonal type to summer.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetWinter()`
* **Description:** Sets the component's seasonal type to winter.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetType()`
* **Description:** Returns the current seasonal type stored in the component.
* **Parameters:** None.
* **Returns:** `SEASONS` constant (`SEASONS.SUMMER` or `SEASONS.WINTER`).

### `IsType(type)`
* **Description:** Checks whether the current seasonal type matches the provided `type`.
* **Parameters:** `type` (`SEASONS` constant) — the season to compare against.
* **Returns:** `boolean` — `true` if `type` matches `self.type`, otherwise `false`.

### `SetInsulation(val)`
* **Description:** Sets the insulation value.
* **Parameters:** `val` (number) — the insulation amount to assign.
* **Returns:** Nothing.

### `GetInsulation()`
* **Description:** Returns the current insulation value and seasonal type.
* **Parameters:** None.
* **Returns:** `number, SEASONS` — the insulation value and the current season type.

## Events & listeners
None identified
