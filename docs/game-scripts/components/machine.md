---
id: machine
title: Machine
description: Manages machine state including power (on/off), cooldowns, and interaction permissions.
tags: [machine, state, cooldown, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b4b044b6
system_scope: entity
---

# Machine

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Machine` is an entity component that manages core operational states for in-game machines: power (`ison`), cooldown (`oncooldown`), availability (`enabled`), and ground-only restrictions (`groundonly`). It supports save/load persistence, provides turn-on/turn-off hooks via callbacks, and emits events on state changes. It does not manage fuel, cooling, or complex logic—those responsibilities belong to other components or prefabs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("machine")
inst.components.machine.turnonfn = function(entity) -- do something when turned on end
inst.components.machine.turnofffn = function(entity) -- do something when turned off end
inst.components.machine:TurnOn()
inst.components.machine:TurnOff()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `turnedon`, `cooldown`, `enabled`, `groundonlymachine` via `AddOrRemoveTag`. On removal, also removes `turnedon`, `cooldown`, and `groundonlymachine`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `turnonfn` | function or `nil` | `nil` | Callback invoked when `TurnOn()` is called. Receives `inst` as argument. |
| `turnofffn` | function or `nil` | `nil` | Callback invoked when `TurnOff()` is called. Receives `inst` as argument. |
| `ison` | boolean | `false` | Whether the machine is currently powered on. |
| `cooldowntime` | number | `3` | Duration in seconds of the cooldown period after turning on/off. |
| `oncooldown` | boolean | `false` | Whether the machine is currently in cooldown (prevents further actions). |
| `enabled` | boolean | `true` | Whether the machine is enabled for interaction. |
| `groundonly` | boolean | `false` | Whether the machine must be placed on ground (no effect beyond tag; callers should enforce placement rules). |
| `cooldowntask` | Task or `nil` | `nil` | Internal task tracking cooldown duration. Not part of public API. |

## Main functions
### `TurnOn()`
* **Description:** Attempts to power the machine on. Initiates a cooldown period, invokes `turnonfn` if defined, and sets `ison = true`.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Does not prevent overriding cooldown logic—`CanInteract()` should be checked externally before calling.

### `TurnOff()`
* **Description:** Attempts to power the machine off. Initiates a cooldown period, invokes `turnofffn` if defined, and sets `ison = false`.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Same as `TurnOn()`.

### `StartCooldown()`
* **Description:** Begins the cooldown timer using `cooldowntime` seconds. Cancels any existing cooldown task before starting a new one.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `StopCooldown()`
* **Description:** Immediately cancels and resets the cooldown. Sets `oncooldown = false`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `CanInteract()`
* **Description:** Determines if the machine is currently eligible for player interaction. Checks fuel, equipment state, and `enabled` flag.  
* **Parameters:** None.  
* **Returns:** `true` if interaction is allowed; `false` otherwise.  
* **Error states:** Expects `equippable` and `inventoryitem` replicas to be present if applicable; returns `true` if replicas are absent.

### `IsOn()`
* **Description:** Returns whether the machine is currently on.  
* **Parameters:** None.  
* **Returns:** `true` if `ison` is `true`; otherwise `false`.

### `SetGroundOnlyMachine(groundonly)`
* **Description:** Sets the `groundonly` flag and updates the `groundonlymachine` tag.  
* **Parameters:** `groundonly` (boolean) – whether the machine must be placed on the ground.  
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for saving.  
* **Parameters:** None.  
* **Returns:** Table `{ ison = boolean }`.

### `OnLoad(data)`
* **Description:** Restores component state after loading. Restarts current power state via `TurnOn()` or `TurnOff()`.  
* **Parameters:** `data` (table or `nil`) – save data as returned by `OnSave()`.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a compact debug representation of internal state.  
* **Parameters:** None.  
* **Returns:** String in the format `"on={bool}, cooldowntime={float}, oncooldown={bool}"`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `machineturnedon` (when `TurnOn()` completes), `machineturnedoff` (when `TurnOff()` completes)
