---
id: dirtpile
title: Dirtpile
description: Represents a temporary dirt pile landmark that can be investigated to reveal a small puff FX and notify the hunter system.
tags: [environment, interact, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5e941eb6
system_scope: environment
---

# Dirtpile

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dirtpile` is a non-persistent environmental prefab that appears as a visual landmark (e.g., Koalefant tracks). When investigated by a player or haunter, it spawns a small smoke puff effect at its location, notifies the `hunter` component of the investigation, and removes itself from the world. It is designed to be ephemeral and used for world storytelling or gameplay triggers.

## Usage example
```lua
local dirt = SpawnPrefab("dirtpile")
dirt.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `activatable`, `hauntable`, `hunter` (via `TheWorld.components.hunter`)
**Tags:** Adds `dirtpile`

## Properties
No public properties

## Main functions
### `OnInvestigated(inst, doer)`
*   **Description:** Handles investigation of the dirt pile. Notifies the world's `hunter` component of the event at the dirt pile's position, spawns a `small_puff` prefab, and removes the dirt pile.
*   **Parameters:** 
    * `inst` (Entity) - the dirt pile instance.
    * `doer` (Entity) - the entity performing the investigation.
*   **Returns:** Nothing.

### `OnHaunted(inst, haunter)`
*   **Description:** Handles haunting of the dirt pile. Currently invokes `OnInvestigated` with the haunter as the doer and returns `true`.
*   **Parameters:** 
    * `inst` (Entity) - the dirt pile instance.
    * `haunter` (Entity) - the entity causing the haunt.
*   **Returns:** `true`
*   **Error states:** The block inside is commented out, so haunting behaves identically to investigation.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.