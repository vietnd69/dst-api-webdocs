---
id: discoverable
title: Discoverable
description: Manages the discovery state and visual representation (icon) of an entity on the minimap and UI.
tags: [minimap, ui, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1fdb1aaf
system_scope: ui
---

# Discoverable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Discoverable` tracks whether an entity has been discovered by the player and updates its minimap icon accordingly. When the entity is clicked and not yet discovered, it triggers the discovery process. This component is typically used on static or interactive world entities (e.g., resources, structures) that appear on the minimap in a hidden state until interacted with.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("discoverable")
inst.components.discoverable:SetIcons("icon_undiscovered.tex", "icon_discovered.tex")
-- Later, upon first interaction (e.g., mouse click), Discover() is called automatically
```

## Dependencies & tags
**Components used:** `MiniMapEntity`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `discovered` | boolean | `false` | Whether the entity has been discovered. |
| `undiscoveredIcon` | string or nil | `nil` | Icon asset path used when undiscovered. |
| `discoveredIcon` | string or nil | `nil` | Icon asset path used when discovered. |

## Main functions
### `Discover()`
* **Description:** Marks the entity as discovered and updates its minimap icon to the discovered state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if already discovered.

### `Hide()`
* **Description:** Marks the entity as undiscovered and reverts its minimap icon to the undiscovered state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIcons(undiscovered, discovered)`
* **Description:** Assigns the icon assets for the undiscovered and discovered states, then resets the current icon to the undiscovered state.
* **Parameters:**  
  `undiscovered` (string or nil) – Icon asset path for the undiscovered state.  
  `discovered` (string or nil) – Icon asset path for the discovered state.  
* **Returns:** Nothing.
* **Error states:** If `undiscovered` or `discovered` are `nil`, the icon is cleared; no runtime errors occur.

## Events & listeners
- **Listens to:** `onclick` – triggers `Discover()` if the entity is not yet discovered.
- **Pushes:** None.
