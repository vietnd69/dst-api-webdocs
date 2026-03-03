---
id: wardrobe
title: Wardrobe
description: Manages dressing interactions for entities, including skin and clothing changes, shared usage, and animation states.
tags: [inventory, dressing, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 50c733b7
system_scope: entity
---
# Wardrobe

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `wardrobe` component enables an entity to function as a dressing station where players or other entities can change skins and clothing. It coordinates animation state transitions (e.g., `openwardrobe`, `dressupwardrobe`, `changeinwardrobe`), handles concurrent usage via `changers` tracking, and integrates with the `skinner`, `burnable`, and `talker` components to enforce constraints and provide feedback. When `canbedressed` is `true`, the wardrobe dresses the wardrobe entity itself; otherwise, it dresses the doer.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wardrobe")
inst.components.wardrobe:Enable(true)
inst.components.wardrobe:SetCanBeShared(false)
inst.components.wardrobe:SetRange(4)
inst.components.wardrobe:SetChangeInDelay(1.0)
inst.components.wardrobe:SetCanBeDressed(true)
```

## Dependencies & tags
**Components used:** `burnable`, `skinner`, `talker`
**Tags:** Adds `"wardrobe"` and `"dressable"` conditionally based on `canuseaction` and `canbedressed`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `changers` | table | `{}` | Map of `doer` entities currently using the wardrobe; keys are entity instances. |
| `enabled` | boolean | `true` | Whether the wardrobe is usable at all. |
| `canuseaction` | boolean | `true` | Whether the wardrobe appears in action collections (affects `"wardrobe"` tag). |
| `canbedressed` | boolean | `nil` | Whether the wardrobe dresses the wardrobe entity (`true`) or the doer (`false`/`nil`). |
| `canbeshared` | boolean | `false` | Whether multiple entities may use the wardrobe simultaneously. |
| `range` | number | `3` | Max distance from the wardrobe at which a user is still considered inside. |
| `changeindelay` | number | `0` | Delay (in seconds) before triggering post-change logic in non-shared mode. |
| `onchangeinfn` | function | `nil` | Callback fired after `changeinwardrobe` animation starts in non-shared mode. |
| `ondressupfn` | function | `nil` | Callback for the dressing phase; takes a completion callback as argument. |
| `onopenfn` | function | `nil` | Callback fired when the first user opens the wardrobe (i.e., `changers` transitions from empty). |
| `onclosefn` | function | `nil` | Callback fired when the last user closes the wardrobe. |

## Main functions
### `SetCanUseAction(canuseaction)`
* **Description:** Controls whether the wardrobe can be targeted by actions. Sets the `"wardrobe"` tag based on the value.
* **Parameters:** `canuseaction` (boolean) — whether the wardrobe is accessible via actions.
* **Returns:** Nothing.

### `SetCanBeDressed(canbedressed)`
* **Description:** Sets the dressing mode. When `true`, the wardrobe entity is dressed; otherwise, the doer is dressed.
* **Parameters:** `canbedressed` (boolean or `nil`) — target of the dressing operation.
* **Returns:** Nothing.

### `Enable(enable)`
* **Description:** Enables or disables the wardrobe. When disabled, callers cannot begin changing.
* **Parameters:** `enable` (boolean) — `true` enables usage (default); `false` disables.
* **Returns:** Nothing.

### `SetCanBeShared(canbeshared)`
* **Description:** Enables or disables multi-user usage. When disabled, the wardrobe listens to `"onignite"` to end all users if it catches fire.
* **Parameters:** `canbeshared` (boolean) — `true` allows concurrent usage.
* **Returns:** Nothing.

### `SetRange(range)`
* **Description:** Sets the radius around the wardrobe within which users remain considered "inside".
* **Parameters:** `range` (number) — max distance in world units.
* **Returns:** Nothing.

### `SetChangeInDelay(delay)`
* **Description:** Sets the delay before the `"changeinwardrobe"` animation completes and post-change logic runs (non-shared mode only).
* **Parameters:** `delay` (number) — delay in seconds.
* **Returns:** Nothing.

### `CanBeginChanging(doer)`
* **Description:** Validates whether a given entity (`doer`) may begin using the wardrobe.
* **Parameters:** `doer` (entity instance) — the player or entity attempting to use the wardrobe.
* **Returns:**  
  - `true` if usage may proceed.  
  - `false, "INUSE"` if the wardrobe is disabled or already in use (non-shared).  
  - `false, "BURNING"` if the wardrobe is on fire.  
  - `false` if `doer` is busy or already in the process.
* **Error states:** Returns early with `false` if `doer.sg == nil` or `doer.sg` has the `"busy"` state tag (except `opengift`).

### `BeginChanging(doer)`
* **Description:** Starts the dressing process for `doer`. Enters the `"openwardrobe"` animation state.
* **Parameters:** `doer` (entity instance).
* **Returns:** `true` if successfully started; `false` if `doer` is already in `changers`.
* **Error states:** Does nothing and returns `false` if `doer` is already in the process.

### `EndChanging(doer)`
* **Description:** Ends the dressing process for `doer`, cleans up event listeners, and potentially fires the close callback.
* **Parameters:** `doer` (entity instance).
* **Returns:** Nothing.
* **Notes:** Fires `onskinschanged` on `doer` and transitions `doer` back to `"idle"` if still in the wardrobe.

### `EndAllChanging()`
* **Description:** Ends dressing for all current users.
* **Parameters:** None.
* **Returns:** Nothing.

### `ActivateChanging(doer, skins)`
* **Description:** Initiates the actual skin/clothing application phase based on current `canbedressed` and `canbeshared` settings.
* **Parameters:**  
  - `doer` (entity instance) — the dressing user.  
  - `skins` (table) — a table of keys `{ base, body, hand, legs, feet }` with skin/clothing names as values.
* **Returns:** `true` if the changing process started; `false` if validation failed (e.g., `skins == nil`, `doer` not in `"openwardrobe"` state, or no `skinner` component).
* **Notes:** Calls `DoDoerChanging` or `DoTargetChanging` internally.

### `ApplySkins(doer, diff)`
* **Description:** Applies selected clothing/skins to `doer`, using `skinner` methods (`SetSkinName`, `ClearClothing`, `SetClothing`).
* **Parameters:**  
  - `doer` (entity instance).  
  - `diff` (table) — map with keys `base`, `body`, `hand`, `legs`, `feet`; only non-`nil` and changed values are applied.
* **Returns:** Nothing.

### `ApplyTargetSkins(target, doer, skins)`
* **Description:** Applies selected clothing/skins to the wardrobe entity itself when `canbedressed == true`.
* **Parameters:**  
  - `target` (entity instance) — the wardrobe entity.  
  - `doer` (entity instance) — the user (for ownership tracking).  
  - `skins` (table) — mapping `{ body, hand, legs, feet }` for `AnimState:AssignItemSkins`.
* **Returns:** Nothing.
* **Notes:** Clears all existing clothing on the target and pushes `dressedup` event.

### `OnUpdate(dt)`
* **Description:** Called when the wardrobe is updating (i.e., has users). Automatically ends usage for users who move out of range or cannot see the wardrobe.
* **Parameters:** `dt` (number) — delta time.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onignite"` — stops all current dressing sessions and notifies users if `canbeshared == false`.  
  - `"onremove"` — triggers `onclosewardrobe` callback for a doer when removed.  
  - `"ms_closepopup"` — captures wardrobe popup closure and invokes `onclosewardrobe`.
- **Pushes:**  
  - `dressedup` — fired on the target entity after `ApplyTargetSkins` completes.  
  - `onskinschanged` — fired on the doer when ending a dressing session.

### `onclosewardrobe`
* **Type:** Internal callback (not an event).  
* **Description:** Invoked on popup close; re-evaluates the result of the dressing operation. If `ActivateChanging` fails, calls `EndChanging`.

### `onclosepopup`
* **Type:** Internal listener function.  
* **Description:** Parses `ms_closepopup` event data for `POPUPS.WARDROBE`, extracts skins, and delegates to `onclosewardrobe`.

### `OnIgnite`
* **Type:** Event handler.  
* **Description:** When the wardrobe catches fire, ends all ongoing dressing sessions and tells users why via `talker:Say`.
