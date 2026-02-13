---
id: aoecharging
title: Aoecharging
description: Handles charging logic, UI feedback, and release behavior for charged area-of-effect attacks.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# aoecharging

## Overview
This component manages the logic and visual feedback for items that support a "charged" area-of-effect (AOE) attack in Don't Starve Together. It tracks the charging progress, synchronizes charging state between server and client, displays a reticule for aiming, and handles the release of the charged attack based on player input.

## Dependencies & Tags
*   **Dependencies:**
    *   The entity using this component is expected to have a `replica` containing `inventoryitem` and `equippable` components for ownership and equipping checks (e.g., `inst.replica.inventoryitem`, `inst.replica.equippable`).
    *   The `owner` entity (typically a player) is expected to have a `sg` (StateGraph) component, a `HUD` table, and potentially a `playercontroller` component (e.g., `owner.sg`, `owner.HUD`, `owner.components.playercontroller`).
    *   The component implicitly relies on the game's component update system, allowing it to register for and receive `OnUpdate` calls when `StartUpdatingComponent` is called.
*   **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | (set in constructor) | A reference to the entity that owns this component. |
| `ismastersim` | `boolean` | (set in constructor) | `true` if this component instance is running on the master simulation (server), `false` otherwise (client). |
| `reticuleprefab` | `string` | `nil` | The prefab name for the reticule entity that is spawned when charging. This should be set by the item using the component. |
| `pingprefab` | `string` | `nil` | The prefab name for the "ping" effect spawned when a charged attack is released. |
| `reticule` | `Entity` | `nil` | A reference to the currently active reticule entity. |
| `owner` | `Entity` | `nil` | The entity (e.g., player) that is currently charging the AOE attack. |
| `allowriding` | `boolean` | `true` | Determines if charging is allowed while riding a mount. |
| `enabled` | `net_bool` | `true` | A network-synchronized boolean indicating if the AOE charging component is currently enabled. |
| `ischarging` | `net_bool` | `false` | A network-synchronized boolean indicating if the item is currently being charged. |
| `chargeticks` | `net_byte` | `0` | A network-synchronized byte value representing the number of "ticks" or duration of the charge. |
| `syncdelay` | `number` | `0` | (Master sim only) A counter used to manage the frequency of `chargeticks` network synchronization, reducing network traffic. |
| `refreshchargeticksfn` | `function` | `nil` | A callback function to be executed when the charge ticks need to be visually refreshed on the reticule. Set via `SetRefreshChargeTicksFn`. |
| `onchargedattackfn` | `function` | `nil` | (Master sim only) A callback function to be executed when a charged attack is released. Set via `SetOnChargedAttackFn`. |

## Main Functions
### `AOECharging:OnRemoveEntity()`
*   **Description:** Called automatically when the component's parent entity is being removed from the world. It ensures that any active charging state is properly cleared by calling `SetChargingOwner(nil)`.
*   **Parameters:** None.

### `AOECharging:SetAllowRiding(val)`
*   **Description:** Sets whether the AOE charging mechanic is allowed to be active while the `owner` is riding a mount.
*   **Parameters:**
    *   `val`: (`boolean`) If `false`, charging will not be possible while riding. Any other truthy value will allow charging while riding.

### `AOECharging:SetRefreshChargeTicksFn(fn)`
*   **Description:** Registers a custom callback function that will be invoked whenever the visual representation of the charge ticks needs to be updated, typically on the reticule entity.
*   **Parameters:**
    *   `fn`: (`function`) The callback function. It is expected to accept three arguments: `inst` (the item entity), `reticule` (the reticule entity), and `chargeticks` (the current charge value).

### `AOECharging:OnRefreshChargeTicks(reticule)`
*   **Description:** Executes the `refreshchargeticksfn` callback, if one has been registered, passing the provided `reticule` and the current `chargeticks` value.
*   **Parameters:**
    *   `reticule`: (`Entity`) The reticule entity that needs its visual charge state refreshed.

### `AOECharging:SetChargingOwner(owner)`
*   **Description:** This is a core function that manages the lifecycle of the charging process. It is responsible for:
    *   Destroying the reticule if it exists when stopping charging.
    *   Stopping the component's update loop (`OnUpdate`) if no owner is provided.
    *   Resetting network variables (`ischarging`, `chargeticks`) on the master sim when stopping charging.
    *   Spawning the `reticuleprefab` and linking it to the new `owner`'s HUD if an owner is provided and `reticuleprefab` is set.
    *   Starting the component's update loop (`OnUpdate`) if an owner is provided.
    *   Initializing network variables (`ischarging`, `chargeticks`) on the master sim when starting charging.
    *   Triggering a `OnRefreshChargeTicks` call for the newly spawned reticule.
