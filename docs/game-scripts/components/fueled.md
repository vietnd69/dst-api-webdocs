---
id: fueled
title: Fueled
description: Manages fuel consumption, storage, and state transitions for entities that consume fuel over time.
tags: [fuel, consumption, entity, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: de3140c5
system_scope: entity
---

# Fueled

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Fueled` component manages fuel storage, consumption rate, and associated state for entities that rely on fuel (e.g., torches, lanterns, campfires). It tracks current and maximum fuel levels, supports multiple fuel types, and dynamically updates entity tags (`fueldepleted`, `burnable_fueled`, `needssewing`, etc.) based on fuel status and configuration. It integrates with `fuel`, `fueler`, `forgerepairable`, and `fuelmaster` components to support fuel input, bonuses, and repair logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueled")

inst.components.fueled.maxfuel = 120
inst.components.fueled.currentfuel = 120
inst.components.fueled.rate = 1.0
inst.components.fueled.fueltype = FUELTYPE.BURNABLE
inst.components.fueled.accepting = true
inst.components.fueled:SetUpdateFn(function(inst) print("Fuel updated") end)
inst.components.fueled:StartConsuming()
```

## Dependencies & tags
**Components used:** `fuel`, `fueler`, `forgerepairable`, `fuelmaster`, `SourceModifierList`
**Tags:** Adds/removes dynamically: `fueldepleted`, `burnable_fueled`, `needssewing`, or `*type*_fueled` (where `*type*` matches the current or secondary fuel type, e.g., `battery_fueled`), depending on fuel value, `accepting`, and `no_sewing` settings.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `maxfuel` | number | `0` | Maximum fuel capacity of the entity. |
| `currentfuel` | number | `0` | Current fuel level (cannot exceed `maxfuel`, cannot be negative). |
| `rate` | number | `1` | Base fuel consumption rate per second. |
| `rate_modifiers` | `SourceModifierList` | — | Aggregates modifiers applied to the consumption rate. |
| `no_sewing` | boolean or `nil` | `nil` | When `true`, disables the `needssewing` tag even if fuel is low and fueltype is `FUELTYPE.USAGE`. |
| `accepting` | boolean | `false` | Whether the entity can accept fuel items. |
| `fueltype` | `FUELTYPE.*` | `FUELTYPE.BURNABLE` | Primary fuel type accepted (e.g., `BURNABLE`, `BATTERY`). |
| `secondaryfueltype` | `FUELTYPE.*` or `nil` | `nil` | Optional secondary fuel type (only used for tagging/logic; never consumed simultaneously). |
| `sections` | number | `1` | Number of discrete visual/functional sections (for progression UI or logic). |
| `sectionfn` | function or `nil` | `nil` | Callback invoked when the current fuel section changes. Signature: `fn(newsection, oldsection, inst, doer?)`. |
| `period` | number | `1` | Update interval (seconds) for fuel consumption. |
| `firstperiod` | number or `nil` | `nil` | Initial update interval if fuel is not full; overrides `period` for first update only. |
| `firstperiodfull` | number or `nil` | `nil` | Update interval for the first update *if* fuel is full (requires `firstperiod`). |
| `firstperioddt` | number or `nil` | `nil` | Internal: temporary storage for initial update duration. |
| `bonusmult` | number | `1` | Multiplier applied to fuel value during `TakeFuelItem`. |
| `depleted` | function or `nil` | `nil` | Callback invoked when fuel reaches zero. Signature: `fn(inst)`. |
| `updatefn` | function or `nil` | `nil` | Callback invoked each update tick. Signature: `fn(inst)`. |
| `multfn` | function or `nil` | `nil` | Per-item multiplier function. Signature: `fn(inst, item)`. |
| `cantakefuelitemfn` | function or `nil` | `nil` | Precondition check for taking a specific item. Signature: `fn(inst, item, doer)`. |
| `ontakefuelitemfn` | function or `nil` | `nil` | Post-fuel-take callback. Signature: `fn(inst, item, fuelvalue, doer)`. |
| `ontakefuelfn` | function or `nil` | `nil` | Generic post-fuel-take callback (item-agnostic). Signature: `fn(inst, fuelvalue)`. |
| `task` | `PeriodicTask` or `nil` | `nil` | Internal task used for consumption updates. |

## Main functions
### `StartConsuming()`
*   **Description:** Begins fuel consumption at the configured `rate` and `period`. Registers a periodic task to call `DoUpdate`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if already consuming (`consuming == true`).

### `StopConsuming()`
*   **Description:** Stops fuel consumption. Cancels the periodic task and clears any pending first-period timers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoDelta(amount, doer)`
*   **Description:** Adjusts `currentfuel` by `amount`, clamping between `0` and `maxfuel`. Triggers section-change logic, `onfueldsectionchanged` events, and the `depleted` callback if fuel reaches zero.
*   **Parameters:** `amount` (number) — fuel delta (positive to add, negative to consume); `doer` (Entity or `nil`) — entity responsible for the change (passed to callbacks).
*   **Returns:** Nothing.
*   **Error states:** Does not trigger section callbacks if `oldsection == newsection` (e.g., partial changes within same section).

### `TakeFuelItem(item, doer)`
*   **Description:** Attempts to consume a fuel item (e.g., from inventory or an actor) and add its fuel value to `currentfuel`. Applies modifiers from `bonusmult`, `multfn`, wetness (`TUNING.WET_FUEL_PENALTY`), and `fuelmaster` bonus.
*   **Parameters:** `item` (Entity) — the fuel item to consume; `doer` (Entity or `nil`) — the entity performing the action (used for bonus calculation).
*   **Returns:** `boolean` — `true` if fuel was successfully added, `false` otherwise.
*   **Error states:** Returns `false` if `accepting == false`, item lacks a `fuel`/`fueler` component, or `fueltype` mismatch.

### `SetDepletedFn(fn)`
*   **Description:** Sets the callback executed when `currentfuel` reaches `0`.
*   **Parameters:** `fn` (function) — callback function; signature: `fn(inst)`.
*   **Returns:** Nothing.

### `SetSectionCallback(fn)`
*   **Description:** Sets the callback invoked when `currentfuel` crosses a section boundary.
*   **Parameters:** `fn` (function) — callback function; signature: `fn(newsection, oldsection, inst, doer?)`.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns the current fuel level as a normalized value between `0` and `1`.
*   **Parameters:** None.
*   **Returns:** number — `currentfuel / maxfuel` clamped to `[0, 1]`. Returns `0` if `maxfuel <= 0`.

### `GetSectionPercent()`
*   **Description:** Returns a normalized position *within the current section* (from `0` to `1`).
*   **Parameters:** None.
*   **Returns:** number — `(percent * sections) - (currentsection - 1)`. Example: in a 3-section fuel with `percent = 0.6`, `GetSectionPercent = 0.8`.

### `GetCurrentSection()`
*   **Description:** Returns the current fuel section index (`1` to `sections`).
*   **Parameters:** None.
*   **Returns:** number — `0` if `IsEmpty()`, otherwise `floor(percent * sections) + 1`, capped at `sections`.

### `IsEmpty()`
*   **Description:** Checks if fuel is depleted.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if `currentfuel <= 0`.

### `IsFull()`
*   **Description:** Checks if fuel is at capacity.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if `maxfuel > 0 and currentfuel >= maxfuel`.

### `InitializeFuelLevel(fuel)`
*   **Description:** Sets `currentfuel` to `fuel`. Ensures `maxfuel >= fuel` by adjusting `maxfuel` upward if needed. Triggers section-change events if the section index changes.
*   **Parameters:** `fuel` (number) — desired fuel level.
*   **Returns:** Nothing.

### `SetMultiplierFn(fn)`
*   **Description:** Sets the per-item fuel multiplier function (`multfn`).
*   **Parameters:** `fn` (function) — callback; signature: `fn(inst, item)`.
*   **Returns:** Nothing.

### `SetUpdateFn(fn)`
*   **Description:** Sets the per-update callback (`updatefn`), called each `DoUpdate`.
*   **Parameters:** `fn` (function) — callback; signature: `fn(inst)`.
*   **Returns:** Nothing.

### `CanAcceptFuelItem(item)`
*   **Description:** Checks if the given item is a valid fuel item (matches `fueltype` or `secondaryfueltype`).
*   **Parameters:** `item` (Entity or `nil`) — item to check.
*   **Returns:** boolean — `true` if `accepting == true` and the item has a matching fuel type.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging (status, fuel, consumption, section).
*   **Parameters:** None.
*   **Returns:** string — Example: `"ON 30.00/120.00 (-1.00, 0.25) : section 1/4 0.50"`.

### `MakeEmpty()`
*   **Description:** Empties fuel completely by calling `DoDelta` with negative `currentfuel`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetPercent(amount)`
*   **Description:** Sets `currentfuel` to `amount * maxfuel`.
*   **Parameters:** `amount` (number) — target fraction in `[0, 1]`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:**
  - `takefuel` — fired after fuel is taken; data: `{fuelvalue = number}`.
  - `percentusedchange` — fired after `DoDelta`; data: `{percent = number}`.
  - `onfueldsectionchanged` — fired when fuel section changes; data: `{newsection = number, oldsection = number, doer? = Entity}`.
