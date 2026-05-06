---
id: socketable
title: Socketable
description: Manages socket identification and quality data for socket-capable entities.
tags: [item, crafting, socket]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 0c2f89e4
system_scope: inventory
---

# Socketable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Socketable` stores socket identification and quality metadata on entities that can accept or contain socketed items. This component is typically added to gems, socketed equipment, or socket receptacles. It works alongside inventory and equippable components to track which socket type an item belongs to and its quality tier.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("socketable")
inst.components.socketable:SetSocketName("socket_RUBY")
inst.components.socketable:SetSocketQuality(SOCKETQUALITY.RARE)

local name = inst.components.socketable:GetSocketName()
local quality = inst.components.socketable:GetSocketQuality()
```

## Dependencies & tags
**External dependencies:**
- `SOCKETQUALITY` -- global enum table defining socket quality tiers

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `socketname` | string | `"socket_DEFAULT"` | Identifier for the socket type this item belongs to or fills. |
| `socketquality` | enum (SOCKETQUALITY) | `SOCKETQUALITY.NONE` | Quality tier of the socket or socketed item. |

## Main functions
### `SetSocketName(socketname)`
* **Description:** Sets the socket type identifier for this entity.
* **Parameters:** `socketname` -- string socket type name (e.g., `"socket_RUBY"`, `"socket_DEFAULT"`)
* **Returns:** nil
* **Error states:** None

### `GetSocketName()`
* **Description:** Returns the current socket type identifier.
* **Parameters:** None
* **Returns:** string socket name
* **Error states:** None

### `SetSocketQuality(socketquality)`
* **Description:** Sets the quality tier for this socket or socketed item.
* **Parameters:** `socketquality` -- SOCKETQUALITY enum value (e.g., `SOCKETQUALITY.NONE`, `SOCKETQUALITY.RARE`)
* **Returns:** nil
* **Error states:** None

### `GetSocketQuality()`
* **Description:** Returns the current quality tier.
* **Parameters:** None
* **Returns:** SOCKETQUALITY enum value
* **Error states:** None

## Events & listeners
- **Listens to:** None
- **Pushes:** None
- **World state watchers:** None