---
id: snowmandecoratable
title: Snowmandecoratable
description: Manages snowman decoration, stacking, hat placement, and state persistence for snowman entities in DST.
tags: [decoration, stacking, entity, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 60d56b8e
system_scope: entity
---

# Snowmandecoratable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Snowmandecoratable` manages decorative items placed on snowmen and snowballs, including stacking behavior, hat equip/unequip, and data serialization for saving/loading. It is attached to snowman and snowball prefabs, and handles interaction with the `snowmandecorating` stategraph. The component coordinates closely with `inventory`, `equippable`, `stackable`, `inventoryitem`, `pushable`, `heavyobstaclephysics`, and `workable` components to manage item consumption, dropping, and physics during stacking or unstacking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("snowman")
inst:AddComponent("snowmandecoratable")
inst.components.snowmandecoratable:SetSize("med")
inst.components.snowmandecoratable:BeginDecorating(player, nil)
-- Decorations are applied via the snowmandecorating stategraph
inst.components.snowmandecoratable:EndDecorating(player)
```

## Dependencies & tags
**Components used:** `inventory`, `equippable`, `stackable`, `inventoryitem`, `pushable`, `heavyobstaclephysics`, `workable`, `inventoryitemmoisture` (via `inventoryitem:InheritWorldWetnessAtTarget`), `inventoryitem` (via `GetGrandOwner` and `OnPutInInventory`)
**Tags:** Checks `waxedplant`, `player`; does not add or remove any tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ismastersim` | boolean | `TheWorld.ismastersim` | `true` on the server or single-player; `false` on dedicated clients. |
| `isdedicated` | boolean | `TheNet:IsDedicated()` | `true` on dedicated server, `false` otherwise. |
| `decors` | table (client only) | `{}` | Array of entity references for visual decorations on the client. |
| `decordata` | net_string | `""` | Networked string encoding serialized decoration data. |
| `basesize` | net_tinybyte | `STACK_IDS.large` | ID of the base snowball size (`small`, `med`, or `large`). |
| `stacks` | net_smallbytearray | `{}` | Array of stack IDs representing upper layers. |
| `stackoffsets` | net_smallbytearray | `{}` | Random offsets for upper layers to prevent perfect alignment. |
| `swapinst` | entity or nil | `nil` | FX entity used when the snowman is equipped as a hat. |
| `hatinst` | entity or nil | `nil` | FX entity for hat visuals on the snowman. |
| `doer` | entity or nil | `nil` | Player currently interacting with the snowman. |
| `range` | number | `3` | Interaction range for auto-closing the decorating session. |
| `melting` | boolean or nil | `nil` | Whether the snowman is currently melting. |

## Main functions
### `CanBeginDecorating(doer)`
* **Description:** Checks whether a given entity (`doer`) is allowed to begin decorating the snowman.
* **Parameters:** `doer` (entity) – the entity attempting to start decorating.
* **Returns:** `true` if decoration can start; otherwise, `false` and a reason string: `"INUSE"` (another player is using it), `"MELTING"`, or `false` if `doer` is busy, heavy-lifting, or pushing the snowman.
* **Error states:** Returns early with `nil` on clients.

### `BeginDecorating(doer, obj)`
* **Description:** Starts a decorating session for `doer`, launching the `snowmandecorating` stategraph.
* **Parameters:** `doer` (entity) – the player decorating; `obj` (entity or nil) – the item initially used to open the decorating screen (e.g., an inventory item).
* **Returns:** `true` if the session began successfully; `false` if already in use.
* **Error states:** Returns `false` on clients.

### `EndDecorating(doer)`
* **Description:** Ends an active decorating session, cleaning up listeners and events.
* **Parameters:** `doer` (entity or nil) – the player ending the session (if `nil`, the current `doer` is used).
* **Returns:** Nothing.
* **Error states:** Returns early on clients.

### `ValidateAndAppendDecorData(doer, olddecordata, newdecordata, basesize, stacks, invobj)`
* **Description:** (Static function, not a method) Validates a new decoration data set against inventory constraints, consumes items, and returns encoded valid decoration data.
* **Parameters:**
  - `doer` (entity) – the player making changes.
  - `olddecordata` (string) – previous encoded decoration data.
  - `newdecordata` (string) – new encoded decoration data to validate.
  - `basesize` (number) – base snowball size ID.
  - `stacks` (table) – current stacks table.
  - `invobj` (entity or nil) – inventory item used to open the decorating screen.
* **Returns:** Encoded string of valid decoration data or `""` if none.
* **Error states:** Returns `olddecordata` unchanged if validation fails.

### `AddDecorData(tbl, itemhash, rot, flip, x, y)`
* **Description:** (Static function) Appends a single decoration record (5 values) to a flat table for encoding.
* **Parameters:**
  - `tbl` (table) – target table.
  - `itemhash` (hash) – item prefab hash.
  - `rot` (number) – animation frame rotation.
  - `flip` (boolean) – whether to flip the animation.
  - `x`, `y` (numbers) – screen-space coordinates.
* **Returns:** Modifies `tbl` in place; no return value.

### `ApplyDecor(decordata, decors, basesize, stacks, stackoffsets, owner, swapsymbol, swapframe, offsetx, offsety)`
* **Description:** Applies decoration visuals based on encoded data and current snowman structure, spawning visual entities and managing the `highlightchildren` array.
* **Parameters:** As listed in function signature.
* **Returns:** `true` if decorations were applied; `false` otherwise.
* **Error states:** Cleans up old decoration entities before re-applying.

### `GetSize()`
* **Description:** Returns the human-readable name (`"small"`, `"med"`, or `"large"`) of the snowman’s base size.
* **Parameters:** None.
* **Returns:** `string`.

### `SetSize(size)`
* **Description:** Sets the snowman’s base size by name.
* **Parameters:** `size` (string) – one of `"small"`, `"med"`, `"large"`.
* **Returns:** Nothing.

### `CanStack(doer, obj)`
* **Description:** Checks whether the snowman can accept stacking with another snowman (`obj`).
* **Parameters:**
  - `doer` (entity) – player performing the action.
  - `obj` (entity) – another snowman or snowball to stack on top.
* **Returns:** `true` if stacking is allowed; otherwise, `false` and a reason: `"HASHAT"`, `"STACKEDTOOHIGH"`, or `"INUSE"`.

### `Stack(doer, obj)`
* **Description:** Adds `obj` as a new stack layer on top of the snowman and consumes it.
* **Parameters:**
  - `doer` (entity) – player performing the action.
  - `obj` (entity) – snowman or snowball entity to stack.
* **Returns:** Nothing.
* **Error states:** Removes `obj` from the world and updates `stacks` and `stackoffsets` only on the server.

### `Unstack(isdestroyed)`
* **Description:** Unstacks all upper layers and, if the base becomes a snowball, replaces the entity with a `snowball_item`.
* **Parameters:** `isdestroyed` (boolean) – if `true`, drops snowmen instead of snowballs when unstacking.
* **Returns:** Nothing.

### `HasHat()`
* **Description:** Returns whether a hat is equipped on this snowman.
* **Parameters:** None.
* **Returns:** `true` or `false`.
* **Error states:** Returns `nil` on clients.

### `EquipHat(hat)`
* **Description:** Equips a hat item onto the snowman’s hat FX entity.
* **Parameters:** `hat` (entity) – must be equipped to `EQUIPSLOTS.HEAD`.
* **Returns:** Nothing.
* **Error states:** Returns early on clients; only one hat can be equipped at a time.

### `UnequipHat()`
* **Description:** Removes and drops any hat equipped on the snowman.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetMelting(melting)`
* **Description:** Sets or clears the melting state, preventing decoration attempts while melting.
* **Parameters:** `melting` (boolean).
* **Returns:** Nothing.

### `IsMelting()`
* **Description:** Returns whether the snowman is currently melting.
* **Parameters:** None.
* **Returns:** `true`, `false`, or `nil`.

### `DoRefreshDecorData()`
* **Description:** (Client only) Rebuilds visual decoration entities based on `decordata`.
* **Parameters:** None.
* **Returns:** `true` if visuals were applied; `false` otherwise.

### `LoadDecorData(decordata)`
* **Description:** Loads decoration data (typically from save) and refreshes visuals.
* **Parameters:** `decordata` (string) – encoded decoration data.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Prepares data for saving (decorations, stacks, hat, hat frame).
* **Parameters:** None.
* **Returns:** `data` (table) and optional `references` (table of ents) for serialization.

### `OnLoad(data, newents)`
* **Description:** Loads and applies saved decoration, stack, and hat data.
* **Parameters:**
  - `data` (table) – saved component data.
  - `newents` (table) – new entity mapping for save record loading.
* **Returns:** Nothing.

### `TransferComponent(newinst)`
* **Description:** Transfers component state to a new snowman entity instance (e.g., during unstacking).
* **Parameters:** `newinst` (entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to (server/client):**  
  - `equipped`, `unequipped`, `enterlimbo` (server only)  
  - `decordatadirty`, `stacksdirty` (client only)  
- **Pushes:**  
  - None directly (uses networked setters like `net_string:value()`, `net_tinybyte:set()`, etc., to propagate changes).  
- **Internal callbacks:**  
  - `OnDecorDataDirty_Client`, `OnStacksDirty_Client` – trigger local refresh on clients.  
  - `onclosepopup`, `onclosesnowman` – fire when the decorating popup closes.
