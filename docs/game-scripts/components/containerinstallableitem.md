---
id: containerinstallableitem
title: Containerinstallableitem
description: This component manages items that can be installed into specific containers, handling entry and exit logic and custom callbacks.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: fc1a1aa9
---

# Containerinstallableitem

## Overview
This component allows an entity to be "installed" into specific containers or inventory slots. It provides a framework for defining custom validation logic for target containers and custom callback functions that execute when the item is installed into or uninstalled from a container. It also handles various scenarios where an item enters or leaves a container, such as being placed in inventory, dropped, or swapped.

## Dependencies & Tags
This component implicitly relies on the `inventoryitem` component to determine if an item is held by an owner.
No specific tags are added or removed by this component.

## Properties
| Property                 | Type      | Default Value | Description                                                                                             |
| :----------------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`                   | `Entity`  | `self`        | A reference to the entity this component is attached to.                                                |
| `ismastersim`            | `boolean` | `true`        | Indicates if the component is running on the master simulation.                                         |
| `validcontainerfn`       | `function`| `nil`         | An optional callback function `(inst, containerinst)` used to determine if a container is valid for installation. |
| `oninstalledfn`          | `function`| `nil`         | An optional callback function `(inst, target)` to execute when the item is installed into a target.      |
| `onuninstalledfn`        | `function`| `nil`         | An optional callback function `(inst, target)` to execute when the item is uninstalled from a target.    |
| `_owner`                 | `Entity`  | `nil`         | The entity that currently "owns" or contains this item (e.g., a container or inventory).                |
| `usedeferreduninstall`   | `boolean` | `nil`         | If `true`, the `exitlimbo` event handler is disabled, deferring uninstall logic.                        |
| `ignoreuninstall`        | `boolean` | `nil`         | If `true`, temporarily disables the uninstall logic from triggering.                                    |

## Main Functions
### `SetValidContainerFn(fn)`
* **Description:** Sets a custom function to validate if a given container is suitable for this item.
* **Parameters:**
    * `fn`: A function `(inst, containerinst)` that should return `true` if `containerinst` is a valid container for `inst`, or `false` otherwise. If `nil`, any container is considered valid.

### `IsValidContainer(containerinst)`
* **Description:** Checks if a given container entity is considered valid for this item, either by the custom `validcontainerfn` or by default if no custom function is set.
* **Parameters:**
    * `containerinst`: The container entity to validate.

### `GetValidOpenContainer(doer)`
* **Description:** Searches for an open container within the `doer`'s inventory that is also a valid container for this item according to `IsValidContainer`.
* **Parameters:**
    * `doer`: The entity whose inventory should be checked for open containers.

### `SetInstalledFn(fn)`
* **Description:** Sets the callback function to be invoked when this item is installed into a container.
* **Parameters:**
    * `fn`: A function `(inst, target)` to call when the item is installed. `inst` is the item itself, `target` is the container it's installed into.

### `SetUninstalledFn(fn)`
* **Description:** Sets the callback function to be invoked when this item is uninstalled from a container.
* **Parameters:**
    * `fn`: A function `(inst, target)` to call when the item is uninstalled. `inst` is the item itself, `target` is the container it was uninstalled from.

### `SetUseDeferredUninstall(enable)`
* **Description:** Controls whether the `exitlimbo` event listener is enabled. Enabling this defers uninstall logic, which can be useful when swapping items.
* **Parameters:**
    * `enable`: A boolean. If `true`, the `exitlimbo` listener is removed. If `false`, it is added back.

### `OnInstalled(target)`
* **Description:** Triggers the installation logic, calling the `oninstalledfn` if set, and pushing the `containerinstalleditem` event.
* **Parameters:**
    * `target`: The entity (container) that this item is being installed into.

### `OnUninstalled(target)`
* **Description:** Triggers the uninstallation logic, calling the `onuninstalledfn` if set, and pushing the `containeruninstalleditem` event.
* **Parameters:**
    * `target`: The entity (container) that this item is being uninstalled from.

## Events & Listeners
*   **Listens for:**
    *   `"onputininventory"`: Triggered when the item is placed into any inventory slot. Calls `topocket` to handle installation logic.
    *   `"ondropped"`: Triggered when the item is dropped to the ground. Calls `toground` to handle uninstallation logic.
    *   `"exitlimbo"`: Triggered when an item is removed from an inventory slot but not necessarily dropped (e.g., during a swap). Calls `onexitlimbo` to handle uninstallation logic, unless deferred uninstall is enabled.
*   **Pushes:**
    *   `"containerinstalleditem"`: Pushed to the `target` entity when `OnInstalled` is called, with `self.inst` as the event data.
    *   `"containeruninstalleditem"`: Pushed to the `target` entity when `OnUninstalled` is called, with `self.inst` as the event data.