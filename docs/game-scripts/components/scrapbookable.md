---
id: scrapbookable
title: Scrapbookable
description: Provides an interface for marking an entity as learnable via the Scrapbook UI and executing a custom teaching callback when taught.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f9a86b33
---

# Scrapbookable

## Overview
The `Scrapbookable` component enables an entity to be "taught" (i.e., added to a player's Scrapbook) by storing and invoking a custom teaching callback. It is typically used for vanilla or modded recipes, creatures, or items that can be discovered and documented in the in-game Scrapbook.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity this component is attached to. |
| `onteach` | `function?` | `nil` | Optional callback function executed when `:Teach()` is called; signature: `fn(inst, doer)`. |

## Main Functions
### `SetOnTeachFn(fn)`
* **Description:** Sets the callback function to be invoked when the entity is taught via the Scrapbook.
* **Parameters:**  
  `fn` (`function?`) — The callback to register. Called with two arguments: the entity (`inst`) and the entity performing the teach action (`doer`).

### `Teach(doer)`
* **Description:** Executes the registered teaching callback (if defined) and returns `true`. This method is called when a player successfully teaches the entity in the Scrapbook UI.
* **Parameters:**  
  `doer` (`GoreObject?` or `Entity`) — The entity performing the teach action (typically a player).

## Events & Listeners
None.