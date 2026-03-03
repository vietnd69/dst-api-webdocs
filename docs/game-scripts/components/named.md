---
id: named
title: Named
description: Assigns and manages a custom display name for an entity, including support for formatting, author tracking, and network replication.
tags: [entity, name, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 96e9e92b
system_scope: entity
---

# Named

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `named` component allows an entity to have a custom display name, optionally formatted using a format string, and optionally attributed to a specific user (via their net ID). It synchronizes the name and author information across the network using `self.inst.replica.named`. When no name is set, the component defaults to using the prefab's localized name from `STRINGS.NAMES`. It is typically added to prefabs that benefit from player-facing identification, such as items, pets, or structures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("named")

-- Set a custom name with author
inst.components.named:SetName("My Special Hat", "PlayerName")

-- Assign a random name from a list
inst.components.named.possiblenames = { "Fred", "Glorp", "Zzz" }
inst.components.named:PickNewName()

-- Access the resolved name
local displayName = inst.name
```

## Dependencies & tags
**Components used:** `replica.named` (via `self.inst.replica.named:SetName(...)`), `TheNet` (via `TheNet:GetNetIdForUser(...)`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `possiblenames` | table or `nil` | `nil` | List of candidate strings to randomly choose from when `PickNewName()` is called. |
| `nameformat` | string or `nil` | `nil` | Optional format string (e.g., `"Name: %s"`) used to derive the final display name. If `nil`, `self.name` is used directly. |
| `name` | string or `nil` | `nil` | The base name string, or `nil` to trigger fallback to the prefab's default name. |
| `name_author_netid` | number or `nil` | `nil` | The network user ID (platform ID) of the user who named the entity. |

## Main functions
### `PickNewName()`
*   **Description:** Selects a random name from `self.possiblenames` (if non-empty) and applies it via `DoSetName`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `self.possiblenames` is `nil` or empty.

### `SetName(name, author)`
*   **Description:** Sets the entity's display name and author (if provided). If `name` is `nil`, falls back to the default prefab name from `STRINGS.NAMES`. Updates `inst.name` and synchronizes via `replica.named`.
*   **Parameters:**  
    `name` (string or `nil`) – Custom name or `nil` to use default.  
    `author` (string or `nil`) – Username whose net ID should be recorded. If provided, converted to net ID via `TheNet:GetNetIdForUser(author)`.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns a serializable table containing `name`, `nameformat`, and `name_author_netid` if a custom name is set; otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` – A table with keys `name`, `nameformat`, and `name_author_netid` if `self.name` is not `nil`; otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Restores name state from `data` (typically provided by `OnSave`) and re-applies it. Does nothing if `data` or `data.name` is `nil`.
*   **Parameters:**  
    `data` (table or `nil`) – Save data table containing `name`, `nameformat`, and optionally `name_author_netid`.
*   **Returns:** Nothing.

## Events & listeners
None identified
