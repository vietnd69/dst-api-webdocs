---
id: stagehand
title: Stagehand
description: Manages the behavior, physics state, and interactions of the Stagehand creature, including toggling between standing (active) and crouching (hiding) modes.
tags: [ai, creature, environment, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9284cd30
system_scope: entity
---

# Stagehand

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The Stagehand entity represents a movable creature that alternates between a crouching (hiding) state and a standing (active) state. It is used in the game world as a static obstacle when crouching and a mobile entity when standing. The component handles physics toggling (`blocker` tag and collision groups), workable behavior (allowing infinite work via callbacks), burn FX, loot dropping, and integration with the `SGstagehand` stategraph and `stagehandbrain`. It interacts closely with the `workable`, `burnable`, `locomotor`, `lootdropper`, `inspectable`, and physics components.

## Usage example
```lua
-- Automatically instantiated via Prefab("stagehand", fn, assets, prefabs)
-- No manual component usage needed; the prefab definition handles initialization.
-- Typical interaction examples:
-- 1. Modifying walk speed:
inst.components.locomotor.walkspeed = 10
-- 2. Checking hide/awake status:
local status = inst.components.inspectable:getstatus() -- returns "HIDING" or "AWAKE"
-- 3. Manually triggering physics change:
inst.ChangePhysics(inst, true) -- Stand up
```

## Dependencies & tags
**Components used:** `burnable`, `workable`, `locomotor`, `lootdropper`, `inspectable`, `physics`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags added:** `notraptrigger`, `antlion_sinkhole_blocker`, `electricdamageimmune`, `shadow_aligned`, `blocker` (added/removed dynamically)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_speechstatus` | string | `"HIDING"` | Stores the visible status string used in the scrapbook UI. |
| `CanStandUp` | function | `CanStandUp(inst)` | Predicate returning `true` if the Stagehand may stand (based on light and player proximity). |
| `ChangePhysics` | function | `ChangePhysics(inst, is_standing)` | Toggles physics and tags between crouched (`blocker`, static) and standing (mobile). |
| `sounds` | table | `sounds` | Table of SFX paths for hit, awake, and footstep events. |

## Main functions
### `onworked(inst, worker)`
*   **Description:** Callback for `workable` component triggered when the Stagehand is hammered. It resets `workleft` to full capacity, ensuring the Stagehand never finishes working and remains interactive indefinitely.
*   **Parameters:** `inst` (entity) - the Stagehand entity; `worker` (entity) - the entity performing the work.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a string status ("HIDING" or "AWAKE") based on the current stategraph state tags.
*   **Parameters:** `inst` (entity) - the Stagehand entity.
*   **Returns:** `"HIDING"` if the entity has state tag `"hiding"`, otherwise `"AWAKE"`.

### `CanStandUp(inst)`
*   **Description:** Determines whether the Stagehand is allowed to stand up. It returns `true` if not currently in light, or if it's nighttime, not full moon, and beyond 30 world units from any player.
*   **Parameters:** `inst` (entity) - the Stagehand entity.
*   **Returns:** `boolean` — `true` if standing is permitted, `false` otherwise.

### `ChangePhysics(inst, is_standing)`
*   **Description:** Toggles the Stagehand’s physical state between crouched (static blocker) and standing (mobile). Adds/removes the `"blocker"` tag, adjusts mass, collision group, and collision mask accordingly.
*   **Parameters:** `inst` (entity) - the Stagehand entity; `is_standing` (boolean) — if `true`, sets up mobile physics; otherwise sets up static blocker physics.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (stategraph and brain handle most event-driven behavior).
- **Pushes:** None directly (events are delegated via stategraph and other components like `workable`/`burnable`).