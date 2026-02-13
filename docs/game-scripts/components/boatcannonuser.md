---
id: boatcannonuser
title: Boatcannonuser
description: Manages a player's interaction with a boat cannon, including the aiming state and associated visual effects.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
---

# Boatcannonuser

## Overview
The `boatcannonuser` component is attached to player entities and manages their ability to aim and use a boat cannon. It handles both server-side state management (which cannon is being used) and client-side visual feedback (such as the aiming reticule and range indicator). This component works in tandem with the `boatcannon` component on the cannon entity itself.

## Dependencies & Tags
None identified. This component interacts with an entity's `stategraph` and expects cannon entities to have `boatcannon` and `reticule` components, but it does not add any components or tags to its own entity.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | entity | `inst` | The entity instance this component is attached to. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | A cached boolean indicating if the code is running on the master simulation (server). |
| `aim_range_fx` | entity | `nil` | **Client-only.** A reference to the spawned `cannon_aoe_range_fx` prefab used for aiming visuals. |
| `aiming_cannon` | entity | `nil` | **Client-only.** A reference to the cannon entity the player is currently aiming. |
| `task` | task | `nil` | **Client-only.** A handle for a delayed task, used to correctly initialize the aiming visuals. |
| `cannon_remove_callback` | function | `function` | **Server-only.** A callback function to handle the removal of the cannon being used, ensuring the player stops aiming. |
| `classified`| classified | `nil` | The network-replicated object that holds shared data, primarily the reference to the current cannon. |

## Main Functions
### `GetCannon()`
* **Description:** Returns the cannon entity that the player is currently using.
* **Parameters:** None.

### `GetAimPos()`
* **Description:** Returns the world position the cannon is currently aimed at. This is retrieved from the cannon's `reticule` component.
* **Parameters:** None.

### `GetReticule()`
* **Description:** Returns the `reticule` component from the cannon entity the player is currently aiming.
* **Parameters:** None.

### `OnCannonChanged(cannon)`
* **Description:** **Client-only.** This function is the primary handler for updating the client's visual state when the player starts or stops aiming a cannon. It spawns or destroys the aiming range effect and the cannon's reticule.
* **Parameters:**
    * `cannon` (entity): The cannon entity that is now being aimed. Can be `nil` if the player stops aiming.

### `SetClassified(classified)`
* **Description:** **Server-only.** Assigns the player's network-replicated `classified` object to this component.
* **Parameters:**
    * `classified` (classified): The classified object instance.

### `SetCannon(cannon)`
* **Description:** **Server-only.** Sets the cannon that the player will begin aiming. This function updates the networked `classified` variable, tells the `boatcannon` component on the cannon to enter its aiming state, and sets up listeners to handle the cannon being removed from the world. It also calculates and sets the cannon's initial rotation based on the player's position.
* **Parameters:**
    * `cannon` (entity): The cannon entity to start aiming, or `nil` to stop.

### `CancelAimingStateInternal()`
* **Description:** **Server-only.** Forces the player's stategraph to exit the cannon aiming state by transitioning to `aim_cannon_pst`. This is used to gracefully stop the aiming action.
* **Parameters:** None.

## Events & Listeners
* **`inst:ListenForEvent("aimingcannonchanged", ...)`**
  * **Side:** Client
  * **Description:** Listens for the networked `cannon` variable to change. When it does, it calls `OnCannonChanged` to update the aiming visuals for the local player.
* **`inst:ListenForEvent("onremove", ...)`**
  * **Side:** Client & Server
  * **Description:** This component sets up two different listeners for the `"onremove"` event:
    * **Client:** Listens for the removal of the `classified` object to ensure a clean detachment.
    * **Server:** Listens for the removal of the cannon entity itself, triggering `cannon_remove_callback` to stop the aiming process.