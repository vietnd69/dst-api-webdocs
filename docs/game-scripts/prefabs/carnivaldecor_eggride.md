---
id: carnivaldecor_eggride
title: Carnivaldecor Eggride
description: A networked arcade decoration item that, when activated, plays an animation sequence and sound loop for a set duration before automatically turning off; it supports activation via direct use or token exchange.
tags: [decor, event, activatable, trade]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5fad608f
system_scope: entity
---

# Carnivaldecor Eggride

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnivaldecor_eggride` is a prefab constructor for seasonal carnival ride decorations used in summer events. It defines reusable logic to spawn three physical ride variants (`carnivaldecor_eggride1` to `carnivaldecor_eggride4`) and their corresponding deployable kits. When placed, the decoration starts in an "off" state and can be activated by a player (e.g., via `activate` action) or by inserting a `carnival_gametoken`. Activation triggers a timed on/off cycle with associated animations and looping sounds. It integrates with multiple core components (`activatable`, `trader`, `workable`, `carnivaldecor`, `lootdropper`, `inspectable`) to handle interaction, trade logic, durability, and loot.

## Usage example
```lua
-- Example: Spawn and activate a Carnivaldecor Eggride variant
local ride = Prefab("carnivaldecor_eggride2", "prefabs/carnivaldecor_eggride")
local inst = ride()
inst.Transform:SetPosition(0, 0, 0)

-- Manually activate (equivalent to player using "activate" action)
inst.components.activatable:OnActivate(inst, player)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `carnivaldecor`, `trader`, `workable`, `activatable`, `burnable`, `propagator`, `fueled`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags added:** `carnivaldecor`, `structure`, `cattoyairborne`

## Properties
No public properties are initialized directly in this file. Runtime component state (e.g., `activatable.inactive`, `carnivaldecor.value`) is managed by the respective component classes.

## Main functions
### `common_fn(data)`
*   **Description:** Core prefab constructor function. Creates the entity, attaches required components, sets up event listeners, and configures physics, animation, tags, and network state. Returns a fully initialized entity (pristine on client, functional on master simulation).
*   **Parameters:** `data` (table) — contains `bank`, `build`, `physics_radius`, and optional `common_postinit`/`master_postinit` hooks.
*   **Returns:** `inst` — the initialized entity instance.
*   **Error states:** Returns early on non-master simulation (client-side) after basic setup.

### `TurnOnRide(inst, duration)`
*   **Description:** Initiates the ride activation sequence: plays turn-on animation, starts looping sound, schedules an automatic turn-off after `duration` seconds.
*   **Parameters:**  
    `inst` (Entity) — the ride instance.  
    `duration` (number) — time in seconds before turning off.
*   **Returns:** Nothing.
*   **Error states:** If a `turnofftask` already exists (i.e., already active), it cancels the current scheduled turn-off and resets the timer.

### `TurnOffRide(inst)`
*   **Description:** Handles the ride deactivation: plays turn-off and off animations, kills loop sound, marks the activatable component as inactive, and clears the turn-off task.
*   **Parameters:** `inst` (Entity) — the ride instance.
*   **Returns:** Nothing.

### `OnActivate(inst, doer)`
*   **Description:** Callback triggered when a player directly activates the ride. Calls `TurnOnRide` with `TUNING.CARNIVALDECOR_EGGRIDE_ACTIVATE_TIME`.
*   **Parameters:**  
    `inst` (Entity) — the ride instance.  
    `doer` (Entity) — the player or actor performing activation.
*   **Returns:** `true` (success).
*   **Error states:** None.

### `OnAcceptItem(inst, doer)`
*   **Description:** Callback triggered by the `trader` component when a valid `carnival_gametoken` is accepted. Calls `TurnOnRide` with `TUNING.CARNIVALDECOR_EGGRIDE_TOKEN_TIME`.
*   **Parameters:**  
    `inst` (Entity) — the ride instance.  
    `doer` (Entity) — the player providing the item.
*   **Returns:** `true` (success).
*   **Error states:** None.

### `AbleToAcceptTest(inst, item, giver)`
*   **Description:** Validates whether a `carnival_gametoken` can be inserted into the ride. Requires the ride to be inactive (`inactive` tag present) and the item to be exactly `carnival_gametoken`.
*   **Parameters:**  
    `inst` (Entity) — the ride instance.  
    `item` (Entity) — the item being offered.  
    `giver` (Entity) — the player attempting to insert the item.
*   **Returns:**  
    `true` — if valid,  
    `false, "CARNIVALGAME_INVALID_ITEM"` — otherwise.
*   **Error states:** If the ride is already active (`not inactive` tag), returns `false`.

### `OnBuilt(inst)`
*   **Description:** Event callback fired after placement. Plays the "place" animation once and then the "off" animation in a loop, and triggers the placement sound.
*   **Parameters:** `inst` (Entity) — the ride instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Hammering callback for the `workable` component. Destroys the ride: spawns `collapse_small` FX, drops loot via `lootdropper:DropLoot()`, and removes the entity.
*   **Parameters:**  
    `inst` (Entity) — the ride instance.  
    `worker` (Entity) — the player hammering it.
*   **Returns:** Nothing.

### `onloop(inst)`
*   **Description:** Animation callback invoked after the "turn_on" animation completes. Plays the "loop" animation and, if defined, starts the one-off loop sound (e.g., music).
*   **Parameters:** `inst` (Entity) — the ride instance.
*   **Returns:** Nothing.

### `make_cannon(prefabname, data)`
*   **Description:** Helper to define a Prefab for a specific ride variant (e.g., `carnivaldecor_eggride1`). Sets up assets and uses `common_fn` as the constructor.
*   **Parameters:**  
    `prefabname` (string) — the unique prefab name (e.g., `"carnivaldecor_eggride3"`).  
    `data` (table) — configuration data matching one entry in `defs`.
*   **Returns:** `Prefab` instance ready for use.

### `OnAcceptItem` & `AbleToAcceptTest`
*   **Description:** Bound to `trader` component to enable token-based activation. These are referenced in `common_fn` as `inst.components.trader.onaccept` and via `SetAbleToAcceptTest`.

## Events & listeners
- **Listens to:**  
    `animover` — triggers `onloop` to transition to the loop animation after turn-on.  
    `onbuilt` — triggers `OnBuilt` after placement.
- **Pushes:** None (the component itself does not fire custom events; event propagation is handled by components like `lootdropper`, which fires `entity_droploot`).