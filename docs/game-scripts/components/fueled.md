---
id: fueled
title: Fueled
description: Manages fuel consumption, storage, and related tag states for entities that consume fuel over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: de3140c5
---

# Fueled

## Overview
The `Fueled` component handles fuel storage, consumption, and state transitions (e.g., fuel depletion, "needs sewing" indicator) for entities. It supports primary and secondary fuel types, configurable consumption rates, section-based progress tracking, and dynamic modifiers. It automatically manages entity tags based on fuel state and triggers events for external systems.

## Dependencies & Tags
**Tags added/removed by the component:**
- `needssewing` — added when `fueltype` or `secondaryfueltype` is `FUELTYPE.USAGE`, fuel is not full, and `no_sewing` is false.
- `<fueltype>_fueled` — added/removed when `fueltype` or `secondaryfueltype` changes or `accepting` changes (if not `FUELTYPE.USAGE` and `accepting` is true).
- `fueldepleted` — added when `currentfuel <= 0`, removed otherwise.

**Components it expects to interact with (not directly required):**
- `item.components.fuel` or `item.components.fueler` (for fuel items).
- `doer.components.fuelmaster` (for mastery bonuses).
- `inst.components.forgerepairable` (for setting repairability based on fuel level).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `consuming` | `boolean` | `false` | Whether fuel consumption is currently active. |
| `maxfuel` | `number` | `0` | Maximum fuel capacity. |
| `currentfuel` | `number` | `0` | Current fuel amount. |
| `rate` | `number` | `1` | Base fuel consumption rate per unit time. |
| `rate_modifiers` | `SourceModifierList` | `SourceModifierList(self.inst)` | Tracks modifiers applied to the consumption rate. |
| `no_sewing` | `boolean or nil` | `nil` | If truthy, disables "needssewing" tag for `FUELTYPE.USAGE` fuel types. |
| `accepting` | `boolean` | `false` | Whether the entity currently accepts fuel. |
| `fueltype` | `string` | `FUELTYPE.BURNABLE` | Primary fuel type accepted. |
| `secondaryfueltype` | `string or nil` | `nil` | Secondary fuel type accepted (e.g., `"cooking"`). |
| `sections` | `number` | `1` | Number of discrete fuel sections for UI/visual feedback. |
| `sectionfn` | `function or nil` | `nil` | Callback when fuel section changes. |
| `period` | `number` | `1` | Update interval (seconds) for consumption. |
| `bonusmult` | `number` | `1` | Global multiplier applied to fuel values. |
| `firstperiod` | `number or nil` | `nil` | Custom update interval for the first fuel consumption tick. |
| `firstperiodfull` | `number or nil` | `nil` | Custom interval when starting with full fuel (used with `firstperiod`). |
| `depleted` | `function or nil` | `nil` | Callback executed when fuel reaches 0. |
| `updatefn` | `function or nil` | `nil` | Callback executed every consumption update. |
| `cantakefuelitemfn` | `function or nil` | `nil` | Custom predicate allowing fuel item to be taken. |
| `ontakefuelitemfn` | `function or nil` | `nil` | Callback after taking a fuel item. |
| `ontakefuelfn` | `function or nil` | `nil` | Callback after any fuel is added. |
| `multfn` | `function or nil` | `nil` | Custom multiplier applied per fuel item. |

## Main Functions

### `StartConsuming()`
* **Description:** Begins periodic fuel consumption. Sets up a periodic task using `period`, and optionally handles a custom `firstperiod` using wall updates.
* **Parameters:** None.

### `StopConsuming()`
* **Description:** Stops fuel consumption, cancels periodic tasks, and clears any pending `firstperiod` wall updates.
* **Parameters:** None.

