---
id: reader
title: Reader
description: Enables an entity to read books and track bookworm status and sanity penalties.
tags: [reading, sanity, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1752eef4
system_scope: entity
---

# Reader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Reader` allows an entity to interact with books by reading them or perusing them. It maintains state for whether the entity is an aspiring bookworm, manages a custom sanity penalty multiplier, and supports a configurable callback for post-read logic. It adds and removes the `reader` and `aspiring_bookworm` tags on the owning entity as appropriate.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("reader")
inst.components.reader:SetAspiringBookworm(true)
inst.components.reader:SetSanityPenaltyMultiplier(0.5)
inst.components.reader:SetOnReadFn(function(reader, book)
    print("Book read successfully")
end)
```

## Dependencies & tags
**Components used:** None (only uses external APIs like `SpawnPrefab` via `book.components.book`)
**Tags:** Adds `reader` on construction; adds/removes `aspiring_bookworm` based on state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `aspiring_bookworm` | boolean | `false` | Whether the entity is an aspiring bookworm (affects reading behavior). |
| `sanity_mult` | number | `1` | Multiplier applied to sanity effects from reading. |
| `onread` | function | `nil` | Optional callback invoked after successful reading. |

## Main functions
### `SetAspiringBookworm(bookworm)`
*   **Description:** Sets whether the entity is an aspiring bookworm. When true, the entity peruses books instead of reading them fully.
*   **Parameters:** `bookworm` (boolean) - `true` to set aspiring bookworm status.
*   **Returns:** Nothing.

### `IsAspiringBookworm()`
*   **Description:** Returns the current aspiring bookworm status.
*   **Parameters:** None.
*   **Returns:** `true` if aspiring bookworm, otherwise `false`.

### `SetSanityPenaltyMultiplier(mult)`
*   **Description:** Sets the multiplier used to scale sanity penalties when reading.
*   **Parameters:** `mult` (number) - the multiplier (e.g., `0.5` halves sanity loss).
*   **Returns:** Nothing.

### `GetSanityPenaltyMultiplier()`
*   **Description:** Returns the current sanity penalty multiplier.
*   **Parameters:** None.
*   **Returns:** number - the multiplier (default `1` if not set).

### `SetOnReadFn(fn)`
*   **Description:** Assigns a custom callback to run after a successful book read.
*   **Parameters:** `fn` (function) - function with signature `fn(reader, book)`.
*   **Returns:** Nothing.

### `Read(book)`
*   **Description:** Attempts to read (or peruse) a book, using the book's `book` component logic. If the reader is an aspiring bookworm, only peruses; otherwise, reads fully and invokes `onread` callback if defined.
*   **Parameters:** `book` (entity) - the book entity to read.
*   **Returns:** 
    * If aspiring: `true`/`false` (result of `book.components.book:OnPeruse`).
    * If not aspiring: `success` (boolean), `reason` (string, optional) from `book.components.book:OnRead`.
*   **Error states:** Returns `nil` if `book.components.book` is missing or the book is unreadable.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

## Notes
- The `reader` tag is automatically added on construction and removed on entity removal.
- The `onaspiringbookworm` callback ensures the `aspiring_bookworm` tag stays in sync with the internal state.
