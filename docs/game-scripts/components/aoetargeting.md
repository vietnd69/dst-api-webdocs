---
id: aoetargeting
title: Aoetargeting
description: Manages visual targeting reticules, validation, and FX for area-of-effect abilities or items.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: acb57aeb
---

# aoetargeting

## Overview
The `aoetargeting` component is designed to manage the visual targeting reticule and associated feedback for Area of Effect (AOE) abilities or items. It provides functionalities to enable and disable a visual reticule, configure its appearance and behavior, set targeting range and validity conditions, and spawn visual effects at the target location. This component typically works in conjunction with a player's `playercontroller` to display and interact with the targeting system.

## Dependencies & Tags
This component manages the lifecycle of another component and interacts with several others:
*   **`reticule` component**: The `aoetargeting` component dynamically adds the `reticule` component to its `inst` when targeting starts and removes it when targeting stops. It configures the `reticule` component's properties.
*   **`playercontroller` component**: It interacts with `ThePlayer.components.playercontroller` to refresh the player's reticule display.
*   **`inventoryitem` replica**: It checks `self.inst.replica.inventoryitem` to determine if the `inst` is owned by the player, ensuring the reticule is displayed only for items the player controls.

No specific tags are added or removed by this component.

## Properties
| Property            | Type             | Default Value                                | Description                                                                                              |
| :------------------ | :--------------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `inst`              | `Entity`         | (Set at instantiation)                       | The entity this component is attached to.                                                                |
| `reticule.ease`     | `boolean`        | `false`                                      | Determines if the reticule's movement should be eased.                                                   |
| `reticule.smoothing`| `number`         | `6.66`                                       | Controls the smoothing factor for reticule movement.                                                     |
| `reticule.targetfn` | `function`       | `nil`                                        | An optional function used by the reticule to determine its target position.                              |
| `reticule.reticuleprefab` | `string`   | `"reticule"`                                 | The prefab name for the reticule entity itself.                                                          |
| `reticule.validcolour`| `table` (RGBA) | `{ 204 / 255, 131 / 255, 57 / 255, 1 }`      | The color of the reticule when the target location is valid.                                             |
| `reticule.invalidcolour`| `table` (RGBA) | `{ 1, 0, 0, 1 }`                             | The color of the reticule when the target location is invalid.                                           |
| `reticule.mouseenabled`| `boolean`     | `false`                                      | Determines if the reticule should respond to mouse input.                                                |
| `reticule.twinstickmode`| `boolean`/`nil`| `nil`                                       | Specifies if the reticule should operate in twin-stick control mode.                                     |
| `reticule.twinstickrange`| `number`/`nil`| `nil`                                       | The range for twin-stick control mode.                                                                   |
| `reticule.pingprefab` | `string`/`nil` | `nil`                                        | A prefab to be spawned as a "ping" effect.                                                               |
| `targetprefab`      | `string`         | `nil`                                        | The prefab to spawn as a visual effect at the final target location.                                     |
| `alwaysvalid`       | `boolean`        | `false`                                      | If `true`, bypasses all target validation checks, always considering the target location valid.          |
| `allowwater`        | `boolean`        | `false`                                      | If `true`, permits targeting locations on water.                                                         |
| `allowriding`       | `boolean`        | `true`                                       | If `true`, allows the player to target while riding a mount.                                             |
| `deployradius`      | `number`         | `0`                                          | A radius related to deployment, potentially for visual or functional purposes.                           |
| `range`             | `number`         | `8`                                          | The maximum range from the player within which targeting is allowed.                                     |
| `shouldrepeatcastfn`| `function`       | `nil`                                        | An optional custom function that determines if an ability associated with this targeting should repeat cast. |
| `enabled`           | `net_bool`       | `true`                                       | A network-synchronized boolean indicating whether the AOE targeting system is currently active.          |

## Main Functions

### `AOETargeting:IsEnabled()`
*   **Description:** Checks if the AOE targeting component is currently enabled.
*   **Parameters:** None.

