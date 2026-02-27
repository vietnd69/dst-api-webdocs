---
id: groomer
title: Groomer
description: This component manages interactive wardrobe or grooming stations that allow players to change appearances and outfits, handling user access, state transitions, and skin/appearance application logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f026d4e3
---

# Groomer

## Overview
The Groomer component enables an entity (typically a wardrobe or grooming station) to serve as an interactive dressing station for players. It tracks active users (changers), manages entry/exit states (e.g., `openwardrobe`, `dressupwardrobe`, `skin_change`), enforces sharing and range constraints, and coordinates the application of appearance changes (skins) via customizable callbacks. It dynamically adds/removes the `"groomer"` and `"dressable"` tags based on usage and dressing capability.

## Dependencies & Tags
- **Adds tags conditionally**: `"groomer"` (when `canuseaction` is true), `"dressable"` (when `canbedressed` is true).
- **Events listened to**:
  - `"onremove"` → `onclosegroomer`
  - `"ms_closepopup"` → `onclosepopup`
  - `"unhitched"` → `oncloseallgroomer`
  - `"onignite"` → `OnIgnite` (only when `canbeshared` is false).
- **No required components** are added via `AddComponent`; it assumes the owner `inst` has an appropriate state graph and necessary callbacks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the owning entity. |
| `changers` | `table` | `{}` | Dictionary mapping doer entities currently using the groomer to `true`. |
| `enabled` | `boolean` | `true` | Whether the groomer is currently active. |
| `canuseaction` | `boolean` | `true` | Whether the groomer should be included in action selection (adds `"groomer"` tag when true). |
| `canbeshared` | `boolean or nil` | `nil` | Whether multiple players can use the groomer simultaneously. |
| `canbedressed` | `boolean or nil` | `nil` | Whether the groomer supports outfit/skin changes (adds `"dressable"` tag when true). |
| `range` | `number` | `3` | Maximum distance (in units) for auto-disconnection if user moves too far. |
| `changeindelay` | `number` | `0` | Delay before applying changes (configured but not used in provided code). |
| `onchangeinfn` | `function or nil` | `nil` | Callback invoked during change-in transition. |
| `onopenfn` | `function or nil` | `nil` | Callback invoked when the groomer is first opened (first user enters). |
| `onclosefn` | `function or nil` | `nil` | Callback invoked when the last user exits. |
| `occupant` | `Entity or nil` | `nil` | The entity whose appearance is being changed (often the player, but may differ). |
| `occupantisself` | *(implicit in `GetOccupant`)* | — | Not stored explicitly; `GetOccupant()` returns `self.inst` if `occupantisself`, else `self.occupant`. |
| `canbeginchangingfn` | `function or nil` | `nil` | Custom validation callback before allowing a user to begin changing. |
| `canactivatechangingfn` | `function or nil` | `nil` | Custom validation callback before finalizing a change. |
| `applytargetskinsfn` | `function or nil` | `nil` | Callback responsible for applying the selected skins to the target. |
| `changefn` | `function or nil` | `nil` | Callback invoked when the change is initiated. |
| `beginchangingfn` | `function or nil` | `nil` | Callback invoked when a user begins using the groomer. |

## Main Functions

### `Groomer:SetOccupant(occupant)`
* **Description:** Sets the entity whose appearance will be modified when a player uses this groomer (e.g., for NPC or player dressing).  
* **Parameters:**  
  - `occupant` (`Entity`): The entity that will be the subject of appearance changes.

### `Groomer:SetCanUseAction(canuseaction)`
* **Description:** Controls whether the groomer appears in the player’s action list (e.g., right-click interaction); sets the `canuseaction` flag and updates the `"groomer"` tag accordingly.  
* **Parameters:**  
  - `canuseaction` (`boolean`): Whether the action should be available.

### `Groomer:SetCanBeDressed(canbedressed)`
* **Description:** Sets whether the groomer supports outfit/skin changes; updates the `"dressable"` tag based on this flag.  
* **Parameters:**  
  - `canbedressed` (`boolean`): Whether dressing/skin changes are allowed.

