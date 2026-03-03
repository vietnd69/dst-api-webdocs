---
id: markable_proxy
title: Markable Proxy
description: Provides a proxy interface to an underlying entity's Markable component, forwarding mark operations and managing the "markable_proxy" tag based on markability state.
tags: [entity, proxy, marking]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ce2727f4
system_scope: entity
---

# Markable Proxy

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Markable_proxy` acts as a forwarding wrapper for an entity's `markable` component. It delegates marking operations (`Mark`, `HasMarked`, `SetMarkable`) to the target entity's `markable` component (stored in `self.proxy`). It also ensures the `"markable_proxy"` tag is added or removed from its owner entity (`self.inst`) based on whether the target entity is currently set as markable. This is typically used in scenarios where one entity needs to control or reflect the markability state of another.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("markable_proxy")
-- Assume target has a markable component
inst.components.markable_proxy.proxy = target
inst.components.markable_proxy:SetMarkable(true)
local success = inst.components.markable_proxy:Mark(doer)
```

## Dependencies & tags
**Components used:** `markable` (accessed via `self.proxy.components.markable`)
**Tags:** Adds `markable_proxy` (via `inst:AddTag("markable_proxy")`) when `canbemarked` is true; removes it otherwise.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity that owns this component. |
| `proxy` | `Entity?` | `nil` | The target entity whose `markable` component is proxied. |
| `canbemarked` | `boolean` | `nil` | Reflects the markability state of the proxy's `markable` component; triggers tag updates when changed. |

## Main functions
### `Mark(doer)`
*   **Description:** Attempts to mark the target entity (via its `markable` component). Typically called by logic that wants to apply a mark to the proxied entity.
*   **Parameters:** `doer` (`Entity`) — the entity performing the marking action.
*   **Returns:** `true` if the mark was successful on the target, `false` otherwise.
*   **Error states:** Returns `false` if `proxy` is `nil` or the proxy lacks a `markable` component.

### `SetMarkable(markable)`
*   **Description:** Configures whether the target entity is currently markable, and synchronizes the proxy owner's tag.
*   **Parameters:** `markable` (`boolean`) — whether the target entity should be considered markable.
*   **Returns:** Nothing.
*   **Error states:** No effect if `proxy` is `nil` or the proxy lacks a `markable` component.

### `HasMarked(doer)`
*   **Description:** Checks whether the given entity has already marked the target entity.
*   **Parameters:** `doer` (`Entity`) — the entity to check for an existing mark.
*   **Returns:** `true` if the `doer` has a mark on the target entity, `nil` otherwise (including when proxy is missing).
*   **Error states:** Returns `nil` if `proxy` is `nil` or the proxy lacks a `markable` component.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

## Constructor
### `Class(function(self, inst) ... end)`
*   **Description:** Initializes the proxy component on an entity.
*   **Parameters:** `inst` (`Entity`) — the entity to attach this component to.
*   **Sets:** `self.inst` to the owning entity; `self.proxy` to `nil`; `self.canbemarked` to `nil`.
*   **Note:** The `canbemarked` property uses the `onmarkable` callback as its setter, automatically managing the `"markable_proxy"` tag.
