---
id: succulent_potted
title: Succulent Potted
description: A decorative potted succulent that can be hammered to collect loot and produces a small collapse FX effect.
tags: [environment, decorative, workable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be9036e6
system_scope: environment
---

# Succulent Potted

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`succulent_potted` is a decorative world object representing a potted succulent plant. It is placed via a placer and supports interaction via the `workable` component, where hammering triggers loot drop and visual FX. It integrates with the save/load system to persist its variant ID (`plantid`) and handles rendering via animation overrides.

## Usage example
```lua
--Typical use in a prefab definition (as shown in source code):
local prefabs = { "collapse_small" }

local function onhammered(inst)
    local fx = SpawnPrefab("collapse_small")
    fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
    fx:SetMaterial("pot")
    inst.components.lootdropper:DropLoot()
    inst:Remove()
end

local function fn()
    local inst = CreateEntity()
    inst.entity:AddTransform()
    inst.entity:AddSoundEmitter()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    inst:AddTag("pottedplant")
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
    inst.components.workable:SetWorkLeft(1)
    inst.components.workable:SetOnFinishCallback(onhammered)
    inst:AddComponent("lootdropper")
    return inst
end

return Prefab("succulent_potted", fn, assets, prefabs)
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`, `inspectable`, `burnable`, `propagator`, `hauntable`
**Tags:** Adds `pottedplant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plantid` | number | `nil` (initialized to `math.random(5)` on first use) | Identifies the visual variant of the succulent; used to select the correct animation symbol. |

## Main functions
### `SetupPlant(plantid)`
*   **Description:** Configures the visual appearance by overriding or clearing the `succulent` symbol in the AnimState based on `plantid`.
*   **Parameters:** `plantid` (number, optional) — if omitted or `nil`, uses `inst.plantid` if present; otherwise assigns `math.random(5)` before selecting symbol.
*   **Returns:** Nothing.
*   **Error states:** If `inst.plantid == 1` or `inst:GetSkinBuild() ~= nil`, it clears the override instead of setting one.

### `onsave(inst, data)`
*   **Description:** Save callback that stores `plantid` in the save data.
*   **Parameters:** `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Load callback that restores the visual variant using saved `plantid`.
*   **Parameters:** `data` (table or `nil`) — contains saved `plantid` or `nil` if none exists.
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Callback triggered when hammering completes; spawns collapse FX, drops loot, and removes the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Fired on build completion; plays placement animation, pushes idle loop, and emits a craft sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — fires `onbuilt(inst)` after placement.
- **Pushes:** None directly; uses component events (`workable`/`lootdropper`) internally but does not emit custom events.