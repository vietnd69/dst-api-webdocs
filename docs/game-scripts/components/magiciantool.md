---
id: magiciantool
title: Magiciantool
description: Manages the usage lifecycle of magical tools by tracking user context and invoking custom callbacks when tools are started or stopped being used.
tags: [combat, equipment, magic, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 37fcf624
system_scope: entity
---

# Magiciantool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Magiciantool` is a lightweight component that attaches to entities representing magical tools (e.g., wands, staves) and facilitates integration with the `magician` component. It maintains a reference to the current user (`doer`) and allows modders to register optional callback functions for when tool usage starts and stops. It ensures proper cleanup, including notifying the `magician` component and removing the `"magiciantool"` tag on entity/component removal.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("magiciantool")

inst.components.magiciantool:SetOnStartUsingFn(function(tool, user)
    print("Tool", tool.prefab, "started using by", user.prefab)
end)

inst.components.magiciantool:SetOnStopUsingFn(function(tool, user)
    print("Tool", tool.prefab, "stopped using by", user.prefab)
end)
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`; interacts indirectly with the `magician` component via `Magician:DropToolOnStop()` and `Magician:StopUsing()`.  
**Tags:** Adds `"magiciantool"` on instantiation; removes it on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in constructor) | The entity instance this component is attached to. |
| `user` | `Entity` or `nil` | `nil` | The entity currently using this tool. Set by `OnStartUsing`, cleared by `OnStopUsing`. |
| `onstartusingfn` | function or `nil` | `nil` | Optional callback executed when tool usage begins: `fn(tool: Entity, user: Entity)`. |
| `onstopusingfn` | function or `nil` | `nil` | Optional callback executed when tool usage ends: `fn(tool: Entity, user: Entity)`. |

## Main functions
### `OnStartUsing(doer)`
* **Description:** Marks the tool as being used by the specified entity (`doer`). Invokes the `onstartusingfn` callback if set. Called by the `magician` component when a tool is equipped/activated.
* **Parameters:** `doer` (`Entity`) — the entity initiating tool usage.
* **Returns:** Nothing.
* **Error states:** Early return with no effect if `user` is already set (prevents reassignment).

### `OnStopUsing(doer)`
* **Description:** Marks the tool as no longer in use by clearing the `user` reference and invoking the `onstopusingfn` callback if set. Called by the `magician` component when tool usage ends.
* **Parameters:** `doer` (`Entity`) — the entity that was using the tool (must match current `user`).
* **Returns:** Nothing.
* **Error states:** Early return with no effect if `doer` does not match the current `user`.

### `StopUsing()`
* **Description:** Aggressively stops tool usage regardless of the current user. If a `user` exists, delegates to `Magician:StopUsing()` if available, otherwise falls back to `OnStopUsing(self.user)`.
* **Parameters:** None.
* **Returns:** Nothing (the underlying `Magician:StopUsing()` may return `true` or `false`, but this method discards the result).
* **Error states:** No effect if `user` is `nil`.

### `SetOnStartUsingFn(fn)`
* **Description:** Registers a custom callback to be executed when the tool begins being used.
* **Parameters:** `fn` (`function` or `nil`) — function of signature `fn(tool: Entity, user: Entity)`.
* **Returns:** Nothing.

### `SetOnStopUsingFn(fn)`
* **Description:** Registers a custom callback to be executed when the tool stops being used.
* **Parameters:** `fn` (`function` or `nil`) — function of signature `fn(tool: Entity, user: Entity)`.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler invoked when the component is removed from its entity. Ensures tool usage is stopped and the `"magiciantool"` tag is removed.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveEntity()`
* **Description:** Cleanup handler invoked when the entity itself is removed. Ensures that if a user exists, their `magician` component is notified and tool usage is terminated cleanly.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this component does not register for events via `inst:ListenForEvent`).
- **Pushes:** None (this component does not fire events via `inst:PushEvent`).
