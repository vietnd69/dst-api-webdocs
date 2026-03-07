---
id: beeswax
title: Beeswax
description: A small consumable item that melts when exposed to fire and is stackable.
tags: [item, consumable, melt]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 110d31df
system_scope: inventory
---

# Beeswax

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beeswax` is a prefabricated item used as a crafting material and consumable. It supports melting under fire via dedicated event handlers and integrates with the `inventoryitem` and `stackable` components. The entity persists in the world until melted, at which point it becomes non-interactable and eventually removes itself.

## Usage example
```lua
local inst = SpawnPrefab("beeswax")
inst.Transform:SetPosition(x, y, z)
inst.components.stackable:SetSize(5) -- Set stack size (max 10)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `wax`, `inspectable`  
**Tags:** Adds `meltable`, `NOCLICK` (when melted); checks `debris`, `drainable`, `hauntable`, `trapbait`, `veggie` via global prefab tag system.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `melted` | boolean | `false` | Indicates whether the beeswax has melted due to fire exposure. |
| `firemelttask` | Task or `nil` | `nil` | Task reference for delayed melting after fire exposure. |

## Main functions
### `_OnFireMelt(inst, StartFireMelt, StopFireMelt)`
*   **Description:** Internal callback triggered after 10 seconds of continuous fire exposure. Sets the `melted` state, disables pickup, plays the melt animation, and schedules removal upon animation completion.
*   **Parameters:** `inst` (Entity), `StartFireMelt` (function), `StopFireMelt` (function) — reference closures for cleanup.
*   **Returns:** Nothing.
*   **Error states:** If the entity is asleep when melting begins, it is immediately removed.

### `StartFireMelt(inst)`
*   **Description:** Starts the 10-second delayed melting timer if not already active.
*   **Parameters:** `inst` (Entity) — the beeswax instance.
*   **Returns:** Nothing.

### `StopFireMelt(inst)`
*   **Description:** Cancels the pending fire-melt task if active; used on exit from fire or when placed in inventory.
*   **Parameters:** `inst` (Entity) — the beeswax instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `firemelt`, `stopfiremelt`, `onputininventory`, `animover`, `entitysleep`.  
- **Pushes:** None (relies on state changes and animation callbacks for side effects).

```lua
inst:ListenForEvent("firemelt", StartFireMelt)
inst:ListenForEvent("stopfiremelt", StopFireMelt)
inst:ListenForEvent("onputininventory", StopFireMelt)
inst:ListenForEvent("animover", inst.Remove)
inst:ListenForEvent("entitysleep", inst.Remove)