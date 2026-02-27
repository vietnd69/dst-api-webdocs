---
id: useableitem
title: Useableitem
description: Manages the "in use" state and interaction lifecycle of an item that can be used by a player.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 2b11da14
---

# Useableitem

## Overview
This component tracks and controls whether an item is currently being "used" by a player (e.g., during animations like eating, swinging tools, or casting spells). It exposes callback hooks for use/start-use and stop-use events, manages the `"inuse"` entity tag, and enforces interaction rules that prevent concurrent usage.

## Dependencies & Tags
- **Components:** Relies on `inst.replica.equippable` being present (typically added by the `equippable` component).
- **Tags:** Automatically adds the `"inuse"` tag to the entity when `StartUsingItem` is called, and removes it on `StopUsingItem` or `OnRemoveFromEntity`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inuse` | `boolean` | `false` | Indicates whether the item is currently in use. |
| `onusefn` | `function?` | `nil` | Optional callback executed when item usage begins; return `false` to abort. |
| `onstopusefn` | `function?` | `nil` | Optional callback executed when item usage ends. |
| `stopuseevents` | `function?` | `nil` | Optional callback that defines event listeners to clear or actions to perform when usage stops. |

## Main Functions

### `SetOnUseFn(fn)`
* **Description:** Sets the function to be called when item usage begins (i.e., when `StartUsingItem` is invoked). The function is passed the item instance (`inst`). If it returns `false`, usage is aborted and `inuse` remains `false`.
* **Parameters:**  
  `fn` (`function`) — A function with signature `function(inst): boolean?`, where `inst` is the item entity.

### `SetOnStopUseFn(fn)`
* **Description:** Sets the function to be called when item usage ends (i.e., when `StopUsingItem` is invoked).
* **Parameters:**  
  `fn` (`function`) — A function with signature `function(inst)`, where `inst` is the item entity.

### `CanInteract(doer)`
* **Description:** Determines whether the given actor (`doer`) is allowed to interact with this item. Interaction is permitted only if the item is not already in use, and the item has an `equippable` replica and is currently equipped.
* **Parameters:**  
  `doer` (`Entity`) — The entity attempting interaction (typically the player).  
  *Note:* The `doer` parameter is accepted but not used in the current implementation.

### `StartUsingItem()`
* **Description:** Attempts to begin item usage. Sets `inuse = true`, calls `onusefn` if present, and applies the `"inuse"` tag. Returns whether usage actually started (may be `false` if `onusefn` returns `false`).
* **Parameters:** None.

### `StopUsingItem()`
* **Description:** Ends item usage. Sets `inuse = false`, calls `onstopusefn` if present, and removes the `"inuse"` tag.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from an entity. Ensures the `"inuse"` tag is removed.

## Events & Listeners
- The component does **not** directly listen to or push events via `inst:ListenForEvent`/`inst:PushEvent`. However:
  - The `stopuseevents` function (settable via internal API) may assign event listeners or perform cleanup when usage stops, but its usage is implementation-dependent and not standardized in this component.
  - The `"inuse"` tag is conditionally applied/removed to support external event-based logic (e.g., animation or network sync triggers), but the component itself does not fire events.