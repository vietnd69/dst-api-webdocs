---
id: wagdrone_common
title: Wagdrone Common
description: Provides shared utilities and lifecycle configuration for WAG drones, including support for friendly, loot, and hackable states.
tags: [loot, ai, boss, inventory, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8a711c9f
system_scope: entity
---

# Wagdrone Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagdrone_common.lua` is a shared utility module that defines configuration logic and helper functions for WAG drones in *Don't Starve Together*. It supports three distinct behavioral states: **hackable** (enemy unit controlled by a commander), **friendly** (deployable item with limited uses), and **loot** (destroyable structure that drops resources). The module integrates with several core components to manage state transitions, positioning, and item behavior, and is intended to be included and invoked from individual WAG drone prefabs during their initialization.

## Usage example
```lua
local inst = CreateEntity()
-- Initialize as a hackable unit (e.g., drone under commander control)
inst:AddComponent("entitytracker")
MakeHackable(inst)

-- Later, convert to a friendly item
ChangeToFriendly(inst)

-- Or convert to loot and prepare for destruction
ChangeToLoot(inst)
```

## Dependencies & tags
**Components used:** `commander`, `entitytracker`, `finiteuses`, `floater`, `health`, `inventoryitem`, `knowndynamiclocations`, `locomotor`, `lootdropper`, `teleportedoverride`, `workable`  
**Tags:** Adds `companion`, `donotautopick`, `NOCLICK`; checks `off`, `idle`, `ghost`, `playerghost`, `notarget`, `noattack`, `invisible`, `flight`, `electric_connector`, `wagdrone`, `wagboss`, `shadow*`, `brightmare*`.

## Properties
No public properties.

## Main functions
### `FindShockTargets(x, z, radius)`
*   **Description:** Finds entities within a radius that are valid shock targets for WAG drones (e.g., during rolling attack). Filters out ghosts, invisible entities, and other non-targets.
*   **Parameters:** `x` (number) - X coordinate; `z` (number) - Z coordinate; `radius` (number) - search radius.
*   **Returns:** Array of target entities.
*   **Error states:** Returns empty array if no entities match filter.

### `SetLedEnabled(inst, enable)`
*   **Description:** Toggles the drone’s LED indicator symbol (`LIGHT_ON`) based on `enable`.
*   **Parameters:** `inst` (Entity) - the drone instance; `enable` (boolean) - whether to show the LED.
*   **Returns:** Nothing.

### `MakeHackable(inst)`
*   **Description:** Configures `inst` as a hackable unit under a commander’s control. Adds the `entitytracker` component, registers listeners for commander-related events, and prepares for role transitions.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `HackableLoadPostPass(inst)`
*   **Description:** Called after world loading; attempts to re-establish the commander relationship by adding the drone as a soldier if a commander is found in `entitytracker`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `PreventTeleportFromArena(inst)`
*   **Description:** Ensures the drone cannot be teleported out of the WAG punk arena by adding a `teleportedoverride` component with a custom destination function.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `RemoveQuestConfig(inst)`
*   **Description:** Removes the `teleportedoverride` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `RemoveLootConfig(inst)`
*   **Description:** Removes the `workable` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `RemoveFriendlyConfig(inst)`
*   **Description:** Removes components and tags associated with the friendly state: `health.redirect`, `inventoryitem`, `finiteuses`, `knowndynamiclocations`; removes the `companion` tag.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnDespawn(inst)`
*   **Description:** Handles despawn event for hackable drones: removes self if asleep; otherwise sets `persists = false`, stops locomotion, and prepares for removal upon `entitysleep`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnGotCommander(inst, data)`
*   **Description:** Called when a commander is assigned; configures combat loyalty, overrides LED animations to red, tracks the commander, and sets up cleanup callback.
*   **Parameters:** `inst` (Entity); `data` (table) - includes `{commander = Entity}`.
*   **Returns:** Nothing.

### `OnLostCommander(inst, data)`
*   **Description:** Called when the commander is removed; clears tracker override, fires `deactivate`, and clears `dest`.
*   **Parameters:** `inst` (Entity); `data` (table) - includes `{commander = Entity}`.
*   **Returns:** Nothing.

### `ChangeToLoot(inst)`
*   **Description:** Transforms the drone into a destroyable loot object by adding the `workable` component with `HAMMER` action and `OnWorked` callback. Removes any previous quest or friendly configuration.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnWorked(inst, worker)`
*   **Description:** Callback when the loot drone is hammered; drops loot using `wagdrone_common` loot table, kills the drone if sleeping, or begins death animation and sound otherwise.
*   **Parameters:** `inst` (Entity); `worker` (Entity).
*   **Returns:** Nothing.

### `ChangeToFriendly(inst)`
*   **Description:** Converts the drone into a deployable friendly item (inventory item) with limited uses (`finiteuses`). Configures droppable/pocketed hooks, deploy point tracking, and health redirect logic.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeFriendablePristine(inst)`
*   **Description:** Prepares the drone for the friendly state *before* full initialization. Adds `donotautopick`, `__inventoryitem`, and sets up floating inventory state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeFriendable(inst)`
*   **Description:** Finalizes the friendly state conversion by replicating the `inventoryitem` component and listening for `floater_startfloating` events.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `IsFriendly(inst)`
*   **Description:** Checks if the drone is currently in the friendly state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if `inst.components.inventoryitem ~= nil`, else `false`.

### `FriendlySave(inst, data)`
*   **Description:** Saves whether the drone is in the friendly state into `data.isfriend`.
*   **Parameters:** `inst` (Entity); `data` (table).
*   **Returns:** Nothing.

### `FriendlyPreLoad(inst, data, ents)`
*   **Description:** Restores the friendly state on entity load if `data.isfriend` is present.
*   **Parameters:** `inst` (Entity); `data` (table, optional); `ents` (table, optional).
*   **Returns:** Nothing.

### `RememberDeployPoint(inst, dont_overwrite)`
*   **Description:** Records the drone’s current position as the `deploypoint` for friendly deployment.
*   **Parameters:** `inst` (Entity); `dont_overwrite` (boolean, optional) - if true, does not overwrite existing entry.
*   **Returns:** Nothing.

### `ForgetDeployPoint(inst)`
*   **Description:** Removes the stored `deploypoint`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Callback when the drone is repaired while not held or floating; records deploy point and fires `activate`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `gotcommander`, `lostcommander`, `despawn`, `onremove` (commander), `entitysleep`, `floater_startfloating`.
- **Pushes:** `activate`, `deactivate`, `depop`, `depleted` (via `OnDepleted` and `OnFloat`).