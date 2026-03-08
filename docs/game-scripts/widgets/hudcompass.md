---
id: hudcompass
title: Hudcompass
description: Manages the in-game compass HUD widget, including needle animation, rotation updates, and transition states for opening/closing the compass UI.
tags: [hud, compass, ui, camera, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 50dfcd16
system_scope: ui
---

# Hudcompass

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`HudCompass` is a UI widget component responsible for rendering and animating the compass needle in the player's Heads-Up Display (HUD). It integrates with the player's inventory (to detect equipped compass items), camera orientation, sanity, lunar phases, and wobble effects to dynamically compute and update the needle's rotation. The widget supports two modes: attached (HUD-embedded) and detached (floating), with animated transitions for opening and closing. A singleton pattern ensures multiple compass widgets share the same master needle state via `SetMaster()` and `CopyMasterNeedle()`.

## Usage example
```lua
local owner = ThePlayer
local hud_compass = CreateWidget("HudCompass", owner, true)  -- attached mode
hud_compass:SetMaster()  -- makes this compass the master for sync
```

## Dependencies & tags
**Components used:** `inventory`, `sanity`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GOTHEREPO` | `nil` | The player entity that owns this compass widget. |
| `isattached` | boolean | `nil` | Whether the compass is embedded in the HUD (vs. floating). |
| `isopen` | boolean | `false` | Whether the compass is currently visible/open. |
| `istransitioning` | boolean | `false` | Whether an opening/closing animation is in progress. |
| `wantstoclose` | boolean | `false` | Flag to defer closing until needle rotation is near zero. |
| `displayheading` | number | `0` | Current displayed rotation angle of the needle (normalized to `[-180, 180]`). |
| `currentheading` | number | `0` | Target heading based on camera orientation and environmental effects. |
| `offsetheading` | number | `0` | Accumulated dynamic offset from sanity, moon, wobble, and haunting. |
| `headingvel` | number | `0` | Velocity of heading change (used for physics-based easing). |
| `forceperdegree` | number | `0.005` | Force multiplier applied to heading delta for velocity integration. |
| `damping` | number | `0.98` | Velocity damping factor per frame. |
| `easein` | number | `0` | Interpolation weight for smooth needle transition (`[0, 1]`). |

## Main functions
### `OpenCompass()`
* **Description:** Opens the compass widget: shows the widget, starts the update loop, and initializes or syncs the needle rotation. For attached mode, triggers an animated transition (`trans_out`).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `isopen` is already `true`, no action is taken.

### `CloseCompass()`
* **Description:** Closes the compass widget: hides the widget, stops the update loop, and triggers an animated transition (`trans_in`) for attached mode. Defer-closes if `math.abs(displayheading) > 1` to avoid snapping.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `isopen` is already `false`, no action is taken.

### `SetMaster()`
* **Description:** Declares this compass instance as the master, ensuring all other compass widgets synchronize their needle state to this one. Cleans up the previous master if applicable.
* **Parameters:** None.
* **Returns:** Nothing.

### `CopyMasterNeedle()`
* **Description:** Copies the master compass's heading and velocity state (`displayheading`, `currentheading`, etc.) to this compass. Used to keep multiple compass instances synchronized.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetCompassHeading()`
* **Description:** Returns the base compass heading in degrees, derived from `TheCamera:GetHeading()` minus 45°.
* **Parameters:** None.
* **Returns:** `number` — The unmodified compass heading (may be `0` if `TheCamera` is `nil`).

### `OnUpdate(dt)`
* **Description:** Called every frame (via `self:StartUpdating()`/`self:StopUpdating()`) to compute and apply needle rotation updates. Synchronizes with the master compass if applicable; otherwise, integrates physics-based heading changes, applies dynamic offsets (sanity, full moon, wobble), and eases the needle to the final `displayheading`.
* **Parameters:** `dt` (number) — Delta time in seconds since the last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `refreshinventory` (on `owner`) — Triggers `TryCompass()` to re-equip the compass.  
  - `equip` (on `owner`) — Opens the compass if the equipped item has the `"compass"` tag.  
  - `unequip` (on `owner`) — Closes the compass if the unequipped slot is `EQUIPSLOTS.HANDS`.  
  - `inventoryclosed` (on `owner`) — Immediately closes the compass.  
  - `animover` (on `bg.inst`) — Handles cleanup after opening/closing animation transitions.  
  - `onremove` (on `self.inst`) — Cleans up master compass reference when this widget is removed.

- **Pushes:** None identified.