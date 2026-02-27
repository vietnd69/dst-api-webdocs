---
id: rechargeable
title: Rechargeable
description: Manages charge state, recharge rate, and battery-like behavior for items and entities that can be charged or depleted over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 0943147d
---

# Rechargeable

## Overview
The `Rechargeable` component implements battery-style charge mechanics for an entity, tracking how much charge remains (`current`) out of a maximum (`total`), how fast it recharges (`chargetime`), and whether it should be recharging (via `OnUpdate`). It supports dynamic charge-time modifiers, optional callbacks for charge/discharge events, and serialization for save/load. Entities using this component are tagged with `"rechargeable"`.

## Dependencies & Tags
- **Component Dependencies:** None explicitly required (works with any entity).
- **Tags Added:** `"rechargeable"` (added in constructor, removed in `OnRemoveFromEntity`).
- **Dependencies on other components:** None identified. Interacts with `inst.replica.inventoryitem` if present (for client-side sync), but does not require it.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `total` | number | `180` | Maximum charge amount. |
| `current` | number | `180` | Current charge amount. |
| `chargetime` | number | `30` | Base time (in seconds) required to recharge from 0 to `total`. |
| `chargetimemod` | SourceModifierList | `SourceModifierList(...)` | Modifier list for additive adjustments to charge time (e.g., from gear or buffs). |
| `ondischargedfn` | function | `nil` | Optional callback invoked once per discharge cycle when charge drops from full to partial. |
| `onchargedfn` | function | `nil` | Optional callback invoked once per charge cycle when charge reaches full. |
| `updating` | boolean | `false` | Internal flag indicating whether `OnUpdate` is active. |

## Main Functions

### `SetMaxCharge(val)`
* **Description:** Sets the maximum charge capacity (`total`). Adjusts `current` proportionally if the entity was not fully charged, or sets it to `val` if fully charged. Automatically starts/stops updating based on charge state.
* **Parameters:**
  - `val` (number): New maximum charge value (must be positive).

### `SetChargeTime(t)`
* **Description:** Updates the base charge time. Triggers UI/update updates if changed.
* **Parameters:**
  - `t` (number): New base charge time (in seconds). Must be ≥ 0.

### `SetChargeTimeMod(source, key, mod)`
* **Description:** Applies or updates a modifier to the charge time. If `mod` is zero, this acts as `RemoveChargeTimeMod`.
* **Parameters:**
  - `source` (string): Identifier for the modifier source (e.g., `"player_modifier"`).
  - `key` (string/number): Unique key within the source to allow overwrites.
  - `mod` (number): Additive value to apply to charge time multiplier.

### `RemoveChargeTimeMod(source, key)`
* **Description:** Removes a specific charge-time modifier.
* **Parameters:**
  - `source` (string): Source identifier.
  - `key` (string/number): Key of the modifier to remove.

### `SetCharge(val, overtime)`
* **Description:** Sets the current charge to `val`, clamped between `0` and `total`. Triggers `"rechargechange"` event. Plays entry/exit from full charge state via callbacks.
* **Parameters:**
  - `val` (number): Target charge value.
  - `overtime` (boolean): Passed to `"rechargechange"` event, typically indicating if the change exceeded real-time recharge limits.

### `Discharge(chargetime)`
* **Description:** Instantly sets charge to 0 and updates the charge time. Equivalent to fully depleting the item and possibly adjusting its recharge rate.
* **Parameters:**
  - `chargetime` (number): New charge time to use after discharging.

### `GetRechargeTime()`
* **Description:** Returns the effective charge time (accounting for modifiers), clamped to ≥ 0.
* **Returns:** `number` — Time in seconds to fully recharge from 0.

### `GetTimeToCharge()`
* **Description:** Estimates remaining time (in seconds) to reach full charge. Returns `0` if already fully charged.
* **Returns:** `number` — Estimated seconds until fully charged.

### `GetPercent()`, `SetPercent(pct)`
* **Description:** Convert between raw charge (`current`) and normalized percentage (`0.0`–`1.0`). `SetPercent` internally calls `SetCharge`.
* **Returns/Params:** Standard getter/setter for charge fraction.

### `IsCharged()`
* **Description:** Checks if current charge equals or exceeds total.
* **Returns:** `boolean` — `true` if fully charged.

### `OnUpdate(dt)`
* **Description:** Recharge logic called every frame while not fully charged. Increases `current` based on effective charge time and delta time.
* **Parameters:**
  - `dt` (number): Time elapsed since last frame.

### `OnSave()`, `OnLoad(data)`
* **Description:** Save/load helpers. `OnSave` returns a table of non-default state only when *not* fully charged. `OnLoad` applies saved charge and charge time.
* **Returns/Params:** See method implementation.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging: `current/total (percent%) @modifier_time Charging: time_or_dash`.
* **Returns:** `string` — Human-readable debug info.

### `SetOnDischargedFn(fn)`, `SetOnChargedFn(fn)`
* **Description:** Registers optional callbacks triggered once per transition into discharge/charge completion.
* **Parameters:**
  - `fn` (function): Callback taking `inst` as argument.

## Events & Listeners
- **Listens for:**
  - `"rechargechange"` — Internal state change event (not listened to externally; triggered by this component).
- **Triggers:**
  - `"rechargechange"` — Pushed whenever `current` changes. Payload: `{ percent = number, overtime = boolean }`.
  - Callback `ondischargedfn(inst)` — Invoked when charge drops *from* full *to* partial.
  - Callback `onchargedfn(inst)` — Invoked when charge reaches full *from* partial.