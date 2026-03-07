---
id: book
title: Book
description: Manages interactive reading and perusing behavior for books, including sanity effects, use consumption, and optional visual FX.
tags: [inventory, sanity, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a2339ec1
system_scope: entity
---

# Book

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Book` is a lightweight component that encapsulates the behavior of interactive reading and perusing actions for book-like items. It does not store complex state itself but acts as a container for callback functions (`onperuse`, `onread`) and sanity values (`peruse_sanity`, `read_sanity`). When a player interacts with the book, it optionally consumes a use (if the entity has `finiteuses`), triggers callbacks, and applies sanity deltas. It also supports spawning visual FX on read, with separate support for mounted (`fxmount`) and unmounted (`fx`) states.

This component relies on several other components: `finiteuses` for charge tracking, `reader` for sanity penalty multipliers, `rider` for detecting mounting status, and `sanity` for applying effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("book")
inst:AddComponent("finiteuses")
inst:AddComponent("reader")
inst:AddComponent("sanity")

inst.components.book:SetReadSanity(-15)
inst.components.book:SetPeruseSanity(-2)
inst.components.book:SetOnRead(function(book, reader)
    -- Custom read logic (e.g., apply perk)
    return true
end)
inst.components.book:SetOnPeruse(function(book, reader)
    -- Custom peruse logic (e.g., preview page)
    return true
end)
```

## Dependencies & tags
**Components used:** `finiteuses`, `reader`, `rider`, `sanity`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onperuse` | function or `nil` | `nil` | Callback invoked on peruse. Signature: `fn(book, reader) → success, reason`. |
| `onread` | function or `nil` | `nil` | Callback invoked on read. Signature: `fn(book, reader) → success, reason`. |
| `peruse_sanity` | number | `0` | Sanity delta applied on successful peruse. |
| `read_sanity` | number | `0` | Base sanity delta applied on successful read (scaled by reader penalty multiplier). |
| `fx` | string or `nil` | `nil` | Prefab name for FX to spawn on unmounted read. |
| `fxmount` | string or `nil` | Same as `fx` | Prefab name for FX to spawn on mounted read. |

## Main functions
### `SetOnPeruse(fn)`
* **Description:** Sets the callback function executed when a player peruses the book.
* **Parameters:** `fn` (function or `nil`) – a function taking `(book, reader)` as arguments and returning `success` (boolean) and optionally `reason` (string).
* **Returns:** Nothing.

### `SetOnRead(fn)`
* **Description:** Sets the callback function executed when a player reads the book.
* **Parameters:** `fn` (function or `nil`) – a function taking `(book, reader)` as arguments and returning `success` (boolean) and optionally `reason` (string).
* **Returns:** Nothing.

### `SetPeruseSanity(sanity)`
* **Description:** Sets the sanity delta applied on successful peruse.
* **Parameters:** `sanity` (number) – sanity change to apply (negative reduces sanity).
* **Returns:** Nothing.

### `SetReadSanity(sanity)`
* **Description:** Sets the base sanity delta applied on successful read, before multiplier scaling.
* **Parameters:** `sanity` (number) – base sanity change to apply (negative reduces sanity).
* **Returns:** Nothing.

### `SetFx(fx, fxmount)`
* **Description:** Configures visual FX to spawn on read. If `fxmount` is omitted, it defaults to `fx`, and non-mounted FX will be converted to six-faced orientation.
* **Parameters:**  
  - `fx` (string) – prefab name of FX to spawn on unmounted read.  
  - `fxmount` (string or `nil`) – prefab name of FX to spawn on mounted read.
* **Returns:** Nothing.

### `ConsumeUse()`
* **Description:** Decrements the entity’s `finiteuses` component by one, if the component exists.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `finiteuses` component is not present.

### `Interact(fn, reader)`
* **Description:** Invokes the given callback `fn`, and on success, consumes one use. Used internally by `OnPeruse` and `OnRead`.
* **Parameters:**  
  - `fn` (function or `nil`) – callback to execute.  
  - `reader` (Entity) – the entity performing the action (typically the player).
* **Returns:**  
  - `success` (boolean) – whether the callback executed successfully (returned true).  
  - `reason` (string or `nil`) – optional failure reason returned by `fn`.

### `OnPeruse(reader)`
* **Description:** Handles the full peruse flow: invoke peruse callback, consume use on success, then apply peruse sanity delta.
* **Parameters:** `reader` (Entity) – the entity performing the peruse.
* **Returns:** `success` (boolean) – result of the interaction.
* **Error states:** If `reader.components.sanity` is absent, no sanity delta is applied.

### `DoReadPenalties(reader)`
* **Description:** Applies the read sanity delta scaled by the reader’s sanity penalty multiplier. Intended for situations (e.g., lunar hail failure) where read is forced but penalties still apply.
* **Parameters:** `reader` (Entity) – the entity reading.
* **Returns:** Nothing.

### `OnRead(reader)`
* **Description:** Handles the full read flow: invoke read callback, consume use on success, spawn FX (scaled by mounting), and apply read sanity penalties.
* **Parameters:** `reader` (Entity) – the entity performing the read.
* **Returns:**  
  - `success` (boolean) – whether the interaction succeeded.  
  - `reason` (string or `nil`) – optional failure reason.
* **Error states:**  
  - FX is only spawned if `success` is true.  
  - If `reader.components.rider` is absent, the unmounted `fx` is used regardless.  
  - If `fx` is `nil`, no FX spawns.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified. (Sanity delta events are pushed by `sanity.DoDelta`, not this component.)
