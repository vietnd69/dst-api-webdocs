---
id: winona_battery_low
title: Winona Battery Low
description: Manages low-capacity energy storage, fuel consumption, circuit integration, and elemental fuel type handling for Winona's battery structure in Don't Starve Together.
tags: [energy, circuit, fuel, engineering, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: edaa43f5
system_scope: entity
---

# Winona Battery Low

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona_battery_low` is a structure prefab that provides portable, low-capacity energy storage for Winona's engineering devices. It supports three fuel types—chemical, nightmare, and horror fuel—with prioritized consumption logic. The component integrates with the engineering circuit system, managing power delivery to connected devices, updating animations/sound loops based on charge level, and persisting skill tree upgrade state. It also handles transformation between active battery structures and portable items upon dismantling or collapse.

## Usage example
```lua
-- Add to an entity during prefab creation
inst:AddComponent("fueled")
inst.components.fueled:InitializeFuelLevel(TUNING.WINONA_BATTERY_LOW_MAX_FUEL_TIME)
inst.components.fueled.accepting = true
inst.components.fueled:StartConsuming()

inst:AddComponent("circuitnode")
inst.components.circuitnode:SetRange(TUNING.WINONA_BATTERY_RANGE)
inst.components.circuitnode:SetOnConnectFn(OnConnectCircuit)
inst.components.circuitnode:SetOnDisconnectFn(OnDisconnectCircuit)

inst:AddComponent("battery")
inst.components.battery.canbeused = CanBeUsedAsBattery
inst.components.battery.onused = UseAsBattery
```

## Dependencies & tags
**Components used:** `fueled`, `circuitnode`, `battery`, `burnable`, `portablestructure`, `workable`, `lootdropper`, `inspectable`, `deployable`, `deployhelper`, `hauntable`, `inventoryitem`, `placer`, `powerload`, `skilltreeupdater`, `updatelooper`

**Tags added:** `structure`, `engineering`, `engineeringbattery`, `NOCLICK`, `CLASSIFIED`, `NOCLICK`, `placer`, `portableitem`  
**Tags checked:** `burnt`, `handyperson`, `engineerid`, `HORROR`, `CHEMICAL`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_chemical_level` | number | `0` | Amount of chemical fuel stored (priority lowest). |
| `_nightmare_level` | number | `0` | Amount of nightmare fuel stored. |
| `_horror_level` | number | `0` | Amount of horror fuel stored (priority highest when active). |
| `_efficiency` | number | `0` | Skill tree efficiency tier (0–3). |
| `_noidledrain` | boolean | `false` | Whether idle drain is disabled per skill upgrade. |
| `_engineerid` | string | `nil` | User ID of the engineer who built/deployed this battery. |
| `_batterytask` | task | `nil` | Periodic task that pulses battery power to connected nodes. |
| `_circuittask` | task | `nil` | Deferred task to update circuit load after circuit changes. |
| `_inittask` | task | `nil` | Initialization task deferred for post-pass loading. |

## Main functions
### `DoAddBatteryPower(inst, node)`
*   **Description:** Adds periodic power (`PERIOD + random(2,6) * FRAMES`) to a connected node.
*   **Parameters:** `inst` (Entity) - The battery instance; `node` (Entity) - The connected engineering device.
*   **Returns:** Nothing.

### `StartBattery(inst)`
*   **Description:** Starts the periodic battery task if not already running.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `StopBattery(inst)`
*   **Description:** Cancels and clears the periodic battery task.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `UpdateCircuitPower(inst)`
*   **Description:** Calculates total load across the circuit and adjusts the battery's fuel consumption rate, respecting `noIdleDrain` and minimum load settings. Called after circuit topology changes.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `OnConnectCircuit(inst)`
*   **Description:** Handler for circuit node connection. Starts the battery task and triggers circuit power update if consuming.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `OnDisconnectCircuit(inst)`
*   **Description:** Handler for circuit node disconnection. Stops the battery task if no nodes remain connected and triggers power update.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `CanBeUsedAsBattery(inst, user)`
*   **Description:** Determines if the battery can supply charge to another device (e.g., for powering beacons or other devices).
*   **Parameters:** `inst` (Entity) - The battery instance; `user` (Entity, optional) - The user attempting to use it.
*   **Returns:** `true` if sufficient fuel remains; otherwise `false, "NOT_ENOUGH_CHARGE"`.

### `UseAsBattery(inst, user)`
*   **Description:** Consumes battery charge when used by another device. Updates skill tree upgrades and circuit power if applicable.
*   **Parameters:** `inst` (Entity) - The battery instance; `user` (Entity, optional) - The user using it.
*   **Returns:** Nothing.

### `ConfigureSkillTreeUpgrades(inst, builder)`
*   **Description:** Reads skill tree upgrades from `builder` and updates `_efficiency` and `_noidledrain`. Sets `_engineerid` if builder is a Handyman.
*   **Parameters:** `inst` (Entity) - The battery instance; `builder` (Entity, optional) - The user who deployed/build the battery.
*   **Returns:** `true` if any upgrade state changed; otherwise `false`.

### `RefreshFuelTypeEffects(inst)`
*   **Description:** Syncs animation layer visibility (`CHEMICAL`/`HORROR`) and colorizes meter symbols (`m1`–`m6`) to indicate fuel type and remaining charge.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `SetFuelEmpty(inst, silent)`
*   **Description:** Resets all fuel levels, stops consumption, removes animation symbols, disables plug glow, and updates sound. Called when fuel reaches zero.
*   **Parameters:** `inst` (Entity) - The battery instance; `silent` (boolean) - Whether to suppress sound effects.
*   **Returns:** Nothing.

### `OnAddFuelItem(inst, item, fuelvalue, doer)`
*   **Description:** Called immediately before a fuel item is consumed. Handles skill tree updates, fuel type priority adjustment, and circuit refresh if elemental fuel type changed.
*   **Parameters:** `inst` (Entity) - The battery instance; `item` (Entity) - The fuel item being added; `fuelvalue` (number) - Amount of fuel added; `doer` (Entity, optional) - The user adding fuel.
*   **Returns:** Nothing.

### `OnUpdateFueled(inst)`
*   **Description:** Called on each fuel consumption tick. Consumes fuel by priority (chemical < nightmare < horror) and refreshes visual effects.
*   **Parameters:** `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `OnFuelSectionChange(new, old, inst)`
*   **Description:** Updates meter symbol visibility (`m1`–`m6`), plug lighting/bloom, and sound intensity based on current charge section (0–6).
*   **Parameters:** `new` (number) - New section index; `old` (number) - Previous section index; `inst` (Entity) - The battery instance.
*   **Returns:** Nothing.

### `ConsumeBatteryAmount(inst, cost, share, doer)`
*   **Description:** Consumes a specified amount of fuel from the battery, handling shadow fuel (horror/nightmare) separately and converting remaining chemical.
*   **Parameters:** `inst` (Entity) - The battery instance; `cost` (`{ fuel = number }`) - Cost definition; `share` (number, optional) - Number of shares; `doer` (Entity, optional) - The entity consuming.
*   **Returns:** Nothing.

### `DoBuiltOrDeployed(inst, doer, anim, sound, powerupframe, connectframe)`
*   **Description:** Handles animation playback, sound, and initialization sequence during build/deploy, including delayed fuel-up and circuit connection.
*   **Parameters:** `inst` (Entity) - The battery instance; `doer` (Entity, optional); `anim` (string) - Animation name; `sound` (string) - Sound event name; `powerupframe`, `connectframe` (number) - Frame offsets for delayed callbacks.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` - Triggers `OnBuilt` for full build initialization.  
  - `engineeringcircuitchanged` - Triggers `OnCircuitChanged` to recalculate circuit load.  
  - `winona_batteryskillchanged` - Updates skill tree upgrades if triggered by the engineer who built the battery.  
  - `animover` - Used for animation sequence synchronization during build/deploy and hit animations.  
  - `death` - Handled internally by `burnable` component.  
  - `OnEntityWake`, `OnEntitySleep` - Controls sound loop playback.  

- **Pushes:**  
  - `engineeringcircuitchanged` - Broadcasted to connected nodes to propagate circuit change notifications.  
  - Events used internally by components (e.g., `fueled`, `burnable`, `battery`).  
