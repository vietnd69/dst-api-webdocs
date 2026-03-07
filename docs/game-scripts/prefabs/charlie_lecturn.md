---
id: charlie_lecturn
title: Charlie Lecturn
description: Manages thelecturn's visual and functional state as a structure that holds a playbill stage entity and supports page-turning animations and idle behavior.
tags: [structure, animation, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d83ec571
system_scope: world
---

# Charlie Lecturn

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlie_lecturn` is a prefab that defines the behavior of Charlie's lecturn, a structure used during the Stageplay minigame. It combines visual, audio, and entity-tracking logic: it displays animations (including idle vine movements and page turns), supports writing for the playbill, and tracks the current stage entity via the `entitytracker` and `playbill_lecturn` components. It is typically instantiated in the world during Stageplay events and integrates with DST's save/load system using `OnLoadPostPass`.

## Usage example
```lua
-- The lecturn is automatically created by the Stageplay system via its prefab.
-- Modders typically interact with it through its components:
local inst = TheSim:FindFirstEntityWithTag("playbill_lecturn")
if inst and inst.components.playbill_lecturn then
    inst.components.playbill_lecturn:SetStage(some_stage_entity)
end
```

## Dependencies & tags
**Components used:** `entitytracker`, `playbill_lecturn`, `inspectable`, `writeable`, `lootdropper`
**Tags:** Adds `structure`, `_writeable`, and `playbill_lecturn` during construction.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `checkidleanim` | function | `checkidleanim` | Reference to the function that periodically plays random idle animations. |
| `scrapbook_proxy` | string | `"charlie_stage_post"` | Proxy identifier used for scrapbook/crafting display. |

## Main functions
### `flippage(inst)`
*   **Description:** Plays a page-turn animation and sound effect, then returns to idle. Called when text changes (e.g., writing on the lecturn).
*   **Parameters:** `inst` (entity instance) — the lecturn instance.
*   **Returns:** Nothing.

### `checkidleanim(inst)`
*   **Description:** Plays one of three random idle animations (e.g., vine movement), queues the idle animation to resume, and schedules the next check.
*   **Parameters:** `inst` (entity instance) — the lecturn instance.
*   **Returns:** Nothing.

### `on_playbill_stage_set(inst, stage)`
*   **Description:** Updates the `entitytracker` to track the new stage entity and stores it for persistence/loading.
*   **Parameters:** `inst` (entity instance), `stage` (entity instance) — the stage entity being set.
*   **Returns:** Nothing.

### `on_load_postpass(inst, newents, data)`
*   **Description:** Restores the stage entity reference from `entitytracker` and re-applies it to the `playbill_lecturn` component during load.
*   **Parameters:** `inst` (entity instance), `newents` (table), `data` (table) — load state.
*   **Returns:** Nothing.
*   **Error states:** If the tracked stage entity was not found or no longer exists, the stage is not restored.

## Events & listeners
- **Listens to:** `text_changed` — triggers `flippage` when text is written or altered on the lecturn.
- **Pushes:** None identified.

