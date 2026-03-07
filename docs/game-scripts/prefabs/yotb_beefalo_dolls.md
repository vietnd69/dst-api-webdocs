---
id: yotb_beefalo_dolls
title: Yotb Beefalo Dolls
description: Generates prefabs for collectible Beefalo dolls used in the Year of the Beast event, supporting appraisal, trading, and event-specific functionality.
tags: [event, item, appraisable, tradable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 70aaaa72
system_scope: inventory
---

# Yotb Beefalo Dolls

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This prefab file defines the `yotb_beefalo_doll_*` prefabs — collectible items introduced in the Year of the Beast event. Each doll is a stackable, tradable inventory item that can be appraised by a `yotb_stager` entity. The component logic resides inside a factory function (`make`) that returns prefabs with shared behavior but variant animations, images, and categories.

## Usage example
```lua
-- Example: Creating a doll prefab instance programmatically
local doll = Prefab("yotb_beefalo_doll_nature", ...)
local doll_instance = doll.fn()

-- Appraisal flow (server-side)
if doll_instance and doll_instance.components.yotb_stager then
    doll_instance.components.yotb_stager:appraisedoll(doll_instance)
end
```

## Dependencies & tags
**Components used:** `appraisable`, `inventoryitem`, `stackable`, `inspectable`, `tradable`, `fuel`
**Tags:** Adds `cattoy` and `beefalo_doll`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `category` | string | *None* | The doll's type category (e.g., `"WAR"`, `"FESTIVE"`). Set during prefab creation. |
| `appraisefn` | function | `doappraise` | Callback passed to `appraisable`, triggers appraisal by a `yotb_stager`. |
| `canappraisefn` | function | `canappraise` | Callback passed to `appraisable`, validates if appraisal is allowed. |
| `goldvalue` | number | `TUNING.GOLD_VALUES.YOTB_BEEFALO_DOLL` | Set via `tradable` component. |
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Set via `fuel` component. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Set via `stackable` component. |

## Main functions
### `doappraise(inst, target)`
*   **Description:** Callback for `appraisable`'s appraisal logic. If the target entity has the `yotb_stager` component, it triggers the `appraisedoll` method to begin the appraisal sequence.
*   **Parameters:**  
    `inst` (Entity) — The doll instance being appraised.  
    `target` (Entity) — The entity (typically a `yotb_stager`) performing the appraisal.  
*   **Returns:** Nothing.
*   **Error states:** Silently does nothing if the target lacks the `yotb_stager` component.

### `canappraise(inst, target)`
*   **Description:** Validation callback for `appraisable`. Ensures appraisal is only initiated when the target is in a valid state (`ready`).
*   **Parameters:**  
    `inst` (Entity) — The doll instance (unused).  
    `target` (Entity) — The entity to be checked for appraisal readiness.  
*   **Returns:**  
    `true` — if the target's stategraph has the `"ready"` tag.  
    `false`, `"NOTNOW"` — otherwise.  
*   **Error states:** Returns `false` if the target is not in the `"ready"` state.

### `make(name, build, bank, anim, category)`
*   **Description:** Factory function used to construct a doll prefab. It configures all core components, visuals, tags, and events.
*   **Parameters:**  
    `name` (string) — The prefab name (e.g., `"yotb_beefalo_doll_war"`).  
    `build` (string) — The build name for the `AnimState`.  
    `bank` (string) — The bank name for the `AnimState`.  
    `anim` (string) — The initial animation name and used to derive `inv_image` and `image_name`.  
    `category` (string) — The doll category (e.g., `"WAR"`, `"DOLL"`), stored directly on the instance.  
*   **Returns:** `Prefab` — A fully configured prefab definition.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `imagechange` — triggered via `inventoryitem:ChangeImageName`, fired when the image name is set.  
