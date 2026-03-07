---
id: worker
title: Worker
description: Tracks which actions an entity can perform and their relative effectiveness.
tags: [action, utility, performance]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0e8b6475
system_scope: entity
---

# Worker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worker` is a lightweight utility component that enables an entity to declare support for specific actions and assign relative effectiveness values to them. It does not perform actions itself but serves as a querying interface for systems (e.g., AI brains, tools, or UI) to determine whether and how well an entity can execute a given action. It stores action→effectiveness mappings as a simple dictionary (`self.actions`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("worker")

-- Configure the entity's capabilities
inst.components.worker:SetAction("mine", 1.5)
inst.components.worker:SetAction("chop", 1.0)
inst.components.worker:SetAction("build", 0.5)

-- Query capabilities
if inst.components.worker:CanDoAction("mine") then
    local eff = inst.components.worker:GetEffectiveness("mine")
    print("Mining effectiveness:", eff)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `actions` | table | `{}` | Dictionary mapping action names (strings) to effectiveness values (numbers). |

## Main functions
### `GetEffectiveness(action)`
* **Description:** Returns the effectiveness value associated with a given action name. Returns `0` if the action is not registered.
* **Parameters:** `action` (string) — the name of the action to query.
* **Returns:** `number` — the effectiveness value, or `0` if not found.
* **Error states:** None.

### `SetAction(action, effectiveness)`
* **Description:** Registers or updates the effectiveness value for a given action. If `effectiveness` is omitted or `nil`, it defaults to `1`.
* **Parameters:**  
  - `action` (string) — the name of the action to register.  
  - `effectiveness` (number, optional) — the effectiveness multiplier for the action.
* **Returns:** Nothing.

### `CanDoAction(action)`
* **Description:** Checks whether the entity supports a given action, regardless of effectiveness.
* **Parameters:** `action` (string) — the name of the action to check.
* **Returns:** `boolean` — `true` if the action is registered, `false` otherwise.
* **Error states:** None.

## Events & listeners
None identified
