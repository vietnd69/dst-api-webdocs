---
id: inventoryitem_classified
title: Inventoryitem Classified
description: Manages networked classification and serialization of inventory item properties such as spoilage, charge state, and deployment metadata in a dedicated Classified entity.
tags: [network, inventory, serialization]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 90479663
system_scope: network
---

# Inventoryitem Classified

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`inventoryitem_classified` is a lightweight, dedicated Classified entity that holds and synchronizes server-authoritative metadata for inventory items. It is not a component but a separate prefab (`inventoryitem_classified`) instantiated to represent the classification data of an inventory item. It handles serialization/deserialization of properties like spoilage (`percentused`, `perish`), charge state (`recharge`, `rechargetime`), and deployment/equipment constraints (`deploymode`, `deployrestrictedtag`, `equiprestrictedtag`). The classified entity is attached to a parent inventory item entity via `_parent` reference and exposes methods for syncing state across the client-server boundary using DST's replication primitives (`net_hash`, `net_byte`, etc.). It plays a crucial role in ensuring accurate display of item state (e.g., food spoilage percentage, tool charge level) on all clients.

## Usage example
```lua
-- On the server, when creating a classified entity for an inventory item:
local classified = Prefab("inventoryitem_classified", fn)()
classified._parent = my_item_inst
classified:OnEntityReplicated()

-- Later, to update and sync spoilage:
classified:SerializePercentUsed(0.75) -- 75% used
classified:PushEvent("percentuseddirty")

-- Or to update recharge time:
classified:SerializeRechargeTime(300) -- 300 seconds
classified:PushEvent("rechargetimedirty")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `CLASSIFIED` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `image` | `net_hash` | `0` | Networked hash for the item's image/tile index. |
| `atlas` | `net_hash` | `0` | Networked hash for the item's atlas name. |
| `cangoincontainer` | `net_bool` | `true` | Whether the item can be placed in a container. |
| `canonlygoinpocket` | `net_bool` | `false` | Restricts placement to pockets only. |
| `canonlygoinpocketorpocketcontainers` | `net_bool` | `false` | Restricts placement to pockets or pocket containers. |
| `src_pos` | `table` | `{ isvalid = false, x = 0, z = 0 }` | Networked source placement coordinates (grid position). |
| `percentused` | `net_byte` | `255` | Replicated percentage (0–100) of item usage; `255` means invalid/unset. |
| `perish` | `net_smallbyte` | `63` | Replicated spoilage percentage (0–62); `63` means invalid/unset. |
| `recharge` | `net_byte` | `255` | Replicated charge level (0–180); `255` means invalid/unset. |
| `rechargetime` | `net_float` | `-2` | Replicated recharge time in seconds; `-2` invalid, `-1` infinite, `>= 0` actual time. |
| `_parent` | `Entity?` | `nil` | Reference to the parent inventory item entity; set during `OnEntityReplicated`. |

## Main functions
### `SerializePercentUsed(inst, percent)`
* **Description:** Serializes the item’s usage percentage (`percent`) into the `percentused` network variable. Handles special values: `nil` → `255`, `<= 0` → `0`, and clamped `1–100`.
* **Parameters:** `percent` (number?) - Usage percentage (0.0–1.0) or `nil`.
* **Returns:** Nothing.

### `DeserializePercentUsed(inst)`
* **Description:** Reads the server-valued `percentused` and pushes `percentusedchange` event to parent with `percent = value / 100`. Skips if value is `255`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SerializePerish(inst, percent)`
* **Description:** Serializes spoilage percentage (`percent`) into `perish` using range `0–62`. Maps `percent * 62`, clamped, and sets `63` for invalid/unset.
* **Parameters:** `percent` (number) - Spoilage percentage (0.0–1.0).
* **Returns:** Nothing.

### `ForcePerishDirty(inst)`
* **Description:** Forces a client-side refresh of the `perish` value (used when spoilage crosses ~20%/~50% thresholds).
* **Parameters:** None.
* **Returns:** Nothing.

### `DeserializePerish(inst)`
* **Description:** Reads `perish`, converts to percentage (`value / 62`), and pushes `perishchange` event if `perish ≠ 63`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SerializeRecharge(inst, percent, overtime)`
* **Description:** Serializes charge state (`percent`) into `recharge`. Maps `percent * 180`, clamped `0–179`, or special values: `nil` → `255`, `<= 0` → `0`, `>= 1` → `180`. Uses `set_local` for `overtime` states.
* **Parameters:** `percent` (number?) - Charge level (0.0–1.0); `overtime` (boolean) - Whether charging beyond full capacity.
* **Returns:** Nothing.

### `DeserializeRecharge(inst)`
* **Description:** Reads `recharge`, triggers `OnRechargeDirty` (starts recharge tick if needed), and pushes `rechargechange` event with `percent = value / 180`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SerializeRechargeTime(inst, t)`
* **Description:** Serializes recharge time (`t`) to `rechargetime`. Maps `t = nil` → `-2`, `t = math.huge` → `-1`, else `t`.
* **Parameters:** `t` (number?) - Recharge time in seconds or special value.
* **Returns:** Nothing.

### `DeserializeRechargeTime(inst)`
* **Description:** Reads `rechargetime`, triggers `OnRechargeDirty`, and pushes `rechargetimechange` event with `t` (converted `-2/-1` → `nil/math.huge`).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityReplicated(inst)`
* **Description:** Initializes `_parent` from `entity:GetParent()`, registers `OnRemoveEntity`, and attempts to attach this classified entity to the parent’s replica via `TryAttachClassifiedToReplicaComponent`. If attachment fails, sets `_parent.inventoryitem_classified = inst`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Prints warning to console if `_parent` is `nil`.

### `OnImageDirty(inst)`
* **Description:** Pushes `imagechange` event to parent when `imagedirty` occurs (e.g., item texture/icon updated).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `imagedirty` → `OnImageDirty`  
  - `percentuseddirty` → `DeserializePercentUsed`  
  - `perishdirty` → `DeserializePerish`  
  - `rechargedirty` → `DeserializeRecharge`  
  - `rechargetimedirty` → `DeserializeRechargeTime`  
  - `inventoryitem_stacksizedirty` → `OnStackSizeDirty` (with `inst._parent` as listener context)  
  - `iswetdirty` → `OnIsWetDirty` (with `inst._parent` as listener context)  
  - `isacidsizzlingdirty` → `OnIsAcidSizzlingDirty` (with `inst._parent` as listener context)  
- **Pushes:**  
  - `percentusedchange` with `{ percent = ... }`  
  - `perishchange` with `{ percent = ... }`  
  - `rechargechange` with `{ percent = ..., overtime = ...? }`  
  - `rechargetimechange` with `{ t = ... }`  
  - `imagechange`  
  - `wetnesschange`  
  - `acidsizzlingchange`  
