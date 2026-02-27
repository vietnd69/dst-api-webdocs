---
id: gravedigger
title: Gravedigger
description: A minimal component that provides an `OnUsed` callback hook for entities that can be used (e.g., graves), invoking a user-defined handler when activated.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2187161f
---

# Gravedigger

## Overview
The `Gravedigger` component is a lightweight callback handler attached to entities (typically graves) that need to respond when they are used—commonly by a player. It stores and invokes an optional `onused` function callback, passing the entity instance, the user, and the target of the use action.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned by constructor) | Reference to the entity the component is attached to. |

*Note:* The constructor accepts `inst` as its sole parameter and stores it in `self.inst`. No other public properties are explicitly initialized. The commented-out `self.onused = nil` line indicates that external code is expected to assign the callback manually.

## Main Functions

### `OnUsed(user, target)`
* **Description:** Invokes the `onused` callback (if set), forwarding the entity instance, the entity that performed the use (`user`), and the target of the use (e.g., the object interacted with).
* **Parameters:**  
  - `user`: The entity performing the use action (typically a player).  
  - `target`: The target of the use action (often the same as `self.inst`, but may differ in chained interactions).