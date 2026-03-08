---
id: camera_maxwellthrone
title: Camera Maxwellthrone
description: Controls camera movement and positioning during the Maxwell throne cutscene to smoothly transition between fixed and player-controllable modes.
tags: [camera, cutscene, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 753dd0ec
system_scope: camera
---

# Camera Maxwellthrone

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`camera_maxwellthrone` is a scenario script responsible for managing camera behavior during the Maxwell throne cutscene. It temporarily overrides normal camera controls, smoothly interpolating between a fixed cinematic view and standard player control as the player moves near or away from a tracked target (typically the player character). It uses distance-based interpolation to smoothly adjust camera offset, distance, and heading target.

## Usage example
This script is not meant to be manually added as a component. It is invoked by the scenario system when the Maxwell throne event is loaded:
```lua
-- Loaded automatically via scenario runner (e.g., during "maxwellintro" NIS)
inst:DoTaskInTime(0, function()
    require("scenarios/camera_maxwellthrone").OnLoad(inst, scenariorunner)
end)
```

## Dependencies & tags
**Components used:** None (uses global `TheCamera`, `GetPlayer`, and utility `Lerp`, `roundToNearest`)
**Tags:** None identified.

## Properties
No public properties are defined. The script uses local module-scoped constants and instance variables stored directly on `inst`.

## Main functions
### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes camera behavior for the cutscene. Sets up a periodic task to run `Update` every 0.05 seconds, records the initial camera state, and identifies the entity to track (`GetPlayer()`).
*   **Parameters:**  
    `inst` (entity instance) — the scenario runner entity the script is attached to.  
    `scenariorunner` (scenario runner object) — reference to the scenario runner (unused in this script).  
*   **Returns:** Nothing.

### `Update(inst)`
*   **Description:** Periodically adjusts camera position based on the player's distance from the tracked object (`inst.objToTrack`). Interpolates camera offset, distance, and heading to produce a smooth cinematic transition between fixed and free camera modes.
*   **Parameters:**  
    `inst` (entity instance) — the scenario runner entity.  
*   **Returns:** Nothing.
*   **Error states:** None explicitly handled; relies on `TheCamera` methods and global `GetPlayer` returning valid values.

## Events & listeners
- **Listens to:** None — uses periodic task instead of events.
- **Pushes:** None — does not fire custom events.