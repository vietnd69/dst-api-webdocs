---
id: yotb_placer_common
title: Yotb Placer Common
description: Provides helper functions and constants to manage placement preview rings for deployable prefabs in DST.
tags: [placement, preview, ui]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c79066e5
system_scope: world
---

# Yotb Placer Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotb_placer_common.lua` exports utility functions to configure and manage placement preview rings—visual feedback shown to players when deploying entities. It defines two core components: `DeployHelperRing`, which highlights compatible targets during placement, and `PlacerRing`, which appears on the entity being deployed. The module integrates with the `deployhelper`, `placer`, and `updatelooper` components to handle placement logic and real-time updates.

## Usage example
```lua
local prefabs = require "prefabs/yotb_placer_common"

-- Add placement helpers to a deployable prefab
prefabs.AddDeployHelper(inst, { "yotc_carrat_race_deploy_rings" })
prefabs.AddPlacerRing(inst, {
    bank = "firefighter_placement",
    build = "firefighter_placement",
    anim = "idle",
    scale = 2,
}, "yotc_carrat_race_deploy_rings")
```

## Dependencies & tags
**Components used:** `deployhelper`, `placer`, `updatelooper`, `animstate`, `transform`
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, and `placer` to preview ring entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PLACER_RING_SCALE` | number | `2` | Scale factor applied to the `PlacerRing`. |
| `HELPER_RING_SCALE` | number | `1.38` | Scale factor applied to the `DeployHelperRing` (unused in current code). |
| `deployable_data.deploymode` | string | `DEPLOYMODE.CUSTOM` | Deployment mode for compatible prefabs. |
| `deployable_data.custom_candeploy_fn` | function | *(see below)* | Validates deployment position using map constraints. |

## Main functions
### `AddDeployHelper(inst, keyfilters)`
*   **Description:** Adds the `deployhelper` component to `inst` and configures it to listen for placement actions. Registers key-based filters for placement triggers and sets up helper ring creation/disposal callbacks.
*   **Parameters:**  
    `inst` (EntityInstance) - The entity to attach the helper to.  
    `keyfilters` (table`<string>`) - List of string keys used to filter placement triggers.  
*   **Returns:** Nothing.
*   **Error states:** Skips component addition on dedicated servers (`TheNet:IsDedicated()` returns `true`).

### `AddPlacerRing(inst, ringdata, deployhelper_key)`
*   **Description:** Creates and attaches a `PlacerRing` preview entity to `inst`. Configures the `placer` component to link the ring and enables lighting control.
*   **Parameters:**  
    `inst` (EntityInstance) - The entity to display the ring on.  
    `ringdata` (table) - Configuration with keys `bank`, `build`, `anim`, and `scale`.  
    `deployhelper_key` (string) - Key used to match placement triggers. Stored as `inst.deployhelper_key`.  
*   **Returns:** Nothing.

### `CreateDeployHelperRing()`
*   **Description:** Constructs a non-persistent preview entity (`DeployHelperRing`) used to highlight valid placement targets. Configures animation, lighting, layering, and positioning.
*   **Parameters:** None.
*   **Returns:** `EntityInstance` - The configured helper ring entity.
*   **Error states:** None; always returns a valid entity.

### `CreatePlacerRing(ringdata)`
*   **Description:** Constructs a non-persistent preview entity (`PlacerRing`) used to indicate the deployed item’s position during placement. Visual appearance is driven by `ringdata`.
*   **Parameters:**  
    `ringdata` (table) - Must contain `bank`, `build`, `anim`, and `scale`.  
*   **Returns:** `EntityInstance` - The configured placer ring entity.
*   **Error states:** None; always returns a valid entity.

### `DeployHelperRing_OnUpdate(helperinst)`
*   **Description:** Updates the `DeployHelperRing`’s visibility and color during placement. Activated via `updatelooper` to reflect proximity to compatible targets and world constraints.
*   **Parameters:**  
    `helperinst` (EntityInstance) - The helper ring instance being updated.  
*   **Returns:** Nothing.
*   **Error states:** Stops updating and hides the ring if the parent `placerinst` is invalid, out of range, or on a different platform.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Handles helper ring creation or cleanup when placement helpers are enabled/disabled. Creates the ring on `enabled=true` if not burnt, removes it on `enabled=false`.
*   **Parameters:**  
    `inst` (EntityInstance) - Parent entity requesting helper creation.  
    `enabled` (boolean) - Whether the helper should be active.  
    `recipename` (string) - Unused (included for API compatibility).  
    `placerinst` (EntityInstance or nil) - The target entity being placed near (used for proximity checks).  
*   **Returns:** Nothing.

### `OnStartHelper(inst, recipename, placerinst)`
*   **Description:** Manages helper ring visibility when placement starts (e.g., hide if mouse input is blocked).
*   **Parameters:**  
    `inst` (EntityInstance) - Parent entity.  
    `recipename` (string) - Unused (included for API compatibility).  
    `placerinst` (EntityInstance or nil) - Target entity being placed near.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** None (no `inst:PushEvent` calls in this file).