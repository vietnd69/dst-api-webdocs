---
id: inventoryitem_classified
title: Inventoryitem Classified
description: Manages networked state replication for inventory items using a classified entity structure to optimize bandwidth.
tags: [network, inventory, replication]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 2fd99e10
system_scope: inventory
---

# Inventoryitem Classified

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`inventoryitem_classified` is a hidden prefab entity used to store and replicate network state for inventory items without requiring full entity synchronization. It attaches to a parent inventory item entity and synchronizes properties like image, perishability, recharge, and deploy data via net variables. This structure is primarily internal to the game's networking system but exposes serialization and deserialization methods on the entity instance for state management.

## Usage example
```lua
-- Typically spawned internally by the inventoryitem component during replication
local classified = SpawnPrefab("inventoryitem_classified")
classified.entity:SetParent(parent_inst.entity)

-- Server-side: Update percent used state
classified:SerializePercentUsed(0.5)

-- Client-side: Access replicated data via parent replica
local parent = classified.entity:GetParent()
if parent and parent.replica.inventoryitem then
    local data = parent.replica.inventoryitem.classified
    -- Data is synchronized via net variables on the classified entity
end
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- checks `ismastersim` to determine server/client logic branch
- `FRAMES` -- global constant used for recharge tick timing
- `DEPLOYMODE` / `DEPLOYSPACING` -- enums for deployable state defaults
- `net_hash`, `net_bool`, `net_float`, `net_byte`, `net_smallbyte`, `net_tinybyte` -- network variable constructors
- `Prefab`, `CreateEntity` -- prefab registration and entity creation

**Components used:**
- `inventoryitem` (replica) -- accessed via `parent.replica.inventoryitem` to check wetness and acid sizzling state

**Tags:**
- `CLASSIFIED` -- added to the entity to mark it as a classified data container

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `image` | net_hash | `0` | Hash of the inventory item image asset. |
| `atlas` | net_hash | `0` | Hash of the inventory item atlas asset. |
| `cangoincontainer` | net_bool | `true` | Whether the item can be placed in containers. |
| `canonlygoinpocket` | net_bool | `false` | Whether the item can only be placed in player pockets. |
| `canonlygoinpocketorpocketcontainers` | net_bool | `false` | Whether the item is restricted to pockets or pocket containers. |
| `src_pos.isvalid` | net_bool | `false` | Indicates if the source position coordinates are valid. |
| `src_pos.x` | net_float | `0` | X coordinate of the source position. |
| `src_pos.z` | net_float | `0` | Z coordinate of the source position. |
| `percentused` | net_byte | `255` | Encoded percentage of item durability or charge used. |
| `perish` | net_smallbyte | `63` | Encoded perishability state. |
| `recharge` | net_byte | `255` | Encoded recharge state. |
| `rechargetime` | net_float | `-2` | Time required to recharge; -2 indicates nil/default. |
| `deploymode` | net_tinybyte | `DEPLOYMODE.NONE` | Deployment mode enum value. |
| `deployspacing` | net_tinybyte | `DEPLOYSPACING.DEFAULT` | Deployment spacing enum value. |
| `deployrestrictedtag` | net_hash | `0` | Tag required for deployment target. |
| `usegridplacer` | net_bool | `false` | Whether to use grid placement logic. |
| `attackrange` | net_float | `-99` | Weapon attack range override. |
| `walkspeedmult` | net_byte | `1` | Equippable walk speed multiplier. |
| `equiprestrictedtag` | net_hash | `0` | Tag required for equipping. |
| `moisture` | net_float | `0` | Current moisture level of the item. |
| `islockedinslot` | net_bool | `false` | Whether the item is locked in its inventory slot. |

## Main functions
### `OnEntityReplicated()`
*   **Description:** Initializes the parent link and attaches classified data to the parent's replica component. Assigns `OnRemoveEntity` handler. **Client-side only** — only assigned when `!TheWorld.ismastersim`.
*   **Parameters:** `inst` -- entity instance being replicated
*   **Returns:** None
*   **Error states:** None

### `OnRemoveEntity()`
*   **Description:** Cleans up the parent reference when the classified entity is removed. **Client-side only** — assigned as a handler within `OnEntityReplicated` on client.
*   **Parameters:** `inst` -- entity instance being removed
*   **Returns:** None
*   **Error states:** None

### `SerializePercentUsed(percent)`
*   **Description:** Encodes and sets the `percentused` net variable. Clamps values between 0 and 100. **Server-side only** — only assigned when `TheWorld.ismastersim`.
*   **Parameters:** `percent` -- number representing usage (0 to 1).
*   **Returns:** None
*   **Error states:** None

### `DeserializePercentUsed()`
*   **Description:** Decodes the `percentused` net variable and pushes a change event to the parent. **Client-side only** — only assigned when `!TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SerializePerish(percent)`
*   **Description:** Encodes and sets the `perish` net variable. Clamps values between 0 and 62. **Server-side only** — only assigned when `TheWorld.ismastersim`.
*   **Parameters:** `percent` -- number representing perish progress (0 to 1).
*   **Returns:** None
*   **Error states:** None

### `ForcePerishDirty()`
*   **Description:** Forces a local and network dirty update on the perish variable to trigger refreshes. **Server-side only** — only assigned when `TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `DeserializePerish()`
*   **Description:** Decodes the `perish` net variable and pushes a change event to the parent. **Client-side only** — only assigned when `!TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SerializeRecharge(percent, overtime)`
*   **Description:** Encodes and sets the `recharge` net variable. Handles overtime flag for clamping. **Server-side only** — only assigned when `TheWorld.ismastersim`.
*   **Parameters:**
    - `percent` -- number representing charge (0 to 1)
    - `overtime` -- boolean indicating if overtime logic applies
*   **Returns:** None
*   **Error states:** None




### `DeserializeRecharge()`
*   **Description:** Decodes the `recharge` net variable, triggers dirty check, and pushes a change event to the parent. **Client-side only** — only assigned when `!TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SerializeRechargeTime(t)`
*   **Description:** Encodes and sets the `rechargetime` net variable. Handles nil and infinite values. **Server-side only** — only assigned when `TheWorld.ismastersim`.
*   **Parameters:** `t` -- number representing time in seconds.
*   **Returns:** None
*   **Error states:** None

### `DeserializeRechargeTime()`
*   **Description:** Decodes the `rechargetime` net variable, triggers dirty check, and pushes a change event to the parent. **Client-side only** — only assigned when `!TheWorld.ismastersim`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

## Events & listeners
- **Listens to (on classified entity):** `imagedirty`, `percentuseddirty`, `perishdirty`, `rechargedirty`, `rechargetimedirty`
- **Listens to (on parent entity):** `inventoryitem_stacksizedirty`, `iswetdirty`, `isacidsizzlingdirty`
- **Pushes (to parent entity):** `imagechange`, `percentusedchange`, `perishchange`, `rechargechange`, `rechargetimechange`, `wetnesschange`, `acidsizzlingchange`
- **Pushes (to TheWorld):** `stackitemdirty`