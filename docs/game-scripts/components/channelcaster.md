---
id: channelcaster
title: Channelcaster
description: Manages an entity's channeling state for specific items, applying movement modifiers and synchronizing status across the network.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Channelcaster

## Overview
This component allows an entity, typically a player, to initiate and manage a "channeling" action with a specific item. It handles the state of channeling, applies movement speed modifiers, interacts with the `channelcastable` component of the channeled item, and synchronizes the channeling status across the network for player entities. It also ensures channeling stops if the entity enters certain state graph states.

## Dependencies & Tags
*   **Components it relies on:**
    *   `locomotor` (on the host entity) for applying speed modifiers.
    *   `channelcastable` (on the item being channeled) for item-specific channeling logic.
    *   `player_classified` (on the host entity, if a player) for network synchronization of `ischannelcasting` and `ischannelcastingitem` status.
*   **State Graph Tags it checks:** `"idle"`, `"running"`, `"keepchannelcasting"`.

## Properties
| Property             | Type     | Default Value | Description                                                                                             |
| :------------------- | :------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`               | `Entity` | -             | A reference to the entity this component is attached to.                                                |
| `item`               | `Entity` | `nil`         | The item currently being channeled by the entity. Updates `player_classified.ischannelcastingitem` when changed. |
| `channeling`         | `boolean`| `false`       | The current channeling status of the entity. Updates `player_classified.ischannelcasting` when changed.  |
| `onstartchannelingfn`| `function`| `nil`         | An optional callback function to execute when channeling successfully starts.                           |
| `onstopchannelingfn` | `function`| `nil`         | An optional callback function to execute when channeling successfully stops.                            |

## Main Functions
### `SetOnStartChannelingFn(fn)`
*   **Description:** Sets a custom function to be called when the entity successfully begins channeling.
*   **Parameters:**
    *   `fn`: `function` - The callback function. It will be passed `(inst, item)` where `inst` is the entity and `item` is the channeled item.

### `SetOnStopChannelingFn(fn)`
*   **Description:** Sets a custom function to be called when the entity successfully stops channeling.
*   **Parameters:**
    *   `fn`: `function` - The callback function. It will be passed `(inst, item)` where `inst` is the entity and `item` is the item that was channeled.

### `IsChannelingItem(item)`
*   **Description:** Checks if a specific item is currently the one being channeled.
*   **Parameters:**
    *   `item`: `Entity` - The item to check against the currently channeled item.

### `IsChanneling()`
*   **Description:** Returns the current channeling status of the entity.
*   **Parameters:** None.

### `StartChanneling(item)`
*   **Description:** Attempts to start channeling a specified item. If successful, it sets the `channeling` state, applies a speed multiplier, informs the item's `channelcastable` component, and pushes a `startchannelcast` event. It will automatically stop any current channeling before starting a new one if a different item is provided or if not currently channeling.
*   **Parameters:**
    *   `item`: `Entity` - The item to begin channeling. It must have a `channelcastable` component and be valid, or be `nil` to allow starting an empty channel.

### `StopChanneling()`
*   **Description:** Stops any active channeling. This removes the speed multiplier, informs the channeled item's `channelcastable` component, and pushes a `stopchannelcast` event.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** Alias for `StopChanneling`. Called when the component is removed from its entity.
*   **Parameters:** None.

### `OnRemoveEntity()`
*   **Description:** Alias for `StopChanneling`. Called when the entity itself is removed.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a formatted string displaying the current channeling status and the item being channeled, useful for debugging.
*   **Parameters:** None.

## Events & Listeners
*   **Listens for:**
    *   `"newstate"` on `self.inst`: Calls an internal `OnNewState` function which stops channeling if the entity's state graph does not have `"idle"`, `"running"`, or `"keepchannelcasting"` tags.
*   **Pushes/Triggers:**
    *   `"startchannelcast"` on `self.inst` (data: `{ item = item }`): Triggered when channeling successfully starts.
    *   `"stopchannelcast"` on `self.inst` (data: `{ item = item }`): Triggered when channeling successfully stops.