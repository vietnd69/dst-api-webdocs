---
id: yotb_post
title: Yotb Post
description: Manages the behavior and state of the yotb_post structure, including hammering, hitching, marking, burning, and ribbon animation effects.
tags: [structure, crafting, player, loot, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8ea6d1eb
system_scope: entity
---

# Yotb Post

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotb_post` is a deployable structure used in the DST event "YotB" (Year of the Beast). It supports hammering for loot, hitching entities via the `hitcher` component, and marking by participants using ribbons. It integrates with the `yotb_stager` component to validate mark eligibility and responds to burning and removal events. It also spawns related entities (`yotb_post_rug`, `yotb_post_spotlight`, `yotb_post_ribbon`) for visual feedback.

## Usage example
```lua
local post = SpawnPrefab("yotb_post")
post.Transform:SetPosition(x, y, z)
post.components.workable:SetWorkLeft(4)
post.components.markable:SetMarkable(true)
-- Marking requires a linked bell and participant status, handled in canmarkfn
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `hitcher`, `talker`, `markable`, `burnable`, `inspectable`, `inventory`, `yotb_stager`  
**Tags added:** `structure`, `yotb_post`  
**Tags checked:** `burnt`, `bell`, `NPC_contestant`, `yotb_stage`, `yotb_post`, `DECOR`, `NOCLICK`, `fx`, `ignoretalking`, `hitched`, `hitchable`, `debuffed`, `buffed`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ribbons` | table (optional) | `nil` | Stores spawned `yotb_post_ribbon` entities keyed by mark ID. |
| `stage` | Entity (optional) | `nil` | Reference to the parent `yotb_stage` entity, used to validate mark eligibility. |
| `rug` | Entity (optional) | `nil` | Reference to the spawned `yotb_post_rug` entity. |
| `_fadeval` | net_float | `0` | Client-side light intensity value (only on spotlight prefabs). |
| `_faderate` | net_smallbyte | `0` | Controls spotlight fade-in/out behavior. |

## Main functions
### `mark(inst, doer, id)`
*   **Description:** Handles the logic for marking the post with a ribbon. Spawns a `yotb_post_ribbon` entity, attaches it to the post, plays animation, and sets its color based on the doer's client settings. If a prior mark exists for the same doer, it unmarks the old post first.
*   **Parameters:** `inst` (Entity) — the post instance; `doer` (Entity) — the entity doing the marking; `id` (number) — unique identifier for this mark.
*   **Returns:** Nothing.
*   **Error states:** ribbon is only spawned if `inst.ribbons` is properly initialized.

### `unmark(inst, doer, id)`
*   **Description:** Removes a specific ribbon by ID and cleans up the `ribbons` table if empty.
*   **Parameters:** `inst` (Entity) — the post instance; `doer` (Entity) — unused; `id` (number) — ID of the mark to remove.
*   **Returns:** Nothing.

### `unmarkall(inst)`
*   **Description:** Removes all ribbons attached to the post and clears the `ribbons` table.
*   **Parameters:** `inst` (Entity) — the post instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the post is fully hammered. Drops loot (e.g., ash if burning), spawns a `collapse_big` fx, and removes the post.
*   **Parameters:** `inst` (Entity) — the post instance; `worker` (Entity) — the hammering entity.
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Sets the post's animation to `"burnt"` when fully burned.
*   **Parameters:** `inst` (Entity) — the post instance.
*   **Returns:** Nothing.

### `onhitch(inst, target)`
*   **Description:** Hook for hitching; currently empty.
*   **Parameters:** `inst` (Entity) — the post instance; `target` (Entity) — the hitched entity.
*   **Returns:** Nothing.

### `onunhitch(inst, oldtarget)`
*   **Description:** Pushes `"unhitch"` event to the previously hitched entity upon unhitching.
*   **Parameters:** `inst` (Entity) — the post instance; `oldtarget` (Entity) — the previously hitched entity.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves burning state if the post is burnt or currently burning.
*   **Parameters:** `inst` (Entity) — the post instance; `data` (table) — the save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Loads the burnt state and triggers `burnable.onburnt` logic on load if burnt.
*   **Parameters:** `inst` (Entity) — the post instance; `data` (table) — the loaded data table.
*   **Returns:** Nothing.

### `onremove(inst)`
*   **Description:** Ensures hitched entities are unhitched and rug is removed before post deletion.
*   **Parameters:** `inst` (Entity) — the post instance.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays placement sound and animation upon construction.
*   **Parameters:** `inst` (Entity) — the post instance.
*   **Returns:** Nothing.

### `IsLinkedBell(item)`
*   **Description:** Helper predicate checking if an item has both `"bell"` tag and a valid `GetBeefalo()` reference.
*   **Parameters:** `item` (Entity) — the bell item to check.
*   **Returns:** `boolean` — `true` if item is a linked bell.

### `can_deploy(inst, pt, mouseover, deployer)`
*   **Description:** Validates that placement occurs within range of a stage (`yotb_stage`) and not too close to other posts (`yotb_post`).
*   **Parameters:** `inst` (Entity) — the item being deployed; `pt` (Vector3) — world position; `mouseover` (Entity) — mouseover entity; `deployer` (Entity) — deploying entity.
*   **Returns:** `boolean` — `true` if all conditions met.

### `fadein(inst)`
*   **Description (spotlight only):** Initiates a fade-in animation for the spotlight light intensity.
*   **Parameters:** `inst` (Entity) — the spotlight instance.
*   **Returns:** Nothing.

### `fadeout(inst)`
*   **Description (spotlight only):** Initiates a fade-out animation for the spotlight light intensity.
*   **Parameters:** `inst` (Entity) — the spotlight instance.
*   **Returns:** Nothing.

### `updatefade(inst, rate)`
*   **Description (spotlight only):** Updates the local light intensity each frame toward target value.
*   **Parameters:** `inst` (Entity) — the spotlight instance; `rate` (number) — per-frame intensity delta.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onburnt` → triggers `onburnt(inst)`
  - `onremove` → triggers `onremove(inst)`
  - `onbuilt` → triggers `onbuilt(inst)`
  - `onfaderatedirty` (client only) → triggers `OnFadeRateDirty(inst)`
- **Pushes:**
  - `"unhitch"` (on `oldtarget` in `onunhitch`)
  - `"entity_droploot"` (via `LootDropper:DropLoot`)
  - `"unhitched"` (via `Hitcher:Unhitch`)