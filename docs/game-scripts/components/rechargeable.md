---
id: rechargeable
title: Rechargeable
description: Manages charge progression and recharge logic for inventory items and other entities with variable charge capacity.
tags: [inventory, charge, combat, entity, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0943147d
system_scope: inventory
---

# Rechargeable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Rechargeable` component implements a charge-based system where entities (typically inventory items such as lights, weapons, or tools) can hold and replenish a numeric charge value over time. It supports configurable maximum charge, recharge rate (modified by sources), and optional callback hooks for charging/discharging events.

This component integrates tightly with the `inventoryitem` replica component to sync charge time across networked clients and adds the `rechargeable` tag to its entity. Entities with this component are automatically updated each frame when discharging and stop updating when fully charged.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rechargeable")
inst.components.rechargeable:SetMaxCharge(100)
inst.components.rechargeable:SetChargeTime(60)
inst.components.rechargeable:SetCharge(0) -- start discharged
```

## Dependencies & tags
**Components used:** `inventoryitem` (accessed via `inst.replica.inventoryitem` for networked charge time updates)  
**Tags:** Adds `rechargeable`; removes `rechargeable` on component removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `total` | number | `180` | Maximum charge capacity of the entity. |
| `current` | number | `180` | Current charge level (always `0 <= current <= total`). |
| `chargetime` | number | `30` | Time in seconds required to fully charge from 0 to `total`. |
| `chargetimemod` | SourceModifierList | `SourceModifierList(...)` | Modifies effective charge time multiplicatively via additive modifiers. |
| `ondischargedfn` | function | `nil` | Callback invoked once when transitioning from charged to discharged. |
| `onchargedfn` | function | `nil` | Callback invoked once when transitioning from discharged to charged. |
| `updating` | boolean | `false` | Internal flag indicating whether the component is currently being updated per frame. |

## Main functions
### `SetMaxCharge(val)`
*   **Description:** Sets the maximum charge capacity. Adjusts current charge proportionally if already charged; otherwise, preserves the charge percentage.
*   **Parameters:** `val` (number) - new maximum charge value.
*   **Returns:** Nothing.
*   **Error states:** No-op if `val == self.total`.

### `SetChargeTime(t)`
*   **Description:** Sets the base recharge time (seconds). Triggers an immediate update to the effective charge time if changed.
*   **Parameters:** `t` (number) - base recharge time in seconds.
*   **Returns:** Nothing.
*   **Error states:** No-op if `t == self.chargetime`.

### `SetChargeTimeMod(source, key, mod)`
*   **Description:** Adds or updates a modifier to the effective charge time. If `mod == 0`, delegates to `RemoveChargeTimeMod`.
*   **Parameters:**  
    `source` (string|number) - unique identifier for the modifier source (e.g., a buff ID).  
    `key` (string|number) - sub-key for multiple modifiers from same source.  
    `mod` (number) - additive modifier applied to charge time (e.g., `-0.2` for 20% faster).  
*   **Returns:** Nothing.
*   **Error states:** Modifiers are additive; no explicit validation beyond zero-mod removal.

### `RemoveChargeTimeMod(source, key)`
*   **Description:** Removes a previously set charge time modifier.
*   **Parameters:**  
    `source` (string|number) - the source identifier used during `SetChargeTimeMod`.  
    `key` (string|number) - the key used during `SetChargeTimeMod`.  
*   **Returns:** Nothing.

### `IsCharged()`
*   **Description:** Returns whether the current charge has reached or exceeded the maximum.
*   **Parameters:** None.
*   **Returns:** `true` if `current >= total`, otherwise `false`.

### `SetCharge(val, overtime)`
*   **Description:** Sets the current charge value and manages state transitions (charging/discharging). Triggers the `rechargechange` event and `ondischargedfn`/`onchargedfn` callbacks as needed.
*   **Parameters:**  
    `val` (number) - target charge value (clamped to `[0, total]`).  
    `overtime` (boolean) - indicates whether this change occurred at or beyond full charge time (used for event metadata).  
*   **Returns:** Nothing.

### `GetChargeTime()`
*   **Description:** Returns the base recharge time (unscaled).
*   **Parameters:** None.
*   **Returns:** number - base charge time in seconds.

### `GetCharge()`
*   **Description:** Returns the current charge amount.
*   **Parameters:** None.
*   **Returns:** number - current charge value.

### `Discharge(chargetime)`
*   **Description:** Instantly sets charge to `0` and configures the recharge rate via `SetChargeTime`.
*   **Parameters:** `chargetime` (number) - time in seconds for full recharge from 0.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns the charge level as a fraction between `0` and `1`.
*   **Parameters:** None.
*   **Returns:** number - `current / total`.

### `SetPercent(pct)`
*   **Description:** Sets charge based on a percentage (`0 <= pct <= 1`).
*   **Parameters:** `pct` (number) - desired fraction of maximum charge.
*   **Returns:** Nothing.

### `GetRechargeTime()`
*   **Description:** Returns the *effective* recharge time, incorporating modifiers.
*   **Parameters:** None.
*   **Returns:** number - recharge time in seconds (guaranteed `>= 0`).

### `GetTimeToCharge()`
*   **Description:** Estimates time (in seconds) to reach full charge from current level.
*   **Parameters:** None.
*   **Returns:** number - time to full charge (returns `0` if already fully charged).

### `GetDebugString()`
*   **Description:** Generates a human-readable debug summary string including current/maximum charge, percentage, modifier factor, and estimated time to full charge.
*   **Parameters:** None.
*   **Returns:** string - formatted debug output (e.g., `"120/180 (66.67%) @120% time Charging: 10.50s"`).

## Events & listeners
- **Listens to:** None (component does not register external event listeners).
- **Pushes:**  
  `rechargechange` — fired whenever `SetCharge` modifies `current`. Payload:  
  `{ percent = number (0..1), overtime = boolean }`

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  `rechargechange` — fired on charge value change via `SetCharge`. Payload: `{ percent = number, overtime = boolean }`
