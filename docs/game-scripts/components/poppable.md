---
id: poppable
title: Poppable
description: Manages a one-time "pop" event trigger for an entity, optionally invoking a callback when popped.
tags: [event, callback, lifecycle]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 45373639
system_scope: entity
---

# Poppable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Poppable` is a lightweight component that enables an entity to be marked as "popped" exactly once. It supports an optional callback (`onpopfn`) that executes upon the first call to `Pop()`. The component is stateful and ignores subsequent `Pop()` calls after the first. It is typically used for one-time initialization or destruction events, such as removing visual effects, triggering animations, or cleaning up resources.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("poppable")
inst.components.poppable.onpopfn = function(inst)
    print("Entity was popped!")
    inst:Remove()
end
inst.components.poppable:Pop()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `popped` | boolean | `false` | Whether the entity has been popped. Read-only for external access. |
| `onpopfn` | function? | `nil` | Optional callback function invoked once when `Pop()` is first called. Receives `self.inst` as its sole argument. |

## Main functions
### `Pop()`
* **Description:** Marks the entity as popped and invokes `onpopfn` once, if set. Subsequent calls have no effect.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
