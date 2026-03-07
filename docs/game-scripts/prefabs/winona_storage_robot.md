---
id: winona_storage_robot
title: Winona Storage Robot
description: Manages the state, movement, power consumption, and circuit connectivity of Winona's autonomous storage robot.
tags: [inventory, ai, power, locomotion, circuit]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6e565abc
system_scope: entity
---

# Winona Storage Robot

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winona_storage_robot` prefab implements the logic for Winona's autonomous storage robot. It acts as a mobile inventory unit that can pick up items, store them, and travel between locations. It uses a `fueled` component for power management, a `circuitnode` for connecting to engineering batteries, and a custom brain for navigation and task execution. The robot deactivates and reverts to an inventory item when idle or out of power, and can be re-activated automatically under certain conditions.

## Usage example
```lua
local robot = SpawnPrefab("winona_storage_robot")
if robot and robot.components.fueled then
    -- Ensure robot has sufficient fuel to be active
    robot.components.fueled:InitializeFuelLevel(TUNING.WINONA_STORAGE_ROBOT_FUEL)
    -- Teleport robot to spawn point and activate deployment
    if robot.components.placer and robot.components.placer:GetPlacedEntity() then
        robot.components.deployable.ondeploy(robot, nil)
    end
end
```

## Dependencies & tags
**Components used:**  
`circuitnode`, `colouradder`, `deployable`, `deployhelper`, `fueled`, `health`, `inspectable`, `inventory`, `inventoryitem`, `locomotor`, `placer`, `powerload`, `skilltreeupdater`, `stackable`, `updatelooper`

**Tags added/checked:**  
`companion`, `NOBLOCK`, `scarytoprey`, `storagerobot`, `engineering`, `engineeringbatterypowered`, `usedeploystring`, `nobundling`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_quickcharge` | boolean | `false` | Whether the robot recharges quickly due to the "winona_gadget_recharge" skill. |
| `_deployed` | boolean | `false` | Whether the robot was explicitly deployed (`true`) or just dropped (`false`). |
| `_waitforminbattery` | boolean | `false` | Whether the robot is waiting to reach a minimum battery level before auto-reactivating. |
| `_wired` | boolean | `nil` | Whether the robot has established a circuit connection. |
| `_ledblinktask` | Task | `nil` | Task reference for LED blinking state. |
| `_ledblinktasktime` | number | `nil` | Time remaining for LED blinking if robot is asleep. |
| `_ledblinkon` | boolean | `nil` | Current LED on/off state during blinking. |
| `_offscreendeactivatetask` | Task | `nil` | Task that deactivates robot after being offscreen. |
| `_reactivatetask` | Task | `nil` | Task that periodically checks for reactivation conditions. |
| `_powertask` | Task | `nil` | Task that controls charging duration. |
| `_flash` | number | `nil` | Flash intensity for wire sparks visual effect. |
| `_originx` | net_float | `0` | Networked X position of robot's origin. |
| `_originz` | net_float | `0` | Networked Z position of robot's origin. |
| `_isactive` | net_bool | `false` | Networked flag indicating if robot is active (deployed). |

## Main functions
### `SetCharging(inst, powered, duration)`
*   **Description:** Controls whether the robot is charging. When powered, it starts consuming fuel and sets a load task. When powered is `false`, it cancels all charging tasks and resets power-related state.
*   **Parameters:**  
    `powered` (boolean) – whether to start/continue/extend charging.  
    `duration` (number) – how long to charge in seconds. Only extends if longer than remaining time.
*   **Returns:** Nothing.
*   **Error states:** If `powered` is `false`, all charging-related tasks and effects are cancelled unconditionally.

### `OnDeploy(inst, pt)`
*   **Description:** Activates the robot from its inactive (inventory) state to an autonomous mode. Attaches the `locomotor` component, sets the state graph and brain, enables circuit connectivity to batteries, and begins consuming fuel.
*   **Parameters:**  
    `pt` (Vector3 or nil) – Optional deployment position. If `nil`, only initialization logic runs (e.g., for loaded saves).
*   **Returns:** Nothing.

### `OnDeactivateRobot(inst)`
*   **Description:** Deactivates the robot, stopping all behaviors, resetting physics, canceling tasks, and disabling the state graph and brain. Reverts the robot to an inventory item, ready to be picked up.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddBatteryPower(inst, power)`
*   **Description:** Adds raw battery power to the robot. If battery is full, stops charging; otherwise starts a charging task for the given duration.
*   **Parameters:**  
    `power` (number) – duration in seconds for the charging task.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a string describing the robot's current operational status based on its state, charge, and circuit connection.
*   **Parameters:** None.
*   **Returns:** String: `"CHARGING"`, `"CHARGED"`, `"OFF"`, `"SLEEP"`, or `nil` if the robot is active and not in one of those modes.
*   **Error states:** Returns `nil` if robot is deployed (has a state graph), regardless of other conditions.

### `DoWireSparks(inst)`
*   **Description:** Triggers a wire spark sound and visual effect, typically on circuit connection or disconnection.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshLedStatus(inst)`
*   **Description:** Updates the LED behavior based on the robot's current state: held (off), active (on), has fuel but not charging (blinking), or no fuel (off).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `engineeringcircuitchanged` – notifies connected components when circuit state changes.  
    `on_no_longer_landed` – disconnects circuit when the robot is in floating state.  
    `on_landed` – reconnects circuit upon landing, if not held or deployed.  
    `floater_startfloating` – deactivates robot while floating.  
    `itemget` – adds `nobundling` tag if inventory contains a `nobundling` item.  
    `itemlose` – removes `nobundling` tag if inventory no longer contains it.  
    `teleported` – updates spawn point and may wake the robot.  
    `isactivedirty`, `origindirty` – used by placer helper to sync visual range ring.
- **Pushes:**  
    `engineeringcircuitchanged` – via `CircuitNode:ForEachNode` when circuit changes.  
    `onfueldsectionchanged` – triggers section callback in `fueled` component.
