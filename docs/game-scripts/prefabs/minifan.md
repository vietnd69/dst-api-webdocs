---
id: minifan
title: Minifan
description: A wearable cooling device that consumes fuel to reduce endothermic heat while the player moves and stops cooling when idle or out of fuel.
tags: [inventory, cooling, fuel, wearable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2ded5b67
system_scope: inventory
---

# Minifan

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `minifan` prefab is a wearable tool that functions as a personal cooling device. When equipped and held by a player, it provides cooling (negative endothermic heat) and consumes fuel only while the player is moving forward. It integrates with the `equippable`, `fueled`, `heater`, `insulator`, `weapon`, and `inventoryitem` components. The fan also spawns a `fan_wheel` child entity while equipped and removes it on unequip or depletion.

## Usage example
```lua
local inst = SpawnPrefab("minifan")
inst.components.equippable:Equip(player)
-- Fan starts cooling only if player moves forward
-- Fan stops cooling and conserves fuel if player stops moving
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `heater`, `insulator`, `inventoryitem`, `inspectable`, `weapon`, `locomotor` (via listener on owner)
**Tags:** Adds `HASHEATER`, `weapon`, `minifan` (inherited via prefab), `coolingdevice` (derived from usage)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_wheel` | `Entity` or `nil` | `nil` | Reference to the spawned `fan_wheel` prefab when the fan is equipped. |
| `_owner` | `Entity` or `nil` | `nil` | Reference to the entity that currently holds the fan. |
| `_onlocomote` | function | (defined inline) | Event handler for `locomote` events on the owner, controlling fan consumption and spinning. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the fan is equipped. Sets up animation overrides, spawns the `fan_wheel`, and begins listening to the owner's `locomote` event.
*   **Parameters:** `inst` (`Entity`), `owner` (`Entity`) — the entity equipping the fan and its new owner.
*   **Returns:** Nothing.
*   **Error states:** If `_wheel` already exists, it is removed before spawning a new one.

### `onunequip(inst, owner)`
*   **Description:** Called when the fan is unequipped. Stops fuel consumption, removes insulation/heating effects, removes the wheel, cleans up event callbacks, and restores the owner’s animation state.
*   **Parameters:** `inst` (`Entity`), `owner` (`Entity`) — the fan and its former owner.
*   **Returns:** Nothing.
*   **Error states:** Safe if `fueled`, `insulator`, or `heater` components are missing — nil checks prevent crashes.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when the fan is equipped to a model (e.g., placed on a wall hook). Immediately stops fuel consumption and disables heating/cooling effects.
*   **Parameters:** `inst` (`Entity`), `owner` (`Entity`), `from_ground` (`boolean`) — unused but indicates source of equip.
*   **Returns:** Nothing.

### `ondepleted(inst)`
*   **Description:** Called when fuel runs out. Announces the item is empty (if held) and removes the fan from the world.
*   **Parameters:** `inst` (`Entity`) — the minifan instance.
*   **Returns:** Nothing.

### `_onlocomote(owner)`
*   **Description:** Internal handler for `locomote` events. Starts fuel consumption and cooling when owner moves forward; stops both when idle.
*   **Parameters:** `owner` (`Entity`) — the player entity sending the locomotion event.
*   **Returns:** Nothing.
*   **Error states:** No explicit error cases; depends on `fueled.consuming` state and `wantstomoveforward` boolean.

## Events & listeners
- **Listens to:** `locomote` — fired by the owner when movement state changes, triggers fan operation state.
- **Pushes:** None directly (events are handled via callbacks to external components or events).
- **Subscribes to:** `onremove` (on `_wheel`) — triggers `onremove(inst)` to clean up the wheel reference when the wheel is removed.
- **Event listener cleanup:** Event callbacks for `locomote` are explicitly removed in `onunequip()` to prevent memory leaks.
