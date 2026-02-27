---
id: magiciantool
title: Magiciantool
description: Manages the state and lifecycle of a magical tool used by the Magician character, including assignment tracking and user-specific callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 37fcf624
---

# Magiciantool

## Overview
The `Magiciantool` component tracks ownership and usage of a magical tool by a Magician character. It maintains a reference to the current user, applies/removes the `"magiciantool"` tag, and supports optional callback functions triggered when usage starts or stops.

## Dependencies & Tags
- Adds the `"magiciantool"` tag to the entity during construction.
- Removes the `"magiciantool"` tag on entity/component removal.
- Interacts with the `"magician"` component (if present on the user) during usage lifecycle events.
- No direct `AddComponent` calls beyond tagging.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `user` | `Entity?` | `nil` | Reference to the entity currently using the tool (typically a Magician). |
| `onstartusingfn` | `function?` | `nil` | Optional callback invoked when usage starts; signature: `fn(tool_entity, user_entity)`. |
| `onstopusingfn` | `function?` | `nil` | Optional callback invoked when usage stops; signature: `fn(tool_entity, user_entity)`. |

## Main Functions

### `SetOnStartUsingFn(fn)`
* **Description:** Registers a custom callback to execute when the tool begins being used.  
* **Parameters:**  
  - `fn` (*function*): A function that accepts two arguments: the tool entity and the user entity.

### `SetOnStopUsingFn(fn)`
* **Description:** Registers a custom callback to execute when the tool stops being used.  
* **Parameters:**  
  - `fn` (*function*): A function that accepts two arguments: the tool entity and the user entity.

### `OnStartUsing(doer)`
* **Description:** Records the user as the active tool user and invokes the `onstartusingfn` callback, if set. No-op if already in use.  
* **Parameters:**  
  - `doer` (*Entity*): The entity (typically a Magician) initiating tool usage.

### `OnStopUsing(doer)`
* **Description:** Clears the active user (if matches `doer`) and invokes the `onstopusingfn` callback, if set.  
* **Parameters:**  
  - `doer` (*Entity*): The entity (typically a Magician) ending tool usage.

### `StopUsing()`
* **Description:** Handles forced cessation of tool usage. If the tool is in use by a Magician, it delegates to the Magician’s `StopUsing()` method; otherwise, triggers internal cleanup via `OnStopUsing`.  
* **Parameters:** None.

## Events & Listeners
None identified.