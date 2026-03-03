---
id: klaussackkey
title: Klaussackkey
description: Manages the state and lifecycle of a Klaus sack key item, including tag management and delayed restoration logic for true keys.
tags: [inventory, event, network, item, quest]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 00bb7a0e
system_scope: inventory
---

# Klaussackkey

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KlausSackKey` is a lightweight component used on key-like items to indicate they are "Klaus sack keys". It automatically adds the `"klaussackkey"` tag upon attachment and removes it when detached. For true keys (`truekey = true`), it handles delayed network-observable restoration by firing the `"ms_restoreklaussackkey"` world event after a zero-time task, unless the game is currently populating the world.

## Usage example
```lua
local key =_prefab or CreateEntity()
key:AddComponent("klaussackkey")
key.components.klaussackkey:SetTrueKey(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"klaussackkey"` on construction; removes it on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (owned by ECS) | Reference to the entity the component is attached to. |
| `truekey` | `boolean?` | `nil` | Indicates whether this is a "true" key; triggers restoration event when set to `true`. |
| `task` | `GTimer?` | `nil` | Pending delayed task used for key restoration; `nil` when no task is scheduled. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up component state when removed from the entity. Cancels any pending restoration task and removes the `"klaussackkey"` tag.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTrueKey(truekey)`
* **Description:** Sets whether this key is a "true" key. When set to `true`, schedules or immediately fires a `"ms_restoreklaussackkey"` world event depending on world population state. When set to `false`, cancels any pending restoration task.
* **Parameters:** `truekey` (boolean) — whether the key should be considered a true key.
* **Returns:** Nothing.
* **Error states:** No-op if `truekey` is `nil` or if the value matches the current `self.truekey`. Cancelled task is discarded and `self.task` is set to `nil` on false.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `"ms_restoreklaussackkey"` — fired with `self.inst` as argument when a true key is set and world is either not populating or a zero-time task completes.