### `Groomer:Enable(enable)`
* **Description:** Enables or disables the groomer. When disabled, attempts to begin changing are rejected.  
* **Parameters:**  
  - `enable` (`boolean`): If omitted or `true`, enables the component.

### `Groomer:SetCanBeShared(canbeshared)`
* **Description:** Configures whether multiple players can use the groomer simultaneously. When sharing is disabled, listens for `"onignite"` to warn users mid-dress.  
* **Parameters:**  
  - `canbeshared` (`boolean`): If `true`, concurrency is enabled.

### `Groomer:SetRange(range)`
* **Description:** Sets the detection radius (units) for auto-disconnecting users who move too far away.  
* **Parameters:**  
  - `range` (`number`): Distance threshold.

### `Groomer:SetChangeInDelay(delay)`
* **Description:** Sets the change-in delay value (though not used in current code logic).  
* **Parameters:**  
  - `delay` (`number`): Delay in seconds.

### `Groomer:GetOccupant()`
* **Description:** Returns the entity whose skin/appearance is being changed. If `occupantisself` is true (implied, not a field), returns the groomer itself; otherwise returns `self.occupant`.  
* **Parameters:** None.

### `Groomer:CanBeginChanging(doer)`
* **Description:** Validates whether a given player (`doer`) may begin using the groomer. Checks `enabled`, busy state tags, sharing status, burning state, and custom callbacks.  
* **Parameters:**  
  - `doer` (`Entity`): The player attempting to use the groomer.  
* **Returns:**  
  - `true` if allowed; otherwise `false, "REASON"` (e.g., `"INUSE"`, `"BURNING"`).

### `Groomer:BeginChanging(doer)`
* **Description:** Registers a user (`doer`) as an active changer, transitions them to `"openwardrobe"`, and starts updates if this is the first user.  
* **Parameters:**  
  - `doer` (`Entity`): The player beginning to use the groomer.  
* **Returns:** `true` on success, `false` if already changering.

### `Groomer:EndChanging(doer)`
* **Description:** Stops a user’s grooming session, cleans up events, and returns them to `"idle"` via `"openwardrobe"` → `"idle"`. Ends updates if no users remain.  
* **Parameters:**  
  - `doer` (`Entity`): The player ending their session.

### `Groomer:EndAllChanging()`
* **Description:** Forces all current changers to end their sessions (e.g., on groomer removal or fire).  
* **Parameters:** None.

### `Groomer:ActivateChanging(doer, skins)`
* **Description:** Finalizes and applies selected skins (`skins`) for a user (`doer`). Calls `DoChange`, which triggers `"dressupwardrobe"` and `"skin_change"` states.  
* **Parameters:**  
  - `doer` (`Entity`): The player confirming the change.  
  - `skins` (`table`): Skins/parts to apply (structure depends on `applytargetskinsfn`).  
* **Returns:** `true` if activated, `false` otherwise.

### `Groomer:ApplyTargetSkins(target, doer, skins)`
* **Description:** Delegates skin/appearance application to `applytargetskinsfn` callback, if defined.  
* **Parameters:**  
  - `target` (`Entity`): Entity receiving the skins.  
  - `doer` (`Entity`): Player performing the change.  
  - `skins` (`table`): Skins to apply.

### `Groomer:OnUpdate(dt)`
* **Description:** Periodic check (while users are active) to disconnect users who move out of range or lose line-of-sight. Automatically stops updates when empty.  
* **Parameters:**  
  - `dt` (`number`): Delta time since last frame.

### `Groomer:OnRemoveFromEntity()`
* **Description:** Cleanup on entity removal: ends all users, removes `"onignite"` listener, and clears `"groomer"`/`"dressable"` tags.  
* **Parameters:** None.

## Events & Listeners
- **Listens for events:**
  - `"onremove"` → `onclosegroomer` (on the `doer`)
  - `"ms_closepopup"` → `onclosepopup` (on the groomer `inst`)
  - `"unhitched"` → `oncloseallgroomer` (on the groomer `inst`)
  - `"onignite"` → `OnIgnite` (only when `canbeshared` is `false`)