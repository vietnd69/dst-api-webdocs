---
id: rubble
title: Rubble
description: A destructible cave environment object that yields loot when mined, with animations and behavior varying by remaining durability.
tags: [environment, mining, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1119dcf2
system_scope: environment
---

# Rubble

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rubble` is a world-object prefab used to represent piles of debris in caves that can be mined using the `MINE` action. It implements workable behavior, loot dropping, and visual state transitions (`full`, `med`, `low`) based on remaining durability. When fully worked, it collapses with a particle effect and drops its configured loot. It is part of the cave environment and participates in the game's mining and loot systems.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()
inst:AddTag("cavedweller")

inst:AddComponent("lootdropper")
inst.components.lootdropper:SetLoot({"rocks"})
inst.components.lootdropper.numrandomloot = 1
inst.components.lootdropper:AddRandomLoot("cutstone", 0.10)
inst.components.lootdropper:AddRandomLoot("greengem", 0.01)

inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.MINE)
inst.components.workable:SetOnWorkCallback(my_workcallback)
inst.components.workable:SetWorkLeft(10)

inst:AddComponent("inspectable")
inst.components.inspectable.nameoverride = "rubble"
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`
**Tags:** Adds `cavedweller`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `nil` | Stores the animation name (`"full"`, `"med"`, or `"low"`) for scrapbook display. Only set on master. |

## Main functions
### `workcallback(inst, worker, workleft)`
*   **Description:** Callback executed when rubble is mined. If `workleft <= 0`, it spawns a collapse effect, drops loot, and removes the entity. Otherwise, it updates the animation based on remaining work.
*   **Parameters:**
    *   `inst` (Entity) – The rubble instance being mined.
    *   `worker` (Entity) – The entity performing the work.
    *   `workleft` (number) – Remaining work units; triggers collapse when `<= 0`.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** None.
- **Pushes:** The component does not push events directly. However, `lootdropper:DropLoot()` and `inst:Remove()` trigger standard game events (`entity_droploot`, `serverdelete`).