### `DoDelta(amount, doer)`
* **Description:** Adjusts `currentfuel` by `amount`, clamping between `0` and `maxfuel`. Triggers section change callbacks and events if the fuel section changes. Calls `depleted` callback if fuel reaches 0.
* **Parameters:**
  - `amount` (`number`): Amount of fuel to add (positive) or remove (negative).
  - `doer` (`Entity or nil`): Optional entity performing the action, passed to callbacks.

### `DoUpdate(dt)`
* **Description:** Consumes fuel proportional to `dt * rate * rate_modifiers`, and checks for depletion (which stops consumption). Executes `updatefn` if defined.
* **Parameters:**
  - `dt` (`number`): Time delta since last update.

### `TakeFuelItem(item, doer)`
* **Description:** Adds fuel to the entity based on a fuel item’s properties, applying modifiers (wetness, mastery, custom multipliers). Removes the item after successful consumption.
* **Parameters:**
  - `item` (`Entity`): The fuel item to consume.
  - `doer` (`Entity or nil`): Entity taking the fuel (used for bonuses).
* **Returns:** `boolean` — `true` if fuel was taken; `false` otherwise.

### `InitializeFuelLevel(fuel)`
* **Description:** Sets `currentfuel` to `fuel`, ensuring `maxfuel >= fuel`, and triggers section change callbacks/events if needed.
* **Parameters:**
  - `fuel` (`number`): Target fuel level.

### `GetPercent()`
* **Description:** Returns the current fuel level as a fraction (`0.0` to `1.0`) of `maxfuel`.
* **Parameters:** None.

### `SetPercent(amount)`
* **Description:** Sets `currentfuel` to `amount * maxfuel`.
* **Parameters:**
  - `amount` (`number`): Target fuel fraction (`0.0` to `1.0`).

### `GetSectionPercent()`
* **Description:** Returns the fractional progress within the current fuel section (`0.0` to `1.0`).
* **Parameters:** None.

### `GetCurrentSection()`
* **Description:** Returns the current fuel section index (`1` to `sections`), or `0` if empty.
* **Parameters:** None.

### `SetSectionCallback(fn)`
* **Description:** Sets `sectionfn`, which is called when fuel section changes.
* **Parameters:**
  - `fn` (`function`): Callback signature: `(newSection, oldSection, inst, doer?)`.

### `SetDepletedFn(fn)`
* **Description:** Sets `depleted`, which is called when fuel reaches `0`.
* **Parameters:**
  - `fn` (`function`): Callback signature: `(inst)`.

### `CanAcceptFuelItem(item)`
* **Description:** Checks if the entity can accept the given fuel item based on `accepting` state and fuel types.
* **Parameters:**
  - `item` (`Entity`): The fuel item to check.
* **Returns:** `boolean`.

### `MakeEmpty()`
* **Description:** Reduces `currentfuel` to `0`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns fuel data for serialization if `currentfuel ≠ maxfuel`.
* **Returns:** `{ fuel = number }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores fuel level from saved data.
* **Parameters:**
  - `data` (`table`): Saved data, expects `data.fuel`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for inspecting fuel state.
* **Parameters:** None.

### `AddThreshold(percent, fn)`
* **Description:** Adds a threshold callback (functionality is stubbed in the current code and not used).
* **Parameters:**
  - `percent` (`number`): Fuel threshold (0.0–1.0).
  - `fn` (`function`): Callback function.

## Events & Listeners
- **Events listened to via property setters (e.g., `fueltype = onfueltype`):**  
  Auto-registered listeners trigger handlers when properties change. Handlers:
  - `onfueltype`, `onsecondaryfueltype`, `onaccepting`, `onno_sewing`, `onmaxfuel`, `oncurrentfuel`.
- **Events emitted (`inst:PushEvent`):**
  - `"takefuel"` — when fuel is added (payload: `{ fuelvalue = number }`).
  - `"onfueldsectionchanged"` — when fuel section changes (payload: `{ newsection, oldsection, doer? }`).
  - `"percentusedchange"` — whenever fuel percentage changes (payload: `{ percent = number }`).