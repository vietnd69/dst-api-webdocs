---
id: containerinstallableitem
title: Containerinstallableitem
description: Manages installation and uninstallation behavior for items that can be placed into containers or wielded by entities.
tags: [inventory, container, installable]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fc1a1aa9
system_scope: inventory
---

# Containerinstallableitem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ContainerInstallableItem` manages the lifecycle of items that may be installed into containers or held by entities, such as parts or tools. It tracks ownership via `self._owner`, triggers installation/uninstallation callbacks, and listens to inventory-related events (`onputininventory`, `ondropped`, `exitlimbo`) to coordinate state transitions. It integrates with the `inventoryitem` component to verify whether an item is held by its owner.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("containerinstallableitem")

-- Define which containers can hold this item
inst.components.containerinstallableitem:SetValidContainerFn(function(item, container)
    return container:HasTag("workbench")
end)

-- Optionally define custom callbacks for install/uninstall
inst.components.containerinstallableitem:SetInstalledFn(function(item, target)
    print(item .. " installed in " .. target)
end)
inst.components.containerinstallableitem:SetUninstalledFn(function(item, target)
    print(item .. " uninstalled from " .. target)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem` (via `inst.components.inventoryitem:IsHeldBy(...)`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance owning this component. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Indicates whether this is the master simulation instance. |
| `validcontainerfn` | function or nil | `nil` | Custom predicate function used by `IsValidContainer`. |
| `_owner` | `Entity` or nil | `nil` | The entity currently holding or installing this item. |
| `oninstalledfn` | function or nil | `nil` | Optional custom callback for installation. |
| `onuninstalledfn` | function or nil | `nil` | Optional custom callback for uninstallation. |
| `usedeferreduninstall` | boolean or nil | `nil` | Controls whether uninstallation is deferred (typically used for item swapping). |
| `ignoreuninstall` | boolean or nil | `nil` | If true, skips uninstallation events (e.g., during certain drops). |

## Main functions
### `SetValidContainerFn(fn)`
* **Description:** Sets a custom function to determine whether a given container is valid for installation.
* **Parameters:** `fn` (function) — a function `(item: Entity, container: Entity) => boolean`.
* **Returns:** Nothing.

### `IsValidContainer(containerinst)`
* **Description:** Returns true if `containerinst` satisfies the installed valid-container predicate.
* **Parameters:** `containerinst` (`Entity`) — candidate container entity.
* **Returns:** `boolean`.

### `GetValidOpenContainer(doer)`
* **Description:** Finds the first open container on `doer` that this item can be installed into, excluding read-only containers.
* **Parameters:** `doer` (`Entity`) — the entity whose containers are scanned.
* **Returns:** `Entity` or `nil` — the first valid open container, or `nil` if none found.

### `SetInstalledFn(fn)`
* **Description:** Registers a server-side callback executed when the item is installed.
* **Parameters:** `fn` (function) — `(item: Entity, target: Entity) => nil`.
* **Returns:** Nothing.

### `SetUninstalledFn(fn)`
* **Description:** Registers a server-side callback executed when the item is uninstalled.
* **Parameters:** `fn` (function) — `(item: Entity, target: Entity) => nil`.
* **Returns:** Nothing.

### `SetUseDeferredUninstall(enable)`
* **Description:** Enables or disables deferred uninstallation, altering event handling during item swaps.
* **Parameters:** `enable` (boolean) — if true, registers for deferred uninstall logic; if false, restores immediate `exitlimbo` handling.
* **Returns:** Nothing.

### `OnInstalled(target)`
* **Description:** Performs installation logic: invokes the installed callback (if set) and pushes `containerinstalleditem` event on the target.
* **Parameters:** `target` (`Entity`) — the entity into which this item was installed.
* **Returns:** Nothing.

### `OnUninstalled(target)`
* **Description:** Performs uninstallation logic: invokes the uninstalled callback (if set) and pushes `containeruninstalleditem` event on the target.
* **Parameters:** `target` (`Entity`) — the entity from which this item was uninstalled.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onputininventory`, `ondropped`, `exitlimbo — triggers internal owner management and uninstall/install transitions.
- **Pushes:** `containerinstalleditem`, `containeruninstalleditem — fired on the target entity during `OnInstalled`/`OnUninstalled`.
