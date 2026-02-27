---
id: pointofinterest
title: Pointofinterest
description: Manages the visual and HUD indicators for point-of-interest entities (e.g., classified items), including world-space markers, HUD indicators, and removal animations.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d389d560
---

# Pointofinterest

## Overview
This component manages the visual representation and behavior of point-of-interest (POI) entities in the world—specifically, classified items in the Scrapbook that require player attention. It handles creation and removal of world-space indicators (e.g., stands and markers), HUD target indicators, and animated removal sequences (pulse and ring expansion). It operates only on the master simulation and is tightly integrated with the Scrapbook system and player HUD.

## Dependencies & Tags
- **Components used:** `transform`, `animstate`, `follower`
- **Tags added by helper functions:** `CLASSIFIED`, `NOCLICK`, `FX`
- **External dependencies:** `TheScrapbookPartitions`, `SCRAPBOOK_DATA_SET`, `ThePlayer.HUD`, `TUNING`, `Profile`
- **No direct `AddComponent` calls in constructor**—this component is *added to an entity* externally (e.g., via `inst:AddComponent("pointofinterest")`), not the other way around.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to (set in constructor). |
| `_showinghud` | `boolean` | `nil` | Tracks whether the HUD indicator is currently active. |
| `shouldshowfn` | `function` | `nil` | Optional predicate function; if provided, determines whether to show the HUD indicator. |
| `_updating` | `boolean` | `false` | Indicates whether the component is actively updating (controls `StartUpdatingComponent`/`StopUpdatingComponent`). |
| `height` | `number` | `0` | Vertical offset for follower-followed relationships (used in `FollowSymbol`). |
| `_removing` | `boolean` | `false` | Set during removal sequence to trigger pulse animation. |
| `stand` | `Entity?` | `nil` | World-space "stand" visual (e.g., `flint`-based model). |
| `marker` | `Entity?` | `nil` | The animated "question mark" marker entity. |
| `ring1`, `ring2` | `Entity?` | `nil` | Expansion ring effects used during removal. |
| `_TryStartingUpdating` | `function` | N/A | Internal callback used to trigger `TryStartUpdating` after a 0-time task. |

## Main Functions

### `PointOfInterest:TryStartUpdating()`
* **Description:** Begins updating this component if the associated entity is a classified item with Scrapbook level < 2 (i.e., not fully decrypted). Calls `StartUpdatingComponent` internally so `OnUpdate` is executed every frame.
* **Parameters:** None.

### `PointOfInterest:SetShouldShowFn(fn)`
* **Description:** Sets a custom predicate function used to dynamically determine if the HUD indicator should be shown for this POI.
* **Parameters:**
  - `fn` (*function*): A function that takes the POI entity as an argument and returns `true`/`false`.

### `PointOfInterest:SetHeight(height)`
* **Description:** Sets the vertical offset for marker/stand relative positioning.
* **Parameters:**
  - `height` (*number*): Y-offset applied via `FollowSymbol(..., 0, height, 0)`.

### `PointOfInterest:RemoveHudIndicator()`
* **Description:** Removes the HUD target indicator if present, and sets `_showinghud = false`.
* **Parameters:** None.

### `PointOfInterest:CreateWorldIndicator()`
* **Description:** Creates and positions the world-space `stand` and `marker` entities (e.g., a flint base and animated question mark), ensuring the marker follows the stand at the configured height.
* **Parameters:** None.

### `PointOfInterest:TriggerPulse()`
* **Description:** Initiates the removal animation: plays a sound, transitions the marker to the `"dark"` animation, and begins a three-stage scaling/removal sequence.
* **Parameters:** None.

### `PointOfInterest:TriggerRemove()`
* **Description:** Starts the full removal process: removes the HUD indicator (if any) and triggers the pulse/removal animation sequence.
* **Parameters:** None.

### `PointOfInterest:RemoveEverything()`
* **Description:** Cleans up all visual entities (`stand`, `marker`, `ring1`, `ring2`), stops updating if active, and resets `_removing` state.
* **Parameters:** None.

### `PointOfInterest:UpdateRing(ring, dt)`
* **Description:** Updates a single expansion ring’s scale and alpha over time. Removes and nulls the ring if it grows beyond scale 2.
* **Parameters:**
  - `ring` (*Entity?*): The ring entity to update.
  - `dt` (*number*): Delta time since last frame.

### `PointOfInterest:UpdateRemovePulse(dt)`
* **Description:** Manages the full removal animation loop: updates both rings, animates marker scale/alpha decay, and progresses through three stages (`loops`) until cleanup.
* **Parameters:**
  - `dt` (*number*): Delta time.

### `PointOfInterest:OnUpdate(dt)`
* **Description:** Main per-frame logic. Handles HUD indicator visibility, world indicator creation/visibility (based on Scrapbook level), and removal animation updates.
* **Parameters:**
  - `dt` (*number*): Delta time.

### `PointOfInterest:OnRemoveEntity()`
* **Description:** Cleanup callback—calls `RemoveHudIndicator` and `RemoveEverything`. Alias assigned to `OnRemoveFromEntity`.
* **Parameters:** None.

### `PointOfInterest:DebugForceShowIndicator()`
* **Description:** For debugging—forces creation of world indicators and starts updating without meeting normal conditions.
* **Parameters:** None.

## Events & Listeners
- **ListenForEvents (implicit):**
  - `entitysleep` → calls `OnEntitySleep()` (master sim only).
  - `entitywake` → calls `OnEntityWake()` (master sim only).
- **PushEvents (none in source)** — this component does not emit its own events.