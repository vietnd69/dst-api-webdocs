---
id: shadowheart
title: Shadowheart
description: An inventory item that emits periodic sound and animation cues when dropped, and halts these behaviors when held by a player.
tags: [inventory, audio, visual, sanity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0cb83d7
system_scope: inventory
---

# Shadowheart

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowheart` prefab represents a collectible item used in DST's sanity-related mechanics. It is an inventory object that visually and audibly "beats" (animates and plays a heartbeat sound) when dropped on the ground, and stops this behavior when picked up. It integrates with the `inventoryitem` component to trigger state changes via callback functions and includes optional `inspectable` and `tradable` components for gameplay integration.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()
MakeInventoryPhysics(inst)
inst.AnimState:SetBank("shadowheart")
inst.AnimState:SetBuild("shadowheart")
inst.AnimState:PlayAnimation("idle")
MakeInventoryFloatable(inst, "small", 0.05, 0.8)
inst:AddTag("shadowheart")
inst.entity:SetPristine()
if not TheWorld.ismastersim then
    return inst
end
inst:AddComponent("inventoryitem")
inst.components.inventoryitem:SetOnDroppedFn(ondropped)
inst.components.inventoryitem:SetOnPutInInventoryFn(onpickup)
inst:AddComponent("inspectable")
inst:AddComponent("tradable")
MakeHauntableLaunch(inst)
inst.beattask = nil
ondropped(inst)
return inst
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `tradable`  
**Tags:** Adds `shadowheart`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `beattask` | Task or `nil` | `nil` | Reference to the repeating task responsible for periodic heartbeat behavior. Cancelled on pickup. |

## Main functions
### `beat(inst)`
*   **Description:** Plays the idle animation and heartbeat sound, then schedules the next beat after a random interval (0.75–1.5 seconds). This function recursively schedules itself via `DoTaskInTime`.
*   **Parameters:** `inst` (Entity instance) – the shadow heart entity.
*   **Returns:** Nothing.

### `ondropped(inst)`
*   **Description:** Called when the item is dropped onto the world. Cancels any existing beat task (to reset timing), then starts a new beat task.
*   **Parameters:** `inst` (Entity instance) – the shadow heart entity.
*   **Returns:** Nothing.

### `onpickup(inst)`
*   **Description:** Called when the item is picked up by a player. Cancels the current beat task and nullifies it, stopping sound and animation updates.
*   **Parameters:** `inst` (Entity instance) – the shadow heart entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register event listeners).
- **Pushes:** None (does not fire custom events).