---
id: wardrobe
title: Wardrobe
description: Manages interactive wardrobe functionality for entities, enabling players to change clothing or skin appearance via a state-machine-driven UI.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 50c733b7
---

# Wardrobe

## Overview
This component implements the wardrobe interaction logic within the Entity Component System. It enables an entity (typically a furniture item) to serve as a clothing/skin-changing station for players. It handles state transitions (e.g., opening/closing the wardrobe UI), enforces usage constraints (e.g., sharing, burning, range), and manages skin/application changes for both the wardrobe target (when dressable) and the player user.

## Dependencies & Tags
**Dependencies:**  
- `skinner` (on both `self.inst` and the `doer` player)  
- `burnable` (for fire interaction handling)  
- `talker` (for fire warning speech)  

**Tags added/removed:**  
- `"wardrobe"`: added when `canuseaction` is true, removed otherwise.  
- `"dressable"`: added when `canbedressed` is true, removed otherwise.  

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the entity hosting the wardrobe component. |
| `changers` | `table` | `{}` | Tracks active users currently changing skins via the wardrobe; keys are player entities. |
| `enabled` | `boolean` | `true` | Controls whether the wardrobe is usable. |
| `canuseaction` | `boolean` | `true` | Determines whether the wardrobe appears in player action collections. |
| `canbeshared` | `boolean` | `nil` (set to `false` via `SetCanBeShared`) | If `true`, multiple players may use the wardrobe simultaneously. |
| `canbedressed` | `boolean` | `nil` | If `true`, the wardrobe itself is the dressable target; otherwise, the player uses it as a changing station. |
| `range` | `number` | `3` | Maximum distance from the wardrobe at which a user remains connected to the session. |
| `changeindelay` | `number` | `0` | Delay (in seconds) before transitioning to `idle` state when `canbeshared` is `false`. |
| `onchangeinfn` | `function?` | `nil` | Callback invoked when `canbeshared` is `false` and a player begins changing inside. |
| `ondressupfn` | `function?` | `nil` | Callback invoked during target-dressing (`canbedressed=true`), expecting a continuation function. |
| `onopenfn` | `function?` | `nil` | Callback invoked when the wardrobe is first opened (first user enters). |
| `onclosefn` | `function?` | `nil` | Callback invoked when the wardrobe is closed (no more active users). |

## Main Functions

### `Wardrobe:SetCanUseAction(canuseaction)`
* **Description:** Sets whether the wardrobe is included in the player's action collection (e.g., right-click options). Also triggers tag updates (`"wardrobe"`).  
* **Parameters:**  
  - `canuseaction`: `boolean` — enables or disables action inclusion.

### `Wardrobe:SetCanBeDressed(canbedressed)`
* **Description:** Configures whether the wardrobe entity itself is dressable. When `true`, player actions will dress the wardrobe (e.g., equipping armor on a mannequin).  
* **Parameters:**  
  - `canbedressed`: `boolean` — enables/disables dressable behavior. Triggers tag updates (`"dressable"`).

### `Wardrobe:Enable(enable)`
* **Description:** Enables or disables the wardrobe entirely. Disabled wardrobes reject all change attempts.  
* **Parameters:**  
  - `enable`: `boolean?` — defaults to `true` if omitted or truthy.

### `Wardrobe:SetCanBeShared(canbeshared)`
* **Description:** Controls if multiple players may use the wardrobe concurrently. When `false`, automatically subscribes to `"onignite"` events to interrupt users during fire events.  
* **Parameters:**  
  - `canbeshared`: `boolean?` — shared usage is enabled only if explicitly `true`.

### `Wardrobe:SetRange(range)`
* **Description:** Sets the proximity threshold (in units) beyond which users are auto-disconnected from a wardrobe session.  
* **Parameters:**  
  - `range`: `number` — maximum allowed distance.

### `Wardrobe:CanBeginChanging(doer)`
* **Description:** Validates whether a specific player (`doer`) may start changing skins at the wardrobe. Checks state, concurrency, burning status, and proximity.  
* **Parameters:**  
  - `doer`: `Entity` — the player attempting to use the wardrobe.  
* **Returns:**  
  - `true` if allowed,  
  - `false, "REASON"` otherwise (e.g., `"INUSE"`, `"BURNING"`).

### `Wardrobe:BeginChanging(doer)`
* **Description:** Initiates a wardrobe session for a player. Handles skin UI transition (`"openwardrobe"`), event subscriptions, and state updates.  
* **Parameters:**  
  - `doer`: `Entity` — the player starting the session.  
* **Returns:** `boolean` — `true` if a new session was started, `false` if already active for this player.

### `Wardrobe:EndChanging(doer)`
* **Description:** Gracefully terminates a session for a single player, reverts state changes, emits `"onskinschanged"`, and updates update-frequency.  
* **Parameters:**  
  - `doer`: `Entity` — the player ending their session.

### `Wardrobe:EndAllChanging()`
* **Description:** Forces termination of all ongoing wardrobe sessions. Used during entity removal or fire events.  
* **Parameters:** None.

### `Wardrobe:ActivateChanging(doer, skins)`
* **Description:** Finalizes and executes skin changes based on selected options and wardrobe mode (`canbedressed`). Routes to `DoDoerChanging` (player-dressing) or `DoTargetChanging` (wardrobe-dressing).  
* **Parameters:**  
  - `doer`: `Entity` — the player.  
  - `skins`: `table` — table of skin IDs (`base`, `body`, `hand`, `legs`, `feet`).

### `Wardrobe:ApplyTargetSkins(target, doer, skins)`
* **Description:** Applies the specified skin layers to the wardrobe entity itself (when `canbedressed=true`). Updates animations and notifies listeners.  
* **Parameters:**  
  - `target`: `Entity` — the wardrobe entity.  
  - `doer`: `Entity` — the player performing the action.  
  - `skins`: `table` — skin IDs to apply.

### `Wardrobe:ApplySkins(doer, diff)`
* **Description:** Applies selected skin changes (e.g., clothing pieces, base skin) to the player (`doer`). Clears old items, sets new ones, and handles base skin switching.  
* **Parameters:**  
  - `doer`: `Entity` — the player whose appearance is changing.  
  - `diff`: `table` — delta of new/changed clothing/base items.

### `Wardrobe:OnUpdate(dt)`
* **Description:** Monitors active users; auto-disconnects those who move out of range or lose line of sight. Called only while `changers` is non-empty.  
* **Parameters:**  
  - `dt`: `number` — time elapsed since last frame.

### `Wardrobe:OnRemoveFromEntity()`
* **Description:** Cleanup callback invoked when the wardrobe entity is removed. Ends all sessions and removes tags.  
* **Parameters:** None.

## Events & Listeners
- **Listens for `"onremove"`** — triggers `onclosewardrobe` to finalize player session during entity removal.  
- **Listens for `"ms_closepopup"`** — handles UI closure (e.g., player clicking outside the wardrobe menu) via `onclosepopup`, then `onclosewardrobe`.  
- **Listens for `"onignite"`** — only when `canbeshared=false`; interrupts active sessions and alerts users.  
- **Pushes `"onskinschanged"`** — after `EndChanging`, notifies the player that their skin state was applied.  
- **Pushes `"dressedup"`** — after `ApplyTargetSkins`, notifies listeners (e.g., the wardrobe entity) that it was dressed.