---
id: hudindicatablemanager
title: Hudindicatablemanager
description: Manages a collection of HUD-indicatable items on the client side for display purposes.
tags: [hud, client, ui, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 53228663
system_scope: ui
---

# Hudindicatablemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hudindicatablemanager` is a client-only component that tracks items which are eligible to be displayed on the HUD (e.g., via indicator icons or markers). It maintains a registry of such items keyed by their GUID and is intended for use only in multiplayer clients (excluded on dedicated servers, as enforced by an assertion). The component does not perform networking or logic itself but serves as a local store for HUD-relevant entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hudindicatablemanager")

-- Register an item (e.g., a quest target or collectible)
inst.components.hudindicatablemanager:RegisterItem(item)

-- Unregister when no longer needed
inst.components.hudindicatablemanager:UnRegisterItem(item)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | Reference to the entity instance the component is attached to. |
| `items` | table | `{}` | Dictionary mapping item GUIDs to item entities; holds tracked items. |

## Main functions
### `RegisterItem(item)`
*   **Description:** Registers an item in the manager's internal list, provided it is not already present. Used to add an entity to the HUD-indicatable set.
*   **Parameters:** `item` (entity) — the entity to register; must have a `GUID` field.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the item's GUID already exists in `self.items`.

### `UnRegisterItem(item)`
*   **Description:** Removes an item from the internal list if it exists. Used to prevent further HUD display of the item.
*   **Parameters:** `item` (entity or `nil`) — the entity to unregister; may be `nil`, in which case no action is taken.
*   **Returns:** Nothing.
*   **Error states:** No effect if `item` is `nil` or its GUID is not registered.

### `OnSave()`
*   **Description:** Save callback; currently returns an empty table and performs no persistent storage.
*   **Parameters:** None.
*   **Returns:** `{}` — an empty data table (for compatibility with save/load systems).
*   **Error states:** None.

### `OnLoad(data)`
*   **Description:** Load callback; currently ignores any loaded data and takes no action.
*   **Parameters:** `data` (table or `nil`) — the saved data to load; unused.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Debug helper; always returns `nil` due to an unconditional early return.
*   **Parameters:** None.
*   **Returns:** `nil`.

## Events & listeners
None identified
