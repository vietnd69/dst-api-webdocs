---
id: carnivaldecor_figure
title: Carnivaldecor Figure
description: Creates a carnival-themed decorative statue that can be deployed in the world and yields loot when hammered.
tags: [decor, loot, deployment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e66a7480
system_scope: world
---

# Carnivaldecor Figure

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnivaldecor_figure` is a deployable decorative structure that appears as a blind-box-style statue in DST. It supports seasonal variants (Season 1 and Season 2), each with weighted shapes and rarities. When deployed, it randomly selects a shape and rarity; hammering it breaks it open, playing an unwrap effect, dropping loot, and removing the entity. It integrates with the `carnivaldecor`, `inspectable`, `lootdropper`, and `workable` components and supports save/load via `OnSave`/`OnLoad` callbacks.

## Usage example
```lua
-- Example: deploy and break a carnival figure programmatically
local figure = CreateEntity()
figure.entity:AddTransform()
figure.entity:AddAnimState()
figure.entity:AddSoundEmitter()
figure.entity:AddNetwork()
-- ... (full setup handled by prefab fn; typically not invoked directly)
```

## Dependencies & tags
**Components used:** `carnivaldecor`, `inspectable`, `lootdropper`, `workable`
**Tags added:** `carnivaldecor`, `structure`, `blindbox_rare`, `blindbox_uncommon`, or `blindbox_common` (based on shape/rarity)
**Tags checked:** `blindbox_rare`, `blindbox_uncommon`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `carnival_season` | number | `1` or `2` | Season variant identifier used to select shape/rarity mapping. |
| `shape` | string | `nil` | Current shape identifier (e.g., `"s1"`, `"s2"`, etc.) used for animation and rarity determination. |
| `deployable` | table | `nil` | Embedded in save data; stores `shape` for deployment persistence. |

## Main functions
### `SetShape(inst, shape)`
* **Description:** Assigns a shape to the figure, sets its rarity tag, updates the `carnivaldecor.value`, and plays the corresponding animation.
* **Parameters:** `shape` (string, optional) – If omitted, chooses a weighted random shape for the current season.
* **Returns:** Nothing.
* **Error states:** Silently returns if the new shape matches the current `inst.shape`.

### `GetStatus(inst)`
* **Description:** Returns a localized string indicating rarity (e.g., `"RARE"` or `"UNCOMMON"`) for use in inspection UI.
* **Parameters:** `inst` (entity) – The figure instance.
* **Returns:** `"RARE"`, `"UNCOMMON"`, or `nil` (for common).
* **Error states:** Assumes `shape_rarity[inst.carnival_season][inst.shape]` exists.

### `GetDisplayName(inst)`
* **Description:** Provides the display name based on rarity tags (`blindbox_rare`, `blindbox_uncommon`, or default common).
* **Parameters:** `inst` (entity) – The figure instance.
* **Returns:** String name from `STRINGS.NAMES`.
* **Error states:** Uses string comparison on tags; fallback to common name if neither tag is present.

### `onhammered(inst, worker)`
* **Description:** Called when the `workable` component finishes hammering; triggers collapse FX, drops loot, and removes the entity.
* **Parameters:** 
  * `inst` (entity) – The figure instance.
  * `worker` (entity) – The entity performing the hammering.
* **Returns:** Nothing.

### `onbuilt(inst, data)`
* **Description:** Handles post-deployment actions: sets shape (if specified), spawns unwrap FX, and plays a packaging sound.
* **Parameters:** 
  * `inst` (entity) – The figure instance.
  * `data` (table, optional) – May contain `data.deployable.shape`.
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Saves the current shape for persistence across game sessions.
* **Parameters:** 
  * `inst` (entity) – The figure instance.
  * `data` (table) – The save data table.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores the shape from saved data and re-applies it via `SetShape`.
* **Parameters:** 
  * `inst` (entity) – The figure instance.
  * `data` (table, optional) – May contain `data.shape`.
* **Returns:** Nothing.

### `onreturntokit(inst, data)`
* **Description:** Updates the returned kit item with the figure's current shape.
* **Parameters:** 
  * `inst` (entity) – The figure instance.
  * `data` (table) – Contains `data.loot` (the kit item).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` – triggers `onbuilt` handler to finalize deployment.
- **Pushes:** No events directly; uses callbacks from `lootdropper` (`entity_droploot`) and `workable` (`onfinish` via `onhammered`).

## Deployable Kit Integration
The prefab also defines:
- `MakeDeployableKitItem`: For creating `carnivaldecor_figure_kit` and its Season 2 variant.
- `MakePlacer`: For placer entities used during item placement.
- `fn_season1`, `fn_season2`: Season-specific constructor wrappers.