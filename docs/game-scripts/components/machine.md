---
id: machine
title: Machine
description: Manages machine state including on/off status, cooldown, and ground-only behavior within the Entity Component System.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b4b044b6
---

# Machine

## Overview
The `Machine` component provides core logic for entity-based machines—tracking whether the machine is active (`ison`), managing cooldown periods after activation/deactivation, supporting optional ground-only placement, and emitting events when turned on/off. It integrates with tags and tasks to synchronize state with the game world and other systems.

## Dependencies & Tags
**Tags added/removed dynamically by component behavior:**
- `"turnedon"` — added when `ison = true`, removed when `ison = false`.
- `"cooldown"` — added when `oncooldown = true`, removed when `oncooldown = false`.
- `"enabled"` — added when `enabled = true`, removed when `enabled = false`.
- `"groundonlymachine"` — added when `groundonly = true`, removed otherwise.

**Other dependencies:**
- Relies on `inst:DoTaskInTime()` for cooldown timers.
- Uses `inst:PushEvent()` to broadcast `"machineturnedon"` and `"machineturnedoff"`.

**Note:** No components are explicitly added via `AddComponent()` in this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in constructor) | Reference to the parent entity instance. |
| `turnonfn` | `function?` | `nil` | Optional callback function invoked when `TurnOn()` is called. |
| `turnofffn` | `function?` | `nil` | Optional callback function invoked when `TurnOff()` is called. |
| `ison` | `boolean` | `false` | Indicates if the machine is currently on. |
| `cooldowntime` | `number` | `3` | Duration (in seconds) of the post-action cooldown period. |
| `oncooldown` | `boolean` | `false` | Indicates if the machine is currently in a cooldown state. |
| `enabled` | `boolean` | `true` | If `false`, the machine cannot interact with players or be used. |
| `groundonly` | `boolean` | `false` | If `true`, the machine is restricted to ground-only placement (used via `SetGroundOnlyMachine`). |
| `cooldowntask` | `Task?` | `nil` | Internal task handle for the cooldown timer; only created if `cooldowntime > 0`. |

## Main Functions

### `Machine:OnRemoveFromEntity()`
* **Description:** Cleans up state upon removal from an entity—removes all relevant tags and cancels pending cooldown task.
* **Parameters:** None.

### `Machine:SetGroundOnlyMachine(groundonly)`
* **Description:** Sets whether the machine is ground-only and updates the `"groundonlymachine"` tag accordingly.
* **Parameters:**
  - `groundonly` (`boolean`): Flag indicating if the machine must be placed on the ground.

### `Machine:OnSave()`
* **Description:** Serializes the machine’s state for saving—currently only the `ison` property.
* **Parameters:** None.
* **Returns:** `table` with `{ ison = self.ison }`.

### `Machine:OnLoad(data)`
* **Description:** Restores machine state from saved data and ensures tags/callbacks reflect the loaded status.
* **Parameters:**
  - `data` (`table?`): Saved state, expected to contain `data.ison`. If present, re-applies `TurnOn()` or `TurnOff()` to ensure consistency.

### `Machine:StartCooldown()`
* **Description:** Initiates a cooldown timer; sets `oncooldown = true` and schedules a delayed task to reset it. Does nothing if `cooldowntime <= 0`.
* **Parameters:** None.

### `Machine:StopCooldown()`
* **Description:** Cancels any pending cooldown task and immediately ends cooldown state.
* **Parameters:** None.

### `Machine:TurnOn()`
* **Description:** Activates the machine: starts cooldown, invokes `turnonfn` (if set), sets `ison = true`, and emits `"machineturnedon"` event.
* **Parameters:** None.

### `Machine:TurnOff()`
* **Description:** Deactivates the machine: starts cooldown, invokes `turnofffn` (if set), sets `ison = false`, and emits `"machineturnedoff"` event.
* **Parameters:** None.

### `Machine:IsOn()`
* **Description:** Returns the current on/off state.
* **Parameters:** None.
* **Returns:** `boolean` (`true` if `ison == true`).

### `Machine:CanInteract()`
* **Description:** Checks if the machine is ready for player interaction. Considers fuel status, item equipment state, and enabled flag.
* **Parameters:** None.
* **Returns:** `boolean` (`true` if no `"fueldepleted"` tag, not unequipped and held, and `enabled == true`).

### `Machine:GetDebugString()`
* **Description:** Generates a formatted debug string for inspection (e.g., in console or logs).
* **Parameters:** None.
* **Returns:** `string` — e.g., `"on=true, cooldowntime=3.00, oncooldown=false"`.

## Events & Listeners
- Listens to internal state changes via setter callbacks:
  - `ison` → triggers `onison()` → adds/removes `"turnedon"` tag.
  - `oncooldown` → triggers `ononcooldown()` → adds/removes `"cooldown"` tag.
  - `enabled` → triggers `onenabled()` → adds/removes `"enabled"` tag.
  - `groundonly` → triggers `ongroundonly()` → adds/removes `"groundonlymachine"` tag.
- Emits events:
  - `"machineturnedon"` — pushed in `TurnOn()`.
  - `"machineturnedoff"` — pushed in `TurnOff()`.