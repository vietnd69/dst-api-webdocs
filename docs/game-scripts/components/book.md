---
id: book
title: Book
description: Manages the unique actions, sanity effects, and visual feedback for readable book items.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
---

# Book

## Overview
The `book` component is attached to items that can be read by characters, such as "Birds of the World" or "On Tentacles". It provides a framework for defining two primary interactions: perusing (a quick look) and reading (the full action). The component manages consuming the book's uses, applying sanity changes to the reader, and spawning unique visual effects upon being read. Specific book behaviors are defined by setting custom `onperuse` and `onread` functions.

## Dependencies & Tags
**Dependencies:**
* `finiteuses`: The component relies on this to manage the number of times the book can be used.

**Tags:**
* None identified.

## Properties
The component's main properties are configured via setter functions rather than directly in a constructor.

| Property        | Type     | Default Value | Description                                                                                    |
| --------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `onperuse`      | function | `nil`         | The callback function executed when a character peruses the book.                              |
| `onread`        | function | `nil`         | The callback function executed when a character fully reads the book.                          |
| `read_sanity`   | number   | `nil`         | The amount of sanity gained or lost when the book is read.                                     |
| `peruse_sanity` | number   | `nil`         | The amount of sanity gained or lost when the book is perused.                                  |
| `fx`            | string   | `nil`         | The prefab name for the visual effect to spawn when read by a character on foot.               |
| `fxmount`       | string   | `nil`         | The prefab name for the visual effect to spawn when read by a mounted character. Defaults to `fx`. |

## Main Functions

### `SetOnPeruse(fn)`
* **Description:** Sets the callback function that is triggered when a character peruses the book.
* **Parameters:**
    * `fn`: A function that takes the book `inst` and the `reader` entity as arguments. It should return `true` on success.

### `SetOnRead(fn)`
* **Description:** Sets the callback function that is triggered when a character reads the book.
* **Parameters:**
    * `fn`: A function that takes the book `inst` and the `reader` entity as arguments. It should return `true` on success.

### `SetReadSanity(sanity)`
* **Description:** Sets the base sanity change that occurs when the book is successfully read.
* **Parameters:**
    * `sanity`: A number representing the sanity delta.

### `SetPeruseSanity(sanity)`
* **Description:** Sets the sanity change that occurs when the book is successfully perused.
* **Parameters:**
    * `sanity`: A number representing the sanity delta.

### `SetFx(fx, fxmount)`
* **Description:** Defines the visual effect prefabs to spawn when the book is read.
* **Parameters:**
    * `fx`: A string representing the prefab name for the standard visual effect.
    * `fxmount`: (Optional) A string for the visual effect prefab to use when the reader is mounted. If not provided, it defaults to the `fx` value.

### `ConsumeUse()`
* **Description:** If the entity has a `finiteuses` component, this function will consume one use.

### `OnPeruse(reader)`
* **Description:** Executes the "peruse" action. This involves running the `onperuse` callback, consuming a use if successful, and applying the `peruse_sanity` delta to the reader.
* **Parameters:**
    * `reader`: The entity instance that is perusing the book.

### `DoReadPenalties(reader)`
* **Description:** Applies the sanity penalty for reading the book, factoring in any multipliers from the reader's `reader` component (e.g., Wickerbottom's penalty for non-Wickerbottom readers). This can be called independently of the main `OnRead` action.
* **Parameters:**
    * `reader`: The entity instance that is reading the book.

### `OnRead(reader)`
* **Description:** Executes the full "read" action. This runs the `onread` callback, and on success, it consumes a use, spawns the appropriate visual effect (`fx` or `fxmount`), and applies sanity penalties via `DoReadPenalties`.
* **Parameters:**
    * `reader`: The entity instance that is reading the book.