*   **Parameters:**
    *   `owner`: (`Entity` or `nil`) The entity (typically a player) that will initiate or stop the charging process. Passing `nil` stops charging.

### `AOECharging:OnUpdate(dt)`
*   **Description:** The primary update loop for the component. This function is called every frame when the component is actively updating (i.e., when an `owner` is set). It performs the following tasks:
    *   **Validation:** Continuously checks if the item is still owned and equipped by the `owner`, and if the `owner` is in a state allowing AOE charging. If any condition fails, charging is cancelled via `SetChargingOwner(nil)`.
    *   **Charge Ticks Update:** Increments `chargeticks`. On the master sim, it uses `syncdelay` to control how often the `chargeticks` value is fully synchronized over the network, otherwise it's updated locally. On clients, `chargeticks` is updated locally.
    *   **Reticule Refresh:** Calls `OnRefreshChargeTicks` to update the reticule's visual state.
    *   **Input Handling & Release:** Monitors for player input (CONTROL_SECONDARY or CONTROL_CONTROLLER_ALTACTION) being released. If released:
        *   The reticule is instructed to "snap" to its final position.
        *   A "ping" visual effect (`pingprefab`) is spawned at the reticule's location.
        *   The charging `owner` is cleared via `SetChargingOwner(nil)`.
        *   The `owner`'s state graph receives a `"chargingreticulereleased"` event, including the final `chargeticks` value.
    *   **Rotation Update:** If charging is still active, it continuously calls `UpdateRotation` to align the owner's facing with the reticule.
*   **Parameters:**
    *   `dt`: (`number`) The delta time (time elapsed) since the last update.

### `AOECharging:UpdateRotation()`
*   **Description:** Aligns the `owner`'s `Transform` rotation with that of the `reticule`. On client simulations, it also sends a remote command via the `owner`'s `playercontroller` component to synchronize the AOE charging direction across the network.
*   **Parameters:** None.

### `AOECharging:SetEnabled(enabled)`
*   **Description:** (Master Sim Only) Controls the overall enabled state of the AOE charging component. When set to `false`, any ongoing charging will be cancelled.
*   **Parameters:**
    *   `enabled`: (`boolean`) `true` to enable the component, `false` to disable it.

### `AOECharging:SetChargeTicks(ticks)`
*   **Description:** (Master Sim Only) Allows directly setting the current number of charge ticks. This can be used to modify the starting charge or accelerate the charging process for the `owner`. If an `owner` is currently charging, the reticule's visual state will be refreshed.
*   **Parameters:**
    *   `ticks`: (`number`) The desired number of charge ticks.

### `AOECharging:SetOnChargedAttackFn(fn)`
*   **Description:** (Master Sim Only) Registers a custom callback function that will be executed when a charged attack is released. This function defines the actual effect or logic of the charged attack.
*   **Parameters:**
    *   `fn`: (`function`) The callback function. It is expected to accept three arguments: `inst` (the item entity), `doer` (the entity performing the attack), and `chargeticks` (the final charge value).

### `AOECharging:ReleaseChargedAttack(doer, chargeticks)`
*   **Description:** (Master Sim Only) This function is called when a charged attack is finalized. It triggers the `onchargedattackfn` callback, if one has been registered, passing the attacking `doer` and the accumulated `chargeticks`. This is the entry point for custom charged attack behavior.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity (e.g., player) that performed the charged attack.
    *   `chargeticks`: (`number`) The total number of ticks the attack was charged for.

## Events & Listeners
*   `inst:ListenForEvent("enableddirty", OnEnabledDirty)`: Listens on the client for changes to the `self.enabled` network variable. When `enabled` becomes `false`, it triggers a cancellation of charging.
*   `inst:ListenForEvent("ischargingdirty", OnIsCharging)`: Listens on the client for changes to the `self.ischarging` network variable. If `ischarging` is `true` for `ThePlayer` and the item is equipped, it manages the `chargingowner`.
*   `inst:ListenForEvent("chargeticksdirty", OnChargeTicksDirty)`: Listens on the client for changes to the `self.chargeticks` network variable. If `ThePlayer` owns the item and it's equipped, it refreshes the reticule's display.