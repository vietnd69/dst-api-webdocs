---
id: boatcannon
title: Boatcannon
description: Manages the state and actions of a boat-mounted cannon, including aiming, loading, and firing.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: e9719b61
---

# Boatcannon

## Overview
The `Boatcannon` component governs the functionality of cannons that can be mounted on boats. It manages the cannon's state, such as whether it is loaded with ammunition or being operated by a player. Its primary responsibilities include handling the loading of ammo, processing the aiming state when a player interacts with it, and executing the firing sequence, which spawns a projectile and applies a recoil force to the parent boat.

## Dependencies & Tags
**Dependencies:**
*   Uses `boatphysics` component on the parent boat entity to apply recoil.
*   The spawned projectile requires a `complexprojectile` component.

**Tags:**
*   `ammoloaded`: Added to the entity when ammunition is loaded. Removed when fired or unloaded.
*   `occupied`: Added to the entity when a player starts aiming. Removed when they stop.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `loadedammo` | `string` or `nil` | `nil` | The prefab name of the ammunition currently loaded in the cannon. |
| `operator` | `Entity` or `nil` | `nil` | The entity instance (player) currently operating the cannon. |
| `onstartfn` | `function` or `nil` | `nil` | An optional callback function to execute when a player starts aiming. |
| `onstopfn` | `function` or `nil` | `nil` | An optional callback function to execute when a player stops aiming. |

## Main Functions

### `SetOnStartAimingFn(fn)`
*   **Description:** Sets a callback function to be executed when an operator begins aiming the cannon.
*   **Parameters:**
    *   `fn`: The function to call. It will receive the cannon instance and the operator instance as arguments.

### `SetOnStopAimingFn(fn)`
*   **Description:** Sets a callback function to be executed when an operator stops aiming the cannon.
*   **Parameters:**
    *   `fn`: The function to call. It will receive the cannon instance and the operator instance as arguments.

### `StartAiming(operator)`
*   **Description:** Initiates the aiming state for the cannon. It sets the current operator, adds the `occupied` tag, and triggers the `onstartfn` callback if it exists.
*   **Parameters:**
    *   `operator`: The entity instance that is now using the cannon.

### `StopAiming()`
*   **Description:** Ends the aiming state. It clears the current operator, removes the `occupied` tag, and triggers the `onstopfn` callback if it exists.

### `IsAmmoLoaded()`
*   **Description:** Checks if the cannon currently has ammunition loaded.
*   **Returns:** `boolean` - `true` if `loadedammo` is not nil, `false` otherwise.

### `LoadAmmo(projectileprefab)`
*   **Description:** Loads the cannon with a specified type of ammunition. It updates the `loadedammo` property and pushes an event to signal the state change.
*   **Parameters:**
    *   `projectileprefab`: A `string` representing the prefab name of the ammunition to load. Pass `nil` to unload.

### `Shoot()`
*   **Description:** Fires the loaded projectile. This function spawns the projectile prefab, configures its trajectory and shooter, applies a recoil force to the boat the cannon is on, and unloads the cannon. It does nothing if no ammo is loaded.

### `OnSave()`
*   **Description:** Serializes the component's state for game saving. It saves the `loadedammo` prefab if one is loaded.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state when loading a game. It restores the loaded ammunition based on the save data.

## Events & Listeners

*   **Listens for `onremove` on the `operator` entity:** When the operator entity is removed from the world (e.g., player disconnects or dies), the `StopAiming()` function is called to cleanly exit the aiming state.
*   **Pushes `ammoloaded`:** Triggered on the cannon entity when `LoadAmmo` is called with a valid projectile prefab.
*   **Pushes `ammounloaded`:** Triggered on the cannon entity when `LoadAmmo` is called with `nil` or after `Shoot` is called.