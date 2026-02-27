---
id: slingshotmods
title: Slingshotmods
description: Manages the modding interface and storage for slingshot parts in DST, handling container creation, access control, and part transfers.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: ad1f692a
---

# Slingshotmods

## Overview
This component provides server-side logic for managing slingshot modding—specifically, it maintains a container of interchangeable slingshot parts (band, frame, handle), controls access to the modding interface, handles opening/closing the UI, and supports part transfer between slingshots. It enforces ownership, skill requirements, and persistence of contained parts.

## Dependencies & Tags
- **Component Dependencies**: Relies on `self.inst` having `components.equippable`, `components.inventoryitem`, `components.skilltreeupdater`, `components.container` (on `containerinst`), and `components.containerinstallableitem` (on parts).
- **Tags/Events Used**: Listens for `"ondropped"` event to auto-close; triggers `"ms_slingshotmodsclosed"` event on close.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The slingshot entity this component belongs to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether the current instance is the server (mastersim). |
| `isloading` | `boolean` | `nil` | Temporarily set `true` during loading to avoid side effects. |
| `containerinst` | `Entity` or `nil` | `nil` | Reference to the internal container entity (`slingshotmodscontainer`) holding slingshot parts. |
| `opener` | `Entity` or `nil` | `nil` | The player currently using the modding interface. |

## Main Functions

### `CanBeOpenedBy(doer)`
* **Description:** Checks whether the given entity (`doer`) is allowed to open the slingshot modding UI.
* **Parameters:**
  - `doer` (`Entity`): The potential opener (usually a player). Must have the `"walter_slingshot_modding"` skill activated *and* be the grand owner of the slingshot.

### `IsLoading()`
* **Description:** Returns `true` if the component is currently loading (used to suppress logic during deserialization).
* **Parameters:** None.

### `HasPartName(name)`
* **Description:** Checks if the container contains at least one part with the given prefab name (e.g., `"slingshotband"`).
* **Parameters:**
  - `name` (`string`): The prefab name to search for.

### `HasAnyParts()`
* **Description:** Returns `true` if the container is non-empty.
* **Parameters:** None.

### `GetPartBuildAndSymbol(slot)`
* **Description:** Returns the prefab, build ID, and symbol of the part in the specified slot (`"band"`, `"frame"`, or `"handle"`).
* **Parameters:**
  - `slot` (`string`): One of `"band"`, `"frame"`, or `"handle"`. Maps internally to slots 1–3.

### `CheckRequiredSkillsForPlayer(player)`
* **Description:** Verifies the player has all required skills for every part currently installed in the slingshot.
* **Parameters:**
  - `player` (`Entity`): The player whose skill tree is checked.

### `CreateContainer_Internal()`
* **Description:** Spawns and initializes the `slingshotmodscontainer` entity (server-only). Attaches it as a child and sets up `"ondropped"` listener to auto-close.

### `TransferPartsTo(other)`
* **Description:** Moves the entire part container from this slingshot to another slingshot’s component. Updates ownership, parent, and calls `OnInstalled` on each part.
* **Parameters:**
  - `other` (`SlingshotMods`): The target slingshot’s `SlingshotMods` component.

### `Open(opener)`
* **Description:** Opens the modding UI for a specific player if access conditions are met (ownership, unlocked skill, not equipped).
* **Parameters:**
  - `opener` (`Entity` or `nil`): The player attempting to open the UI. If `nil` or blocked, returns `false`.

### `Close(opener)`
* **Description:** Closes the modding UI for the specified player (or the current opener if none specified). Triggers `"ms_slingshotmodsclosed"` on the opener.
* **Parameters:**
  - `opener` (`Entity` or `nil`): The player closing the UI. If mismatched or UI already closed, returns `false`.

### `OnUpdate(dt)`
* **Description:** Auto-closes the UI if the opener’s state machine no longer has the `"moddingslingshot"` tag (e.g., player walked away or died).
* **Parameters:**
  - `dt` (`number`): Delta time (unused, but required by the update loop).

### `DropAllPartsWithoutUninstalling()`
* **Description:** Drops all parts from the container directly onto the ground, skipping uninstallation logic (e.g., on slingshot destruction).
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns persistable data for the contained parts (used during world save).
* **Parameters:** None.

### `OnLoad(data, newents)`
* **Description:** Restores parts from saved data into the container during world load.
* **Parameters:**
  - `data` (`table`): Contains `"parts"` key with saved container data.
  - `newents` (`table`): Mapping of saved entity IDs to new entity instances.

## Events & Listeners
- **Listens to:**
  - `"ondropped"` → calls `doclose` (which invokes `:Close()`).
- **Triggers:**
  - `"ms_slingshotmodsclosed"` on the opener after successfully closing the UI.