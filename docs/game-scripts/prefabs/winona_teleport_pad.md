---
id: winona_teleport_pad
title: Winona Teleport Pad
description: Manages construction, power state, circuit connectivity, and teleportation power consumption for the Winona teleport pad structure.
tags: [engineering, power, circuit, teleportation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ed593870
system_scope: world
---

# Winona Teleport Pad

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winona_teleport_pad` prefab represents a power-dependent engineering structure that connects to engineering batteries via circuitry and consumes power for teleportation events. It manages visual state (wires, beacon), power usage, interaction via hammering, deployment, collapse, burning, and remote teleport coordination. It is an ECS-driven entity relying on multiple components (`circuitnode`, `powerload`, `workable`, `burnable`, `deployable`, etc.) to implement its behavior.

## Usage example
```lua
-- Typically instantiated automatically by the game engine.
-- Example of powering and triggering a teleport:
local pad = SpawnPrefab("winona_teleport_pad")
pad:AddBatteryPower(10) -- Powers the pad for 10 seconds
-- Later, when a remote teleport request is received:
pad:PushEvent("remoteteleportreceived", { from_x = x, from_z = z, doer = player })
```

## Dependencies & tags
**Components used:** `updatelooper`, `colouraddersync`, `deployhelper`, `portablestructure`, `inspectable`, `colouradder`, `lootdropper`, `workable`, `savedrotation`, `circuitnode`, `powerload`, `hauntable`, `burnable`, `propagator`, `placer`.

**Tags added:** `engineering`, `engineeringbatterypowered`, `structure`, `FX`, `NOCLICK`, `placer`.

**Tags checked/removed:** `burnt`, `HAMMER_workable`, `handyperson`, `debris`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_wired` | `net_bool` | `false` | Networked flag indicating whether the pad is electrically connected to a battery. |
| `_syncanims` | `net_bool` | `false` | Networked flag used to synchronize animation syncing via post-updates. |
| `_led` | `net_bool` | `false` | Networked flag indicating whether the LED beacon is active (powered). |
| `_flash` | number or `nil` | `nil` | Controls wire spark effect duration on initial connection. |
| `_inittask` | `GGameTimer` or `nil` | `nil` | Delayed initialization task used during construction. |
| `_collapsetask` | `GGameTimer` or `nil` | `nil` | Task managing the item collapse animation duration. |
| `_powertask` | `GGameTimer` or `nil` | `nil` | Task tracking powered state expiration. |
| `highlightchildren` | array of entities | `{inst._beacon, inst._redwire, inst._bluewire}` | Visual sub-entities whose color is controlled via `colouradder`. |
| `pendingremoval` | boolean | `false` | Flag indicating the pad is pending removal due to collapse or dismantling. |

## Main functions
### `SetPowered(inst, powered, duration)`
* **Description:** Activates or deactivates the powered state of the pad. When powered, it sets the LED beacon, schedules a timer to turn it off after `duration` seconds, and cancels ongoing timers if turned off.
* **Parameters:**  
  `powered` (boolean) – whether to turn power on or off.  
  `duration` (number) – time in seconds the power should remain active; ignored if `powered` is `false`.
* **Returns:** Nothing.
* **Error states:** No effect if `powered` is `false` and no active timer exists.

### `AddBatteryPower(inst, power)`
* **Description:** Public method to provide temporary power to the pad. Calls `SetPowered(inst, true, power)`.
* **Parameters:**  
  `power` (number) – duration in seconds of power.
* **Returns:** Nothing.

### `IsPowered(inst)`
* **Description:** Returns whether the pad is currently powered.
* **Parameters:** None.
* **Returns:** `true` if `_powertask` is non-`nil`, otherwise `false`.

### `OnBuilt2(inst, doer)`
* **Description:** Completes construction after deployment. Removes the `NOCLICK` tag, connects to engineering batteries, and notifies connected batteries that the pad has been used.
* **Parameters:**  
  `doer` (entity or `nil`) – the entity that built the pad.
* **Returns:** Nothing.

### `DoBuiltOrDeployed(inst, doer)`
* **Description:** Handles initial placement of the pad. Cancels initialization tasks, disconnects existing circuitry, plays deploy animation, and schedules `OnBuilt2` after a delay.
* **Parameters:**  
  `doer` (entity or `nil`) – the builder/deployer.
* **Returns:** Nothing.

### `ChangeToItem(inst)`
* **Description:** Transforms the pad into its item form (`winona_teleport_pad_item`) when dismantled. Spawns particle FX, sound, and manages collapse animation and inventory interaction.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnWorkFinished(inst)`
* **Description:** Called when hammering is complete. Drops loot, spawns FX, disconnects circuitry, disables components, and removes the pad after a short delay.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBurnt(inst)`
* **Description:** Handles post-burn behavior (replaces components, sets burnt state, disconnects circuitry, disables work callbacks, and syncs burnt animation).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnDismantle(inst)`
* **Description:** Handles dismantling. Calls `ChangeToItem`, disables circuitry, power, workability, and transitions to a collapsing animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoteTeleportReceived(inst, data)`
* **Description:** Handles remote teleport requests. Calculates power cost based on distance and consumed battery capacity, then instructs all connected batteries to consume fuel/shards.
* **Parameters:**  
  `data` (table) – contains teleport metadata including `from_x`, `from_z`, and `doer`.  
* **Returns:** Nothing.

### `SyncAnims(inst, anim, frame)`
* **Description:** Synchronizes animations of sub-entities (beacon, red wire, blue wire) with the main pad's animation state.
* **Parameters:**  
  `anim` (string or `nil`) – animation name (e.g., `pad_deploy`, `pad_hit`).  
  `frame` (number or `nil`) – frame to set if non-zero.
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves state (`burnt` or remaining power) for persistence.
* **Parameters:**  
  `data` (table) – destination table for serialized data.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Loads saved state. Restores burnt state, re-applies power, or reconnects circuitry on load.
* **Parameters:**  
  `data` (table or `nil`) – saved data from `OnSave`.
* **Returns:** Nothing.

### `PushSyncAnims(inst, anim)`
* **Description:** Triggers animation synchronization on the client via networked bool and directly updates sub-entities on the local machine.
* **Parameters:**  
  `anim` (string) – animation to play.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `engineeringcircuitchanged` – notifies pad when circuit connections change.  
  - `remoteteleportreceived` – initiates power cost deduction for a teleport.  
  - `animover` – resets `_syncanims` local flag after animation completes.  
  - `wireddirty` – updates wire visibility and spark state on client.  
  - `syncanimsdirty` – triggers animation sync via post-update.  
  - `leddirty` – updates beacon LED visual state on client.  

- **Pushes:**  
  - `ms_registerwinonateleportpad` – registers the pad with the world for telemetry or discovery (only on master).