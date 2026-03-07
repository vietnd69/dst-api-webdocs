---
id: tool
title: Tool
description: Tracks which actions a tool can perform and their effectiveness, managing tag-based action identification and breaking behavior.
tags: [inventory, combat, tools]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 598d2919
system_scope: inventory
---

# Tool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Tool` component enables an entity to perform specific actions (e.g., chopping, mining, digging) with defined effectiveness. It automatically adds the `tool` tag to the entity and dynamically adds action-specific tags (e.g., `chop_tool`, `mine_tool`) when actions are registered. The component also monitors `percentusedchange` events to detect when a tool breaks (reaches 0% usage) and notifies the owner via a custom `toolbroke` event—unless a `rechargeable` component is present.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tool")
inst:AddComponent("inventoryitem")
inst:AddComponent("rechargeable")  -- Optional: prevents toolbroke event on break

local chopAction = { id = "chop" }
inst.components.tool:SetAction(chopAction, 2.0)  -- 2x effectiveness for chopping

print(inst.components.tool:GetEffectiveness("chop"))  -- outputs: 2.0
print(inst.components.tool:CanDoAction("chop"))       -- outputs: true
```

## Dependencies & tags
**Components used:** `inventoryitem` (to notify owner on break), `rechargeable` (suppresses break notification when present).  
**Tags:** Adds `tool` unconditionally; adds `<action_id>_tool` for each registered action (e.g., `chop_tool`). Removes `tool` and all `<action_id>_tool` tags on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | Reference to the owning entity instance (set in constructor). |
| `actions` | table | `{}` | Dictionary mapping action objects (e.g., `{ id = "chop" }`) to numeric effectiveness values. |
| `tough` | boolean or nil | `nil` | Whether the tool is capable of performing "tough" work (e.g., breaking rock walls). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component’s state when removed from an entity. Removes the `tool` and all action-specific tags, and unregisters the `percentusedchange` listener.
* **Parameters:** None.
* **Returns:** Nothing.

### `EnableToughWork(tough)`
* **Description:** Enables or disables the tool’s ability to perform tough work. By default, `tough` is `true` if omitted or `true`; explicitly pass `false` to disable.
* **Parameters:** `tough` (boolean) — whether the tool supports tough work.
* **Returns:** Nothing.

### `CanDoToughWork()`
* **Description:** Reports whether the tool can perform tough work.
* **Parameters:** None.
* **Returns:** `true` if `self.tough == true`, otherwise `false`.

### `GetEffectiveness(action)`
* **Description:** Returns the effectiveness multiplier for a given action string or object.
* **Parameters:** `action` (string or table) — the action identifier (e.g., `"chop"` or `{ id = "chop" }`).
* **Returns:** A number (the effectiveness value), or `0` if the action is not registered.

### `SetAction(action, effectiveness)`
* **Description:** Registers an action for this tool and assigns its effectiveness. Automatically adds a tag `<action.id>_tool` to the entity.
* **Parameters:**  
  `action` (table) — an action object with an `id` field (e.g., `{ id = "mine" }`).  
  `effectiveness` (number, optional) — effectiveness multiplier; defaults to `1`.
* **Returns:** Nothing.
* **Error states:** Asserts if `TOOLACTIONS[action.id]` is not defined (i.e., the action ID is invalid).

### `CanDoAction(action)`
* **Description:** Checks if the tool supports the specified action.
* **Parameters:** `action` (string or table) — the action identifier.
* **Returns:** `true` if the action is registered, otherwise `false`.

## Events & listeners
- **Listens to:** `percentusedchange` — triggers the internal `PercentChanged` callback when usage percentage changes; fires `toolbroke` on the owner when usage reaches `0`, unless `rechargeable` is present.
- **Pushes:** none directly. However, the callback `PercentChanged` calls `owner:PushEvent("toolbroke", { tool = inst })` when the tool breaks.
