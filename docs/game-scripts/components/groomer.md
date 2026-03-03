---
id: groomer
title: Groomer
description: Manages clothing and grooming interactions for dressable entities, handling entering/exiting the grooming state, skin changes, and shared/single-user access.
tags: [clothing, dressing, interaction, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f026d4e3
system_scope: entity
---

# Groomer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Groomer` enables an entity to function as a dressing station (e.g., wardrobe or grooming rack), allowing other entities to enter a special "openwardrobe" state, change skins (clothing/appearance), and exit cleanly. It manages multi-user support, range-based auto-closing, fire safety (prevents use while burning), and state transitions using the stategraph system. The component also dynamically adds/removes the `groomer` and `dressable` tags based on usability.

It depends on and integrates with the `burnable` and `talker` components for safety announcements and state validation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("groomer")
inst:AddComponent("dressable")
inst:AddTag("wardrobe")

inst.components.groomer:SetCanBeShared(true)
inst.components.groomer:SetRange(5)
inst.components.groomer:SetCanBeDressed(true)
inst.components.groomer:SetCanUseAction(true)
```

## Dependencies & tags
**Components used:** `burnable`, `talker`
**Tags:** Adds `groomer` and `dressable` conditionally; removes both on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `changers` | table | `{}` | Map of `doer` entities currently in the `openwardrobe` state. |
| `enabled` | boolean | `true` | Whether the grooming functionality is active. |
| `canuseaction` | boolean | `true` | Whether this groomer appears in the player's action list (e.g., via mouseover or radial menu). |
| `canbedressed` | boolean | `nil` | Whether this groomer supports dressing (i.e., skin changes). |
| `canbeshared` | boolean | `false` | Whether multiple entities can use the groomer simultaneously. |
| `range` | number | `3` | Distance threshold for auto-closing the grooming session. |
| `changeindelay` | number | `0` | Delay before starting skin change after activation. |
| `occupant` | entity or `nil` | `nil` | Optional entity that this groomer acts as (e.g., reference to the wardrobe itself for skin application context). |
| `occupantisself` | boolean | `nil` | Used internally by `GetOccupant()`. |

*Note: Some fields (`occupantisself`, `canbeginchangingfn`, `canactivatechangingfn`, `changefn`, `onopenfn`, `onclosefn`, `applytargetskinsfn`, `onclosepopupfn`) are hook functions—settable via metaprogramming or extension—but are not initialized in the constructor.*

## Main functions
### `SetCanUseAction(canuseaction)`
*   **Description:** Controls whether the groomer appears in player action collections (e.g., radial menus or proximity prompts). Also triggers the `canuseaction` callback to add/remove the `groomer` tag.
*   **Parameters:** `canuseaction` (boolean) – enables or disables use.
*   **Returns:** Nothing.

### `SetCanBeDressed(canbedressed)`
*   **Description:** Sets whether the groomer supports dressing (i.e., enables skin/appearance changes). Triggers the `canbedressed` callback to manage the `dressable` tag.
*   **Parameters:** `canbedressed` (boolean) – enables or disables dressing.
*   **Returns:** Nothing.

### `Enable(enable)`
*   **Description:** Globally enables or disables the grooming functionality. When disabled, `CanBeginChanging` will return `false` with reason `"INUSE"`.
*   **Parameters:** `enable` (boolean, optional) – defaults to `true`.
*   **Returns:** Nothing.

### `SetCanBeShared(canbeshared)`
*   **Description:** Enables or disables shared usage (multiple users). When `true`, removes the fire-safety listener to avoid blocking use during fire; when `false`, adds the listener to deny use while burning.
*   **Parameters:** `canbeshared` (boolean) – whether multiple entities can use simultaneously.
*   **Returns:** Nothing.

### `SetRange(range)`
*   **Description:** Configures the maximum distance an entity can be from the groomer before the grooming session ends automatically.
*   **Parameters:** `range` (number) – maximum distance threshold.
*   **Returns:** Nothing.

### `GetOccupant()`
*   **Description:** Returns the entity acting as the “occupant” of this groomer (typically the groomer’s own `inst`, unless `occupant` is explicitly set).
*   **Returns:** entity or `nil` – the occupant entity.

### `CanBeginChanging(doer)`
*   **Description:** Validates whether `doer` can begin a grooming session. Checks enabled status, stategraph busy tags, fire, usage conflict, and custom `canbeginchangingfn` hooks.
*   **Parameters:** `doer` (entity) – the entity attempting to start grooming.
*   **Returns:** `true`, or `false, reason` (e.g., `"INUSE"`, `"BURNING"`).
*   **Error states:** Returns `false, "BURNING"` if `burnable.IsBurning()` is `true`; returns `false, "INUSE"` if `enabled` is `false` or the groomer is in use and not shareable.

### `BeginChanging(doer)`
*   **Description:** Initiates a grooming session for `doer`. Enters the `"openwardrobe"` stategraph state and starts listening for cleanup events. If this is the first user, begins updating this component for range checks.
*   **Parameters:** `doer` (entity) – the entity starting the session.
*   **Returns:** `true` if the session started successfully; `false` if already in session.

### `EndChanging(doer)`
*   **Description:** Ends a grooming session for `doer`. Cleans up listeners, restores `"idle"` stategraph state, and stops updating if no users remain.
*   **Parameters:** `doer` (entity) – the entity ending the session.
*   **Returns:** Nothing.

### `EndAllChanging()`
*   **Description:** Ends grooming sessions for all active users. Used during removal from entity or fire events.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ActivateChanging(doer, skins)`
*   **Description:** Begins the actual skin change process for `doer`. Validates state, then transitions to `"dressupwardrobe"` → `"skin_change"`, applying the provided `skins` via `ApplyTargetSkins`.
*   **Parameters:** `doer` (entity), `skins` (table or `nil`) – the skin IDs to apply.
*   **Returns:** `true` on success; `false` if validation fails (e.g., wrong state, no occupant, custom hook blocked it).
*   **Error states:** Returns `false` if `skins` is `nil`, `doer` is not in `"openwardrobe"`, occupant is `nil`, or `canactivatechangingfn` returns `false`.

### `ApplyTargetSkins(target, doer, skins)`
*   **Description:** Applies the selected skins to `target` using the `applytargetskinsfn` hook. Typically used to update clothing/skin appearance.
*   **Parameters:** `target` (entity), `doer` (entity), `skins` (table) – skin IDs to apply.
*   **Returns:** Nothing (calls the hook if defined).

### `OnUpdate(dt)`
*   **Description:** Periodically checks if active users are still within `range` and visible. Ends sessions for users who exceed the threshold.
*   **Parameters:** `dt` (number) – delta time.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"onignite"` – handled by `OnIgnite` (blocks grooming when burning if not shareable).
  - `"onremove"` – triggers `onclosegroomer`.
  - `"ms_closepopup"` – triggers `onclosepopup`.
  - `"unhitched"` – triggers `oncloseallgroomer` (closes all sessions if entity is unmounted).
- **Pushes:** No events directly.

## Notes
- The component relies on stategraph hooks: `"openwardrobe"`, `"dressupwardrobe"`, and `"skin_change"` must exist in the entity’s stategraph.
- Tags `groomer` and `dressable` are only added conditionally based on `canuseaction` and `canbedressed`, respectively.
- Fire handling (`OnIgnite`) does not fire if `canbeshared` is `true`, allowing simultaneous use even in fire.
