---
id: simplebook
title: Simplebook
description: Provides a read interaction for simple books, triggering a custom callback when read by an entity.
tags: [interaction, inventory, book]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 78df29c0
system_scope: entity
---

# Simplebook

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Simplebook` enables an entity to function as a simple readable book. It adds the `simplebook` tag to its owner and defines a `Read` function that checks visibility and invokes a customizable callback (`onreadfn`) when the book is successfully read. This component is typically used for journal entries, instructions, or narrative items that require no state persistence beyond a one-time read event.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("simplebook")
inst.components.simplebook.onreadfn = function(book, doer)
    print(doer.prefab .. " read " .. book.prefab)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `simplebook`; removes `simplebook` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onreadfn` | function or `nil` | `nil` | Callback invoked when the book is read successfully. Signature: `function(book_inst, reader_inst)`. |

## Main functions
### `Read(doer)`
*   **Description:** Attempts to read the book. Verifies that the reader can see the book, then executes the `onreadfn` callback if present.
*   **Parameters:** `doer` (entity) - The entity performing the read action.
*   **Returns:** `false` if visibility check fails; otherwise, no return value (callback may return arbitrarily).
*   **Error states:** Returns `false` early if `CanEntitySeeTarget(doer, self.inst)` evaluates to `false`.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when the component is removed from its entity. Removes the `simplebook` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified
