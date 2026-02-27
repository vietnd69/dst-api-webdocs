---
id: placer
title: Placer
description: Manages placement preview, position snapping, and build validation for deployable entities in DST.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 33389a01
---

# Placer

## Overview
The `Placer` component handles the visual placement and validation logic for deployable entities in *Don't Starve Together*. It maintains a preview instance (`self.inst`) that follows the player's cursor or controller input, applies snapping and alignment rules (including tile snapping, boat-edge snapping, and axis-aligned placement), determines build validity via customizable test functions, and manages helper visuals for axis-aligned placement overlays.

## Dependencies & Tags
- **Component Dependency:** Relies on `deployhelper` (via `require("components/deployhelper")`), but no explicit component registration (`inst:AddComponent(...)`) occurs within this file.
- **Tags Used:** Internally references `{"boat"}` in `self.BOAT_MUST_TAGS`.
- **Entity Tags Added/Removed:** None directly; it operates on the entity it is attached to (`self.inst`).

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `nil` → passed to constructor | Reference to the entity this component is attached to (the placement preview entity). |
| `can_build` | `boolean` | `false` | Tracks whether the current placement position is valid. Updated in `OnUpdate`. |
| `mouse_blocked` | `boolean` | `nil` | Indicates if the cursor position is blocked by UI or other non-physical constraints. |
| `testfn` | `function` | `nil` | Custom build validation function: `function(pos, rotation) -> can_build, mouse_blocked`. |
| `radius` | `number` | `1` | Reserved for future use; not actively used in current code. |
| `selected_pos` | `Vector3` | `nil` | Stores a pre-selected position (e.g., for buffered actions). |
| `onupdatetransform` | `function` | `nil` | Callback invoked at the end of position/orientation updates. |
| `oncanbuild` | `function` | `nil` | Callback when build is valid; overrides default behavior. |
| `oncannotbuild` | `function` | `nil` | Callback when build is invalid; overrides default behavior. |
| `onfailedplacement` | `function` | `nil` | Callback on failed placement attempts; defined but not used in this code. |
| `axisalignedplacement` | `boolean` | `false` | Whether axis-aligned placement is *enabled* (user-configurable state). |
| `axisalignedplacementtoggle` | `boolean` | `false` | Temporary toggle state for the current frame (driven by input). |
| `axisalignedplacementallowedbyitem` | `boolean` | `nil` | Whether axis-aligned placement is allowed by the held item/recipe. |
| `axisalignedhelpers` | `table` | `nil` | Stores cached visual and data structures for axis-aligned placement overlays. |
| `linked` | `table` | `{}` | Array of entities (e.g., attached lights) that should mirror visibility. |
| `offset` | `number` | `1` | Controller-specific positional offset when placing relative to the player. |
| `hide_inv_icon` | `boolean` | `true` | Controls whether the inventory icon is hidden during placement. |
| `override_build_point_fn` | `function` | `nil` | Reserved; not used in current code. |
| `override_testfn` | `function` | `nil` | Alternative build validation function; takes `self.inst` as argument. |
| `snap_to_tile` | — | — | Not set in constructor; inferred from context (likely set externally). |
| `snap_to_meters` | — | — | Not set in constructor; inferred. |
| `snaptogrid` | — | — | Not set in constructor; inferred. |
| `snap_to_boat_edge` | — | — | Not set in constructor; inferred. |
| `rotate_from_boat_center` | — | — | Not set in constructor; inferred. |
| `fixedcameraoffset` | — | — | Not set in constructor; inferred. |
| `rotationoffset` | — | — | Not set in constructor; inferred. |
| `onground` | — | — | Not set in constructor; inferred. |
| `builder` | `Entity` | `nil` | Set by `SetBuilder`; player performing the placement. |
| `recipe` | `table` | `nil` | Set by `SetBuilder`; recipe for the deployed item. |
| `invobject` | `table` | `nil` | Set by `SetBuilder`; the inventory item being placed. |
| `axisalignedplacementallowedbyitem` | `boolean` | — | Set by `SetBuilder`; caches whether the item supports axis-aligned placement. |

