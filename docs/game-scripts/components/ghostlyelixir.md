---
id: ghostlyelixir
title: Ghostlyelixir
description: This component enables an item to function as a ghostly elixir by applying predefined effects to eligible targets upon use.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 40f16510
---

# Ghostlyelixir

## Overview
The `GhostlyElixir` component allows an entity (typically a consumable item) to serve as a ghostly elixir, enabling custom application logic defined via a callback function (`doapplyelixerfn`) to be executed on a target entity. It also manages the elixir's removal after successful use and ensures it is tagged appropriately for identification.

## Dependencies & Tags
- **Tags added:** `"ghostlyelixir"`
- **Dependencies:** Relies on the target entity having a `ghostlyelixirable` component (to determine valid recipients via `GetApplyToTarget`). If used on an `elixir_drinker`, it retrieves the actual owner from the `inventoryitem` component. May interact with `stackable` to reduce stack count or remove the item entirely.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity this component is attached to (the elixir item). |
| `doapplyelixerfn` | `function?` | `nil` | Optional callback function invoked during `Apply`, with signature `(elixir, doer, target) → success: boolean, reason: string?`. Controls the actual effect logic. |

> Note: `doapplyelixerfn` is not initialized in `_ctor`; it is expected to be set externally after component construction.

## Main Functions

### `Apply(doer, target)`
* **Description:** Executes the elixir's effect on the specified target. If the target has the `"elixir_drinker"` tag, resolves the true owner via the `inventoryitem` component. Delegates target selection to the `ghostlyelixirable` component on the target. If a valid target is identified and `doapplyelixerfn` is defined, invokes the callback. On successful application, consumes the elixir (either decrementing stack or full removal).
* **Parameters:**
  - `doer`: The entity performing the application (often the player).
  - `target`: The proposed target entity (may be an `elixir_drinker` holding the elixir, in which case the owner becomes the actual target).

### `OnRemoveFromEntity()`
* **Description:** Cleans up by removing the `"ghostlyelixir"` tag when the component is detached from its entity.
* **Parameters:** None.

## Events & Listeners
None identified.