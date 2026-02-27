---
id: portablestructure
title: Portablestructure
description: A lightweight component that stores and executes a custom callback function when the entity is dismantled.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 29055427
---

# Portablestructure

## Overview
This component enables an entity to define and execute a custom dismantling behavior. It acts as a callback registry for dismantle logic, allowing flexible behavior to be attached to specific portable structures (e.g.,Campfire, Lantern) when they are manually dismantled by a player or entity.

## Dependencies & Tags
- **Component Dependencies:** None (does not require or add other components).
- **Tags Added/Removed:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the entity the component is attached to. |
| `ondismantlefn` | `function?` | `nil` | Optional callback function invoked during `Dismantle()`. Takes `(inst, doer)` as arguments. |

## Main Functions
### `SetOnDismantleFn(fn)`
* **Description:** Assigns the function to be called when the entity is dismantled. Replaces any previously set dismantle function.
* **Parameters:**  
  `fn` (function): A callable function accepting two arguments: the entity instance (`inst`) and the dismantle initiator (`doer`).

### `Dismantle(doer)`
* **Description:** Executes the stored dismantle callback function (if one exists), passing the entity and the dismantle initiator. Does nothing if no callback is set.
* **Parameters:**  
  `doer` (Entity): The entity that triggered the dismantling (typically a player).

## Events & Listeners
- **Events Triggered:** None (does not push any events).
- **Events Listeners:** None (does not register any event listeners).