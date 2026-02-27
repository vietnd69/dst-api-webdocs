---
id: tornadobrain
title: Tornadobrain
description: Controls the behavior tree logic for tornado entities, prioritizing leashing to and wandering around a designated target location.
tags: [ai, behavior_tree, entity, movement, boss]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 11c7cb9b
---

# Tornadobrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`Tornadobrain` is a brain component that defines the behavioral logic for tornado entities in `Don't Starve Together`. It inherits from `Brain` and constructs a behavior tree at startup. The behavior tree uses a priority node to select between two behaviors: `Leash`, which moves the tornado toward a specified target location, and `Wander`, which causes the tornado to move randomly in the vicinity of the target. Both behaviors rely on the `KnownLocations` component to resolve the target location by name. This component is responsible for enabling dynamic movement patterns, typically in scenarios where tornadoes chase or track a specific point of interest.

## Dependencies & tags
**Components used:** `knownlocations`
**Tags:** None identified.

## Properties
No public properties are explicitly initialized in the constructor. The component stores its behavior tree instance in `self.bt` during `OnStart()`.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree for the tornado entity. Constructs a priority node that prioritizes leashing over wandering, then creates and stores a new `BT` instance.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May fail silently if `self.inst.components.knownlocations` is missing or the `"target"` location is not registered, causing `GetLocation("target")` to return `nil`. This would result in undefined movement behavior (e.g., leashing/wandering to position `\`{0,0,0}\``).

## Events & listeners
This component does not register any event listeners or push custom events. It operates purely as a behavior tree manager and does not interact with the event system directly.