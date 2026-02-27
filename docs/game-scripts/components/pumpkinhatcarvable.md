---
id: pumpkinhatcarvable
title: Pumpkinhatcarvable
description: This component manages the carving process for a pumpkin hat entity, handling tool validation, player interaction states, and face data updates in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 80f447c3
---

# Pumpkinhatcarvable

## Overview
This component enables interactive carving of pumpkin-based hats in Don't Starve Together. It orchestrates the carving workflow—including tool validation, player state management, and face data validation—when a player interacts with the pumpkin entity. It supports only the master simulation (server) and integrates with the entity's inventory, burnable, equippable, and floater components to enforce interaction constraints.

## Dependencies & Tags
- Relies on components:
  - `inventory` (on the *doer/player* to check tools)
  - `inventoryitem` (on the pumpkin entity to control pick-up behavior)
  - `burnable` (to prevent carving while burning)
  - `equippable` (to block carving when equipped)
  - `floater` (to block carving when floating)
  - `sg` (StateGraph on the player to trigger animation state)
- Tags: None directly added or removed.
- Uses constants:
  - `PARTS = { "reye", "leye", "mouth" }`
  - `VARS_PER_TOOL = 9`
  - `POPUPS.PUMPKINHATCARVING`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | `nil` | Reference to the entity this component is attached to. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Whether the current instance is master simulation (server). |
| `collectfacedatafn` | function | `nil` | Optional callback to populate current face data before editing. |
| `carver` | Entity (player) | `nil` | The player currently carving the pumpkin. `nil` when idle. |
| `range` | number | `3` | Maximum distance (tiles) the carver may be from the pumpkin to continue carving. |
| `onchangefacedatafn` | function | `nil` | Callback invoked when face data is successfully validated and changed. |
| `onopenfn` | function | `nil` | Callback invoked when carving begins. |
| `onclosefn` | function | `nil` | Callback invoked when carving ends. |
| `PARTS` | table (constant) | `{ "reye", "leye", "mouth" }` | List of facial feature parts available for carving. |
| `PART_IDS` | table (constant) | `table.invert(PARTS)` | Inverted map from part name → index. |
| `VARS_PER_TOOL` | number (constant) | `9` | Number of visual variations per tool/part. |

*Note:* Public fields are only initialized in the constructor (`_ctor`), which is implemented inline as `Class(function(self, inst) ... end)`.

## Main Functions

### `CanBeginCarving(doer)`
* **Description:** Checks whether the given player (`doer`) is allowed to start carving the pumpkin. Enforces constraints such as tool availability (implied by other logic), burning state, equip state, and prior carving activity.
* **Parameters:**
  - `doer` (Entity): The player attempting to carve.

### `BeginCarving(doer)`
* **Description:** Starts the carving interaction. Sets the `carver`, blocks pickup of the pumpkin, opens the carving UI popup, enters the `"pumpkincarving"` state on the player, registers event listeners, and begins periodic updates to monitor proximity.
* **Parameters:**
  - `doer` (Entity): The player initiating the carving.

### `EndCarving(doer)`
* **Description:** Ends the carving interaction for the specified player, if they are the current carver. Resets state: unblocks pickup, removes listeners, stops updates, and triggers the `"ms_endpumpkincarving"` event on the player.
* **Parameters:**
  - `doer` (Entity): The player ending their carving session.

### `GetFaceData()`
* **Description:** Retrieves the current face configuration by invoking the optional `collectfacedatafn` callback if present. Used to compare or validate face data during saving.
* **Returns:** `table` – A map of `{ part_name = variation_id }` for each part, or an empty table.

### `OnUpdate(dt)`
* **Description:** Monitors the carver's proximity and line-of-sight to the pumpkin during carving. Automatically ends carving if the carver moves too far or cannot see the pumpkin.
* **Parameters:**
  - `dt` (number): Time elapsed since last frame (unused in logic).

### `OnRemoveFromEntity()`
* **Description:** Cleans up listeners and ends any active carving session when the component is removed from its entity. Also aliased as `OnRemoveEntity`.

## Events & Listeners
- **Listens for events:**
  - `"onputininventory"` → triggers `interruptcarving`
  - `"floater_startfloating"` → triggers `interruptcarving`
  - `"onremove"` (on `inst`) → triggers `self.onclosepumpkin`
  - `"ms_closepopup"` (on `inst`) → triggers `self.onclosepopup`

- **Triggers events:**
  - `"ms_endpumpkincarving"` → pushed immediately to the player (`doer`) when carving ends.

*Note:* The component does *not* push events on face changes; this is delegated to `onchangefacedatafn` callbacks.