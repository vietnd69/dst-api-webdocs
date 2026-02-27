---
id: reader
title: Reader
description: Manages reading interactions for an entity, including support for aspiring bookworm behavior and custom read callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1752eef4
---

# Reader

## Overview
The `Reader` component enables an entity to perform reading actions on books. It provides logic to handle standard reading, aspiring bookworm perusing (bypassing normal read restrictions), and custom post-read behavior through a callback. It automatically tags the owning entity as a "reader" upon initialization and manages the "aspiring_bookworm" tag dynamically.

## Dependencies & Tags
- Adds tag `"reader"` to the entity on construction.
- Adds/removes tag `"aspiring_bookworm"` via the `onaspiringbookworm` callback.
- Requires the target book entity to have a `book` component for reading operations.
- On removal from entity, removes both `"reader"` and `"aspiring_bookworm"` tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity owning this component (set in constructor). |
| `aspiring_bookworm` | `boolean` | `nil` | Controls whether the entity reads books as an "aspiring bookworm" (uses `OnPeruse` instead of `OnRead`). Set via `SetAspiringBookworm()`. |
| `sanity_mult` | `number` | `nil` | Multiplier applied to sanity penalties during reading (used internally by game logic; initialized only when set via `SetSanityPenaltyMultiplier()`). |
| `onread` | `function` | `nil` | Optional callback invoked after a successful standard read. Set via `SetOnReadFn()`. |

## Main Functions
### `Read(book)`
* **Description:** Initiates a reading action on the provided book entity. If the entity is an aspiring bookworm, it calls `book:OnPeruse()`. Otherwise, it calls `book:OnRead()` and triggers the `onread` callback if successful.
* **Parameters:**
  - `book`: An entity with a `book` component.

### `SetAspiringBookworm(bookworm)`
* **Description:** Sets whether this reader acts as an aspiring bookworm, which modifies reading behavior and toggles the `"aspiring_bookworm"` entity tag.
* **Parameters:**
  - `bookworm` (`boolean`): `true` to enable aspiring bookworm mode, `false` to disable.

### `IsAspiringBookworm()`
* **Description:** Returns whether the reader is currently in aspiring bookworm mode.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if aspiring bookworm mode is active, otherwise `false`.

### `SetSanityPenaltyMultiplier(mult)`
* **Description:** Sets the multiplier applied to sanity penalties during reading interactions.
* **Parameters:**
  - `mult` (`number`): Sanity penalty scaling factor.

### `GetSanityPenaltyMultiplier()`
* **Description:** Returns the currently set sanity penalty multiplier.
* **Parameters:** None.
* **Returns:** `number` — The multiplier, defaulting to `1` if not set.

### `SetOnReadFn(fn)`
* **Description:** Assigns a callback function to be executed after a successful standard (non-peruse) read operation.
* **Parameters:**
  - `fn` (`function`): A function with signature `fn(reader_inst, book_inst)`.

## Events & Listeners
- Listens for the `"onaspiringbookworm"` event on the entity. Triggers the internal `onaspiringbookworm` handler to add/remove the `"aspiring_bookworm"` tag.
- No events are pushed by this component.