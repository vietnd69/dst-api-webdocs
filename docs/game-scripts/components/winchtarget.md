---
id: winchtarget
title: Winchtarget
description: This component marks an entity as a target for winching operations and manages salvageable submerged objects.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0b1bcec5
---

# Winchtarget

## Overview
This component designates an entity as a winchable target in the game world—primarily used for submerged salvage operations. It adds the `"winchtarget"` tag to the entity, stores optional salvage logic via a callback function, and provides utilities to retrieve and release the contained sunken object (typically from the inventory's first slot).

## Dependencies & Tags
- **Component Tags Added:** `"winchtarget"`
- **Component Dependencies:** Relies on `self.inst.components.inventory` to access the contained item (if present); no explicit components are added.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `depth` | `number` | `-1` | Depth override: `-1` indicates the actual ocean depth at the entity's position should be used; otherwise, specifies a fixed depth. |
| `salvagefn` | `function?` | `nil` | Optional callback function invoked during salvage; takes `self.inst` as argument and returns the result of the salvage operation. |

## Main Functions

### `SetSalvageFn(fn)`
* **Description:** Assigns a custom salvage callback function to be executed when `Salvage()` is called.
* **Parameters:**
  - `fn (function?)` — A function that accepts the winch target entity as its sole argument and returns a value (often an item or `nil`). May be `nil`.

### `Salvage()`
* **Description:** Executes the stored salvage callback (`salvagefn`) and, if applicable, disables repositioning lock on the contained submerged object before salvage. Returns the result of `salvagefn`, or `nil` if no callback is set.
* **Parameters:** None.

### `GetSunkenObject()`
* **Description:** Retrieves the item currently in slot 1 (index 1) of the entity’s inventory, if the inventory component exists and the item is present.
* **Parameters:** None.
* **Returns:** `SimEntity?` — The item stored in slot 1, or `nil` if no inventory or no item.

## Events & Listeners
None identified.