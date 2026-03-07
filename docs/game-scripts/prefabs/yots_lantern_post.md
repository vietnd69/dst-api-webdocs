---
id: yots_lantern_post
title: Yots Lantern Post
description: Manages a deployable post that connects to nearby posts, holds light-emitting batteries, and dynamically spawns suspended lantern chains with flickering light effects.
tags: [light, network, entity, deployable, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b98b3b87
system_scope: environment
---

# Yots Lantern Post

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yots_lantern_post` is the master prefab and component for a deployable post in DST that serves as a lighting anchor point. When placed, it detects up to two nearby posts within a fixed distance (`CHAIN_DIST` = 8), spawns suspended chains of links and lanterns between them, and lights the lanterns when batteries (items tagged `lightbattery`, `spore`, or `lightcontainer`) are placed in its container. The post supports perishing logic, visual flicker effects on its light, and dynamic lantern placement based on partner presence.

The component uses several core systems: `container` for battery storage, `workable` for hammering interaction, `preserver` for perish rate modulation, `entitytracker` for partner references, and `updatelooper` for client-side wall updates that animate chain sway and lantern positioning.

## Usage example
```lua
-- Creating a Yots Lantern Post entity
local inst = Prefab("yots_lantern_post", fn, assets, prefabs)

-- Typical usage in-game after placement
inst:FindPartners()        -- Detect and link to up to two nearby posts
inst:checklights()         -- Check battery state and turn light on/off
inst.components.container:GiveItem(battery_item) -- Insert a battery
```

## Dependencies & tags
**Components used:**
- `container` (`DropEverything`, `FindItems`, `GiveItem`, `WidgetSetup`)
- `workable` (`SetWorkAction`, `SetWorkLeft`, `SetOnWorkCallback`, `SetOnFinishCallback`)
- `lootdropper` (`DropLoot`)
- `preserver` (`SetPerishRateMultiplier`)
- `inspectable` (`getstatus`)
- `entitytracker` (`GetEntity`, `TrackEntity`)
- `updatelooper` (`AddOnUpdateFn`, `AddOnWallUpdateFn`)
- `placer` (`onupdatetransform`)

**Tags added/checked:**
- `yots_post`: Added to the post instance.
- `lightbattery`, `spore`, `lightcontainer`, `fulllighter`: Items checked in the container for light logic.
- `FX`, `NOCLICK`, `CLASSIFIED`, `placer`: Applied to non-networked FX child entities.

## Properties
No public properties are exposed as writable attributes on the main `yots_lantern_post` instance. Internal state is stored in instance fields (`inst.neighbour_lights`, `inst.light_obj`, `inst.partner1`, `inst.partner2`, `inst.chain`, `inst.lanterns`, `inst.old_chain_end_pos`, `inst.near`), but these are not part of the component interface and should not be accessed directly by modders.

## Main functions
### `checklights(inst)`
*   **Description:** Checks if any batteries are present in the container and turns the light on or off accordingly via `lightson` or `lightsoff`.
*   **Parameters:** `inst` (entity) — the post entity.
*   **Returns:** Nothing.

### `FindPartners(inst)`
*   **Description:** Scans for up to two other `yots_post` entities within `CHAIN_DIST` (8 units), then spawns `yots_lantern_light_chain` entities between the post and each partner, linking them via `entitytracker` and lighting the lanterns if either post is lit.
*   **Parameters:** `inst` (entity) — the post entity.
*   **Returns:** Nothing.

### `UpdateLightState(inst)`
*   **Description:** Responds to `itemget` or `itemlose` events. Determines the number of `is_battery_type` and `is_fulllighter` items, updates the perish rate multiplier, and re-checks the light state.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `lightson(inst)`
*   **Description:** Enables the light visual (`light_on` symbol visible), spawns the `yots_lantern_light` child if needed, and increments `enablelight` counter on all linked chain lights.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `lightsoff(inst)`
*   **Description:** Disables the light visual and removes the `light_obj`, decrementing `enablelight` counters on linked chain lights.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnWorkFinished(inst, worker)`
*   **Description:** Called on hammering completion. Drops all container contents and loot, spawns a `collapse_big` FX, and removes the post entity.
*   **Parameters:** `inst` (entity), `worker` (entity or nil).
*   **Returns:** Nothing.

### `OnUpdateFlicker(inst, starttime)`
*   **Description:** Runs periodically on the light entities to modulate radius and colour using a summation of sine waves, creating a flicker effect.
*   **Parameters:** `inst` (entity), `starttime` (number or nil) — base timestamp for flicker phase.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onbuilt` — triggers `onbuilt`, which plays animation, gives a starting bulb, calls `FindPartners`, and `checklights`.
  - `onremove` — triggers `onremove`, which removes all linked chain lights.
  - `itemget` — triggers `UpdateLightState`.
  - `itemlose` — triggers `UpdateLightState`.
  - `partner1dirty`, `partner2dirty` (client only) — triggers `PartnerDirty` to spawn/remove chain FX.
  - `lightdirty` (client only) — triggers `OnLightDirty` to sync lantern visibility/light state.

- **Pushes:** None directly (uses events for internal updates only).