## Main Functions

### `OnRemoveEntity()`
* **Description:** Cleans up when the component (and its entity) is removed. Hides the placement icon if needed, and destroys axis-aligned helper visuals.
* **Parameters:** None.

### `InitializeAxisAlignedHelpers()`
* **Description:** Initializes and caches axis-aligned placement helper visuals (grid of tiles). Also listens for tuning changes via the "refreshaxisalignedplacementintervals" event on `ThePlayer`.
* **Parameters:** None.

### `CanStartAxisAlignedPlacementForItem(item)`
* **Description:** Determines if the given item supports axis-aligned placement, considering mod compatibility and item tags. Returns `true` only if no conflicting mods are active and the item is a deployable, non-tile/decked structure.
* **Parameters:**
  - `item` (`table` or `nil`): Inventory item or structure being placed. `nil` means a structure (returns `true`).

### `SetBuilder(builder, recipe, invobject)`
* **Description:** Assigns the player and item details to the placer. Sets up axis-aligned placement if applicable (controller state or axis-aligned enabled) and calls `InitializeAxisAlignedHelpers()`. Begins wall update updates.
* **Parameters:**
  - `builder` (`Entity`): Player performing the placement (typically `ThePlayer`).
  - `recipe` (`table`): Recipe associated with the item.
  - `invobject` (`table`): Inventory object of the item being placed.

### `LinkEntity(ent, lightoverride)`
* **Description:** Adds an entity to the `linked` list and optionally applies a light override to it.
* **Parameters:**
  - `ent` (`Entity`): Entity to link (e.g., a light source).
  - `lightoverride` (`number`, optional): Light intensity override. Default is `1`.

### `GetDeployAction()`
* **Description:** Returns a buffered `DEPLOY` or `DEPLOY_FLOATING` action for the current item/position.
* **Parameters:** None.

### `TestCanBuild()`
* **Description:** Checks if the current placement position is valid. Delegates to `override_testfn`, `testfn`, or defaults to `true`.
* **Parameters:** None.
* **Returns:**
  - `can_build` (`boolean`)
  - `mouse_blocked` (`boolean`)

### `ToggleHideInvIcon(hide)`
* **Description:** Toggles visibility of the inventory icon, emitting `onplacershown`/`onplacerhidden` events to update UI.
* **Parameters:**
  - `hide` (`boolean`): If `true`, hides the icon; otherwise, shows it.

### `IsAxisAlignedPlacement()`
* **Description:** Returns whether axis-aligned placement is active (`enabled XOR toggle`).
* **Parameters:** None.

### `GetAxisAlignedPlacementTransform(x, y, z, ignorescale)`
* **Description:** Snap an arbitrary world position to the nearest axis-aligned grid position.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World coordinates to snap.
  - `ignorescale` (`boolean`, optional): If `true`, return unscaled grid index; defaults to `false`.

### `UpdateAxisAlignedHelpers(dt)`
* **Description:** Updates visibility, position, and collision state of axis-aligned placement helper visuals per frame. Includes sliding cached results on movement, progressive fade-in/out, and periodic collision checking.
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

### `OnUpdate(dt)`
* **Description:** Main update loop. Handles cursor/position following, snapping, axis-aligned toggling, visibility toggling, light overrides, build validation, helper updates, and event emission.
* **Parameters:**
  - `dt` (`number`): Delta time.

### `OnWallUpdate(dt)`
* **Description:** Alias for `OnUpdate(dt)` for backward compatibility with older mods. Delegates to `OnUpdate`.
* **Parameters:** Same as `OnUpdate`.

## Events & Listeners
- **Listens to:**
  - `"refreshaxisalignedplacementintervals"` on `ThePlayer` (inside `InitializeAxisAlignedHelpers`) — triggers reinitialization of axis-aligned helpers.
- **Emits:**
  - `"onplacerhidden"` — when the placer becomes hidden (e.g., due to build failure or UI blocking).
  - `"onplacershown"` — when the placer becomes visible again (e.g., after unblocking).
  - (Note: `"onbuilderset"` is referenced but *not triggered* by any internal code in this file.)