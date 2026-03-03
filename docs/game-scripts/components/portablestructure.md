---
id: portablestructure
title: Portablestructure
description: Provides a callback mechanism for custom dismantling logic when a portable structure is disassembled.
tags: [structure, inventory, crafting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 29055427
system_scope: entity
---

# Portablestructure

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PortableStructure` enables custom behavior to be executed when a portable structure entity is dismantled. It stores a user-defined callback function (`ondismantlefn`) that is invoked during dismantling, allowing modders to define specific dismantle logic (e.g., dropping unique items, spawning effects, or modifying world state) without subclassing or overriding core dismantle logic.

This component is typically added to prefabs that represent portable or disassemblable structures (e.g., campfires, foundations, lanterns) and works in conjunction with dismantling actions triggered by players or tools.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("portablestructure")

inst.components.portablestructure:SetOnDismantleFn(function(inst, doer)
    -- Custom logic when dismantled
    inst.Transform:SetPosition(doer.Transform:GetWorldPosition())
    inst.components.lootdropper:DropLoot()
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ondismantlefn` | function or nil | `nil` | A function to call when `Dismantle()` is invoked. Signature: `fn(inst, doer)`. |

## Main functions
### `SetOnDismantleFn(fn)`
*   **Description:** Assigns the callback function to be executed when the entity is dismantled.
*   **Parameters:** `fn` (function or nil) — the function to invoke on dismantle; `nil` clears the callback.
*   **Returns:** Nothing.

### `Dismantle(doer)`
*   **Description:** Executes the stored dismantle callback (if set), passing the entity instance and the entity performing the dismantle action.
*   **Parameters:** `doer` (entity or nil) — the entity (typically a player) triggering the dismantle.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ondismantlefn` is `nil`.

## Events & listeners
None identified
