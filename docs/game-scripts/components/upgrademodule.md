---
id: upgrademodule
title: Upgrademodule
description: Manages the activation state and lifecycle callbacks for a modular upgrade attached to an entity.
tags: [upgrade, gameplay, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8ecfc643
system_scope: entity
---

# Upgrademodule

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UpgradeModule` is a lightweight component that encapsulates the state and callbacks for a single upgrade slot. It tracks whether the upgrade is activated (`self.activated`), stores the number of required upgrade slots (`self.slots`), and allows external components to register optional callback functions for activation, deactivation, and removal events. It is designed to be used by the `upgrademoduleowner` component and should not be manipulated directly by other systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrademodule")

-- Configure the module
inst.components.upgrademodule:SetRequiredSlots(2)

-- Register callbacks
inst.components.upgrademodule.onactivatedfn = function(module_inst, target, isloading)
    print("Upgrade activated!")
end

inst.components.upgrademodule.ondeactivatedfn = function(module_inst, target)
    print("Upgrade deactivated!")
end

-- Activate the upgrade (typically invoked by upgrademoduleowner)
inst.components.upgrademodule:TryActivate(false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slots` | number | `1` | Number of upgrade slots this module occupies. |
| `activated` | boolean | `false` | Whether the module is currently activated. |
| `target` | entity or `nil` | `nil` | Optional reference to a target entity (e.g., the entity being upgraded). |
| `onactivatedfn` | function or `nil` | `nil` | Callback invoked when `TryActivate` is called successfully. |
| `ondeactivatedfn` | function or `nil` | `nil` | Callback invoked when `TryDeactivate` is called successfully. |
| `onremovedfromownerfn` | function or `nil` | `nil` | Callback invoked when `RemoveFromOwner` is called. |

## Main functions
### `SetRequiredSlots(slots)`
* **Description:** Sets the number of upgrade slots required by this module.
* **Parameters:** `slots` (number) — the required number of slots.
* **Returns:** Nothing.

### `SetTarget(target)`
* **Description:** Assigns an optional target entity for this upgrade module (e.g., a character, item, or structure being upgraded).
* **Parameters:** `target` (entity or `nil`) — the entity to associate with this module.
* **Returns:** Nothing.

### `TryActivate(isloading)`
* **Description:** Attempts to activate the module. Only has effect if the module is not already activated. Triggers the `onactivatedfn` callback if set. Intended to be called only by the `upgrademoduleowner` component.
* **Parameters:** `isloading` (boolean) — indicates whether activation occurs during world/entity loading.
* **Returns:** Nothing.

### `TryDeactivate()`
* **Description:** Attempts to deactivate the module. Only has effect if the module is currently activated. Triggers the `ondeactivatedfn` callback if set. Intended to be called only by the `upgrademoduleowner` component.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemoveFromOwner()`
* **Description:** Clears the target reference and invokes the `onremovedfromownerfn` callback if set. Typically called when the module is being removed from its owning entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
