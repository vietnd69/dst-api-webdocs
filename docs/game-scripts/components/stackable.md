---
id: stackable
title: Stackable
description: Manages stacking behavior for inventory items, including size tracking, consolidation, splitting, and propagation of related states like perishability and moisture.
tags: [inventory, stacking, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7599da8c
system_scope: inventory
---

# Stackable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stackable` handles the logic for stacking and splitting inventory items in DST. It maintains a `stacksize` counter and a `maxsize` limit, enforces stacking constraints (including infinite stacking via `SetIgnoreMaxSize`), and supports consolidation of compatible items via `Put()`. It also propagates related states such as perishability (`perishable`), moisture (`inventoryitem`), chill (`edible`), curse (`curseditem`), and charge (`rechargeable`) to newly split stacks.

This component is essential for all stackable prefabs (e.g., wood, stone, food) and integrates tightly with the replica system for network synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stackable")
inst.components.stackable:SetStackSize(5)
if inst.components.stackable:IsFull() then
    print("Stack is full")
end
local item_to_stack = CreateEntity()
item_to_stack:AddComponent("stackable")
item_to_stack.components.stackable:SetStackSize(3)
inst.components.stackable:Put(item_to_stack, Vector3(0,0,0))
```

## Dependencies & tags
**Components used:** `inventoryitem`, `perishable`, `edible`, `curseditem`, `rechargeable`
**Tags:** Adds `applied_curse` on stacking under certain conditions (via `curseditem` interactions); sets `skipspeech` flag temporarily during stack operations.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stacksize` | number | `1` | Current number of items in the stack. Read-only property with setter hook for replication. |
| `maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum allowed stack size. Defaults to a medium item tune. Read-only property with setter hook. |
| `originalmaxsize` | number? | `nil` | Stores the original `maxsize` when infinite mode is active. |

## Main functions
### `SetIgnoreMaxSize(ignoremaxsize)`
*   **Description:** Enables or disables ignoring the `maxsize` limit. When enabled, `maxsize` becomes `math.huge`, and the previous `maxsize` is stored in `originalmaxsize`.
*   **Parameters:** `ignoremaxsize` (boolean) — `true` to ignore max size, `false` to restore the stored original max size.
*   **Returns:** Nothing.

### `IsStack()`
*   **Description:** Indicates whether the item is part of a stack (i.e., more than one item).
*   **Parameters:** None.
*   **Returns:** `true` if `stacksize > 1`; otherwise `false`.

### `StackSize()`
*   **Description:** Returns the current stack size.
*   **Parameters:** None.
*   **Returns:** `number` — current stack size.

### `IsFull()`
*   **Description:** Checks if the stack is at capacity.
*   **Parameters:** None.
*   **Returns:** `true` if `stacksize >= maxsize`; otherwise `false`.

### `IsOverStacked()`
*   **Description:** Indicates whether the stack exceeds the *original* (non-infinite) max size. Useful for detecting overflow during infinite mode.
*   **Parameters:** None.
*   **Returns:** `true` if `stacksize > (originalmaxsize or maxsize)`; otherwise `false`.

### `OnSave()`
*   **Description:** Serialization hook. Returns save data only if stack size is not `1`.
*   **Parameters:** None.
*   **Returns:** `{ stack = number }` if `stacksize ~= 1`; otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Deserialization hook. Loads stack size from `data.stack` and clamps it to `MAXUINT`.
*   **Parameters:** `data` (table) — optional table with `data.stack`.
*   **Returns:** Nothing.
*   **Events:** Pushes `"stacksizechange"` with `{stacksize = number, oldstacksize = 1}`.

### `SetOnDeStack(fn)`
*   **Description:** Registers a callback invoked whenever `Get()` splits a stack.
*   **Parameters:** `fn` (function) — signature: `fn(new_instance, original_instance)`.
*   **Returns:** Nothing.

### `SetStackSize(sz)`
*   **Description:** Sets the stack size directly, clamping to `MAXUINT`.
*   **Parameters:** `sz` (number) — desired stack size.
*   **Returns:** Nothing.
*   **Events:** Pushes `"stacksizechange"` with `{stacksize = sz, oldstacksize = previous_size}`.

### `Get(num)`
*   **Description:** Splits off `num` items (default `1`) into a new prefab instance. Copies relevant component states (perishable, rechargeable, cursed, inventoryitem, etc.).
*   **Parameters:** `num` (number?, default `1`) — number of items to split off.
*   **Returns:** `inst` (new instance) if stack was split; otherwise returns `self.inst` if stack was too small or already `1`.
*   **Error states:** Does *not* modify `self.stacksize` if `num <= 0`; splits at least `1`.

### `RoomLeft()`
*   **Description:** Returns the remaining space in the current stack.
*   **Parameters:** None.
*   **Returns:** `number` — `maxsize - stacksize`.

### `Put(item, source_pos)`
*   **Description:** Attempts to consolidate another item (`item`) into this stack. Updates `perishable`, `inventoryitem`, and `edible` states via dilution logic. Returns leftover item if stack overflows.
*   **Parameters:** `item` (Entity) — item to stack onto this stack; `source_pos` (Vector3?) — position used for inventory pickup synchronization.
*   **Returns:** `item` (Entity) — the leftover item if overflow occurred; otherwise `nil`.
*   **Error states:** Returns early with `nil` if `item.prefab` or `item.skinname` differ.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string for the stack state (e.g., `"5/10"` or `"12/–"` for infinite).
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"{current}/{max}"`, with `originalmaxsize` appended if applicable.

## Events & listeners
- **Pushes:** `stacksizechange` — fired on stack size modifications (e.g., via `SetStackSize`, `Put`, `OnLoad`). Payload: `{stacksize = number, oldstacksize = number, [src_pos = Vector3?]}`
- **Listens to:** None — this component does not register event listeners directly.