### `AOETargeting:SetEnabled(enabled)`
*   **Description:** Sets the enabled state of the AOE targeting component. This will trigger the `OnEnabledDirty` logic on the server and propagate the change to clients. If disabled, it will stop targeting.
*   **Parameters:**
    *   `enabled` (`boolean`): The new enabled state (`true` to enable, `false` to disable).

### `AOETargeting:SetTargetFX(prefab)`
*   **Description:** Sets the prefab to be spawned as a visual effect at the targeted location.
*   **Parameters:**
    *   `prefab` (`string`): The name of the prefab to use for the target visual effect.

### `AOETargeting:SetAlwaysValid(val)`
*   **Description:** Configures whether the targeting system should always consider any target location valid, bypassing normal validation checks.
*   **Parameters:**
    *   `val` (`boolean`): Set to `true` to make all targets valid, `false` otherwise.

### `AOETargeting:SetAllowWater(val)`
*   **Description:** Configures whether targeting is permitted on water tiles.
*   **Parameters:**
    *   `val` (`boolean`): Set to `true` to allow targeting on water, `false` otherwise.

### `AOETargeting:SetAllowRiding(val)`
*   **Description:** Configures whether targeting is permitted while the player is riding a mount.
*   **Parameters:**
    *   `val` (`boolean`): Set to `true` to allow targeting while riding, `false` otherwise.

### `AOETargeting:SetRange(range)`
*   **Description:** Sets the maximum range within which a target location can be selected.
*   **Parameters:**
    *   `range` (`number`): The maximum targeting range.

### `AOETargeting:GetRange()`
*   **Description:** Returns the currently configured maximum targeting range.
*   **Parameters:** None.

### `AOETargeting:SetDeployRadius(radius)`
*   **Description:** Sets a radius value, typically used for visual representation or functional logic related to deployment.
*   **Parameters:**
    *   `radius` (`number`): The deployment radius.

### `AOETargeting:SetShouldRepeatCastFn(fn)`
*   **Description:** Sets a custom function that will be called to determine if an associated ability or action should repeat its cast.
*   **Parameters:**
    *   `fn` (`function`): A function that takes `inst` (the entity with this component) and `doer` (the entity performing the action) as arguments and returns `true` if the cast should repeat, `false` otherwise.

### `AOETargeting:CanRepeatCast()`
*   **Description:** Checks if a `shouldrepeatcastfn` has been assigned to this component.
*   **Parameters:** None.

### `AOETargeting:ShouldRepeatCast(doer)`
*   **Description:** Calls the custom `shouldrepeatcastfn` if it exists, passing the component's `inst` and the `doer` as arguments.
*   **Parameters:**
    *   `doer` (`Entity`): The entity performing the action that might repeat cast.

### `AOETargeting:StartTargeting()`
*   **Description:** Initializes the targeting process. If not already present, it adds the `reticule` component to the `inst`, copies its internal `self.reticule` properties to the newly added component, and instructs the player controller to refresh the reticule display. This is typically called when an item or ability starts its targeting phase.
*   **Parameters:** None.

### `AOETargeting:StopTargeting()`
*   **Description:** Ends the targeting process. If a `reticule` component is present on the `inst`, it removes it and then instructs the player controller to refresh its reticule display (effectively hiding the old one). This is typically called when an item or ability finishes or cancels its targeting phase.
*   **Parameters:** None.

### `AOETargeting:SpawnTargetFXAt(pos)`
*   **Description:** Spawns the `targetprefab` at a specified position. It handles cases where the position might be a `DynamicPosition` or associated with a platform, ensuring the FX is correctly parented and positioned.
*   **Parameters:**
    *   `pos` (`Vector3` or `DynamicPosition`): The world position where the target effect should be spawned.
*   **Returns:** The spawned `fx` entity if successful, otherwise `nil`.

## Events & Listeners
*   **Listens For:**
    *   `"enableddirty"`: This event is triggered internally by the `net_bool` `self.enabled` when its value changes, but only on client machines (`if not TheWorld.ismastersim`). When received, it calls `OnEnabledDirty`, which stops targeting if the component is disabled and refreshes the player's reticule if the `inst` is owned by `ThePlayer`.