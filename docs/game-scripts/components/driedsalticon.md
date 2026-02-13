---
id: driedsalticon
title: Driedsalticon
description: This component manages the display of a "dried salt" overlay icon on an entity's inventory image, synchronizing its state across the network.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
---

# Driedsalticon

## Overview
The `Driedsalticon` component is responsible for visually indicating whether an item, typically salt, is in a "dried" state by displaying a specific overlay icon on its inventory image. It synchronizes this visual state across the network using a `net_bool` and allows for custom callback functions to override its default icon display behavior. On the server, it can explicitly set the inventory item's image name, while on the client, it triggers an `imagechange` event.

## Dependencies & Tags
This component relies on the `inventoryitem` component to manage the visual representation of the item within the inventory.
None identified.

## Properties
| Property       | Type     | Default Value | Description                                                                                                                                                                                                                 |
| :------------- | :------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`         | `table`  | `self`        | A reference to the entity this component is attached to.                                                                                                                                                                    |
| `ismastersim`  | `boolean`| `TheWorld.ismastersim` | Indicates whether the component instance is running on the master simulation (server).                                                                                                                                      |
| `showiconfn`   | `function` or `nil` | `nil`         | An optional callback function to be executed when the dried salt icon is shown, overriding the default visual update logic. Set via `OverrideShowIconFn`.                                                                |
| `hideiconfn`   | `function` or `nil` | `nil`         | An optional callback function to be executed when the dried salt icon is hidden, overriding the default visual update logic. Set via `OverrideHideIconFn`.                                                                |
| `showicon`     | `net_bool` | `false`       | A networked boolean that determines whether the dried salt icon should be displayed. Changes to this value trigger the `showicondirty` event on the client.                                                                    |
| `collects`     | `boolean`| `false`       | (Master sim only) An internal flag whose purpose is not directly evident from this script but is exposed for potential use by other systems. Its value is `false` by default on the master simulation. |

## Main Functions
### `OnShowIconDirty(inst)`
*   **Description:** This local function is the core logic for updating the visual state of the dried salt icon. It is triggered when the `showicon` network boolean changes or is explicitly called to force an update. It either calls a registered override function (`showiconfn` or `hideiconfn`) or applies/removes the default `salt_dried_overlay` image directly to the inventory item's background.
*   **Parameters:**
    *   `inst`: The entity instance to which this component is attached.

### `OverrideShowIconFn(fn)`
*   **Description:** Allows overriding the default behavior when the dried salt icon is to be shown. If a function is provided, it will be called instead of the component's default icon display logic.
*   **Parameters:**
    *   `fn`: A function to be called when the icon is shown. It will receive the entity instance as its argument.

### `OverrideHideIconFn(fn)`
*   **Description:** Allows overriding the default behavior when the dried salt icon is to be hidden. If a function is provided, it will be called instead of the component's default icon removal logic.
*   **Parameters:**
    *   `fn`: A function to be called when the icon is hidden. It will receive the entity instance as its argument.

### `SetCollectsOnDried(collects)`
*   **Description:** Sets an internal `collects` flag on the master simulation. The direct effect of this flag is not implemented within this component, suggesting it is an informational flag for other systems. This function only operates on the master simulation.
*   **Parameters:**
    *   `collects`: A boolean value to set for the `self.collects` property.

### `ShowSaltIcon()`
*   **Description:** On the master simulation, this function sets the `showicon` networked boolean to `true`, if it isn't already. This change will propagate to clients and trigger the visual update, immediately calling `OnShowIconDirty` locally as well.
*   **Parameters:** None.

### `HideSaltIcon()`
*   **Description:** On the master simulation, this function sets the `showicon` networked boolean to `false`, if it isn't already. This change will propagate to clients and trigger the visual update, immediately calling `OnShowIconDirty` locally as well.
*   **Parameters:** None.

## Events & Listeners
*   **Listens for:**
    *   `"showicondirty"`: Listened to on the client simulation. This event is triggered by the `net_bool` property `showicon` whenever its value changes, causing `OnShowIconDirty` to be called.
*   **Pushes/Triggers:**
    *   `"imagechange"`: Pushed on the client simulation when the `inv_image_bg` is modified, signaling other components that the item's visual representation might have changed.