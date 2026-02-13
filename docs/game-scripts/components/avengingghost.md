---
id: avengingghost
title: Avengingghost
description: Manages the temporary 'avenging' state for player ghosts, granting them combat abilities for a limited time when near a skilled Wendy.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Avengingghost

## Overview
The `Avengingghost` component is responsible for managing a temporary empowered state for player ghosts. This state is activated when a player dies and becomes a ghost, provided there is a nearby Wendy player who has unlocked the "wendy_avenging_ghost" skill.

When active, the component grants the ghost a damage value that scales with the time of day (similar to Abigail), a red visual tint, and a particle effect. This "avenging" mode lasts for a limited duration, which ticks down over time. The countdown timer is slowed when the ghost performs an attack. The state ends when the timer expires or the player is resurrected.

## Dependencies & Tags
**Dependencies:**
- `combat`: The component modifies the entity's `defaultdamage`.
- `timer`: Used to track when the ghost has recently attacked to slow the avenge timer's decay.
- `aura`: An aura is enabled during the avenging state.
- `skilltreeupdater`: Checked on nearby players to see if the avenging state should be triggered.

**Tags:**
- The component's logic runs on entities with the `playerghost` tag.
- It scans for nearby entities with the `player` tag to find a skilled Wendy.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Caches whether the component is running on the server. |
| `_avengetime` | net\_float | 0 | The remaining time for the avenging state. Network-synchronized. |
| `_maxtime` | net\_float | 15 | The maximum duration of the avenging state. Network-synchronized. |
| `_symbol` | net\_hash | nil | A network-synchronized hash, though its usage is not apparent in this script. |
| `olddamage` | number | nil | Stores the ghost's original `defaultdamage` before it is modified by the avenging state. |
| `load_avengetime` | number | nil | A temporary variable to hold the avenge time loaded from save data. |

## Main Functions
### `GetSymbol()`
* **Description:** Returns the current value of the `_symbol` net variable.
* **Parameters:** None.

### `GetTime()`
* **Description:** Returns the current remaining time of the avenging state.
* **Parameters:** None.

### `GetMaxTime()`
* **Description:** Returns the maximum duration of the avenging state.
* **Parameters:** None.

### `ShouldAvenge()`
* **Description:** Checks if the conditions to start avenging are met. It scans for nearby players and returns `true` if any of them have the `wendy_avenging_ghost` skill activated. This is a server-side only function.
* **Parameters:** None.

### `StartAvenging(time)`
* **Description:** Initiates the avenging state on the ghost. This applies a red tint, adds a particle effect, changes the ghost's damage based on the time of day, and starts the countdown timer. This is a server-side only function.
* **Parameters:**
    * `time` (number, optional): The time in seconds to set the avenging timer to. If not provided, it defaults to `MAX_TIME` (15 seconds).

### `StopAvenging()`
* **Description:** Ends the avenging state. This restores the ghost's original damage, removes the visual effects, and stops the countdown timer. This is a server-side only function.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called every frame while the component is updating. It decrements the `_avengetime` timer. The rate of time decay is slowed by 50% (`SLOWRATE`) if the ghost has recently attacked. It calls `StopAvenging()` when the timer reaches zero.
* **Parameters:**
    * `dt` (number): The time delta since the last update.

### `OnSave()`
* **Description:** Serializes the component's state for saving the game. It saves the current `_avengetime`.
* **Parameters:** None.

### `OnLoad(data, newents)`
* **Description:** Deserializes the component's state from saved data. It restores the `_avengetime`.
* **Parameters:**
    * `data` (table): The saved data table.
    * `newents` (table): A table for remapping entity references, not used here.

## Events & Listeners
**Listens For:**
- `avengetimedirty`: When the `_avengetime` net variable changes, it pushes the `clientavengetimedirty` event for client-side updates.
- `ms_becameghost`: When the owner entity becomes a ghost, it checks if it `ShouldAvenge` and starts the process if true.
- `ms_respawnedfromghost`: When the owner entity is resurrected, it calls `StopAvenging`.
- `onareaattackother`: When the owner entity performs an area attack, it sets a short timer to indicate a recent attack, which slows the decay of the `_avengetime` in `OnUpdate`.

**Pushes:**
- `clientavengetimedirty`: Pushed to the client when the remaining avenge time changes, sending the new value.