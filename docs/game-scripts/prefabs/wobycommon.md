---
id: wobycommon
title: Wobycommon
description: Utility module providing shared functions, constants, and command definitions for Woby (Walter's pet) including command wheel setup, courier delivery logic, and transformation effects.
tags: [utility, pet, woby, walter]
sidebar_position: 10

last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: utilities
source_hash: a644e71d
system_scope: entity
---

# Wobycommon

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`wobycommon.lua` is a utility module that exports shared functions and constants for Woby-related systems. It defines command wheel configurations, courier delivery logic, container restriction helpers, and transformation visual effects (lunar/shadow alignment). The module is required by Woby prefab files and related UI components to access command definitions, animation symbols, and helper functions. Unlike prefab files, this module does not spawn entities directly — it provides the building blocks for Woby's interactive systems.

## Usage example
```lua
local WobyCommon = require("prefabs/wobycommon")

-- Access command indices:
local mountIdx = WobyCommon.COMMANDS.MOUNT

-- Set up command wheel on a Woby instance:
WobyCommon.SetupCommandWheel(wobyInst)

-- Play lunar transformation effects:
WobyCommon.DoLunarAlignFx(wobyInst)

-- Check flag bits:
if bit._and(flags, WobyCommon.FLAGBITS.LUNAR) ~= 0 then
    -- Woby is in lunar form
end
```

## Dependencies & tags
**External dependencies:**
- `widgets/uianim` -- UIAnim widget for command wheel animations
- `STRINGS` -- localization strings for command labels
- `ACTIONS` -- action references for courier map
- `TUNING.SKILLS.WALTER` -- tuning constants for courier detection radius

**Components used:**
- `spellbook` -- command wheel interface, configured with SetItems, SetCanUseFn, SetOnOpenFn
- `container` -- item storage for courier delivery, accessed via slots, CanAcceptCount, GiveItem
- `colouradder` -- lunar/shadow alignment fade effects via PushColour/PopColour
- `rideable` -- GetRider() to determine transform effect target
- `skilltreeupdater` -- IsActivated() to check skill prerequisites for commands
- `playercontroller` -- PullUpMap() for courier map interface
- `focalpoint` -- StartFocusSource/StopFocusSource for camera focus during wheel open

**Tags:**
- `largecreature` -- checked to determine big vs small spell layout
- `transforming` -- blocks command wheel usage while transforming
- `woby_align_fade` -- added/removed during shadow alignment fade
- `wobybag{GUID}` -- dynamic tag for container access restriction

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FLAGBITS` | table | --- | Bit flag constants: BIG (0), SPRINT_DRAIN (1), ENDURANCE (2), LUNAR (3), SHADOW (4). |
| `SMALL_SYMBOLS` | table | --- | Array of animation symbol names for small Woby form (body, eye, tail, etc.). |
| `BIG_SYMBOLS` | table | --- | Array of animation symbol names for large Woby form (beefalo_body, beefalo_facebase, etc.). |
| `COMMAND_NAMES` | table | --- | Array of command name strings used for RPC and classification. |
| `COMMANDS` | table | --- | Inverted table mapping command names to numeric indices. |
| `ICON_SCALE` | number | `0.6` | Scale factor for command wheel icon widgets. |
| `ICON_RADIUS` | number | `60` | Hitbox radius for mouseover detection on command icons. |
| `SPELLBOOK_RADIUS` | number | `120` | Interaction radius for the spellbook command wheel. |
| `SPELLBOOK_FOCUS_RADIUS` | number | `120` | Camera focus radius when command wheel is open. |
| `CONTAINER_MUST_TAGS` | table | `{ "_container" }` | Required tags for courier delivery target containers. |
| `CONTAINER_CANT_TAGS` | table | --- | Excluded tags for courier delivery (wx78_backupbody, companion, etc.). |
| `ALLOWED_CONTAINER_TYPES` | table | `{ "chest", "pack" }` | Valid container types for courier delivery. |
| `RESKIN_MUST_HAVE_LUNAR` | table | `{ "_lunar" }` | Required tags for lunar reskin tool filtering. |
| `RESKIN_MUST_HAVE_SHADOW` | table | `{ "_shadow" }` | Required tags for shadow reskin tool filtering. |
| `RESKIN_MUST_NOT_HAVE_LUNARSHADOW` | table | `{ "_lunar", "_shadow" }` | Excluded tags for neutral reskin tool filtering. |

## Main functions
### `MakeWobyCommand(cmd)`
* **Description:** Factory function that returns a command execution closure. The returned function checks if `ThePlayer.woby_commands_classified` exists and executes the command; plays negative click sound on failure.
* **Parameters:** `cmd` -- numeric command index from COMMANDS table
* **Returns:** Function that takes `inst` parameter and executes the command
* **Error states:** None — gracefully handles nil `woby_commands_classified` by playing error sound.

### `SetupMouseOver(w)`
* **Description:** Configures a widget with an invisible Image hitbox for accurate mouseover detection. Sets the widget as non-clickable and adds a child Image with radius-based ray tracing.
* **Parameters:** `w` -- widget instance (typically UIAnim-based)
* **Returns:** None
* **Error states:** Errors if `w` is nil or lacks `AddChild` method.

### `MakeAutocastToggle(name, noclicksound, overrideanimname)`
* **Description:** Factory function that returns a widget postinit function for autocast toggle buttons. The returned function sets up mouseover hitbox, adds a ring animation that updates based on command state, and configures click sounds.
* **Parameters:**
  - `name` -- string command name for state checking
  - `noclicksound` -- boolean to suppress click sound override
  - `overrideanimname` -- optional alternate animation name
* **Returns:** Function that takes widget `w` and configures autocast behavior
* **Error states:** Errors if `w` lacks required methods (`AddChild`, `GetAnimState`, `OnUpdate`).

### `SetupCommandWheel(inst)`
* **Description:** Initializes the spellbook component on Woby with command wheel configuration. Sets radius, focus radius, open/close callbacks, items array, and background data. Determines sound path based on `largecreature` tag. Schedules client-side refresher setup on non-master sims.
* **Parameters:** `inst` -- Woby entity instance
* **Returns:** None
* **Error states:** Errors if `inst` lacks `AddComponent` method or `spellbook` component is unavailable.

### `SetupClientCommandWheelRefreshers(inst, player)`
* **Description:** Registers event listeners for skill tree changes to refresh the command wheel. Listens to `onactivateskill_client`, `ondeactivateskill_client`, and `skilltreeinitialized_client`. Guards against duplicate listener registration via `inst._onskillrefreh_wobycommon`.
* **Parameters:**
  - `inst` -- Woby entity instance
  - `player` -- player entity with skilltreeupdater component
* **Returns:** None
* **Error states:** Errors if player is nil (no guard before ListenForEvent calls that use player as context parameter).

### `RefreshCommands(inst, player)`
* **Description:** Rebuilds the `inst._spells` array based on Woby's size and player's activated skills. Behavior branches: uses BIG_SPELLS_* arrays if `inst:HasTag("largecreature")`, otherwise SMALL_SPELLS_*; each command is included only if `v.skill` is nil or `skilltreeupdater:IsActivated(v.skill)` returns true. Inserts SPACER and BLANK entries for layout. Shifts entries if fewer than 10 commands are active to maintain centered layout.
* **Parameters:**
  - `inst` -- Woby entity instance
  - `player` -- player entity for skill checks
* **Returns:** None
* **Error states:** Errors if `inst._spells` is nil (SetupCommandWheel must be called first). Errors if player is nil (no guard before player.components.skilltreeupdater access).



### `WobyCourier_ForceDelivery(_pet, itemcountmax)`
* **Description:** Forces delivery of items from Woby's container to valid chests near the courier destination. Two-pass algorithm: first matches items to chests that already contain that prefab, then fills remaining space. Stops when `itemcountmax` is reached. Sets `outfordelivery` netvar to false on completion.
* **Parameters:**
  - `_pet` -- Woby entity with courier data
  - `itemcountmax` -- optional maximum items to deliver
* **Returns:** None (early returns when limit reached)
* **Error states:** Errors if `_pet.woby_commands_classified` is nil (no guard before .courierdata access). Errors if `_pet.components.container` is nil.

### `WobyCourier_FindValidContainerForItem(_pet, item)`
* **Description:** Finds a valid container near the courier destination that can accept the given item. Two-pass search: first prefers chests containing matching prefabs, then any chest with space. Returns the first valid container found.
* **Parameters:**
  - `_pet` -- Woby entity with courier data
  - `item` -- item entity to deliver
* **Returns:** Container entity or `nil` if no valid container found
* **Error states:** Errors if `_pet.woby_commands_classified` is nil (no guard before .courierdata access).

### `RestrictContainer(inst, restrict)`
* **Description:** Toggles container access restriction based on player ownership. When `restrict` is true, adds a unique `wobybag{GUID}` tag to the linked player and sets `restrictedtag` on the container. Closes the container for players without the tag. When false, removes the tag from the player.
* **Parameters:**
  - `inst` -- container entity (Woby's bag)
  - `restrict` -- boolean to enable/disable restriction
* **Returns:** None
* **Error states:** Errors if `inst.components.container` is nil (no guard before .restrictedtag access). Errors if `inst._playerlink` is nil or invalid when removing restriction.

### `ReskinToolFilterFn(inst)`
* **Description:** Returns tag requirements for reskin tool filtering based on Woby's current form. Checks AnimState build name for `_lunar` or `_shadow` substrings and returns appropriate must-have/must-not-have tag arrays.
* **Parameters:** `inst` -- entity to filter (typically reskin tool)
* **Returns:** Two tables: `must_have` and `must_not_have` tag arrays
* **Error states:** Errors if `inst.AnimState` is nil (no guard before :GetBuild() call).

### `DoLunarAlignFx(inst)`
* **Description:** Plays lunar transformation sound and starts a fade-out effect on the target (rider or Woby). Cancels existing fade tasks, adds `woby_align_fade` tag, and creates a periodic task that interpolates add colour from white to transparent over 15 ticks.
* **Parameters:** `inst` -- Woby entity instance
* **Returns:** None
* **Error states:** Errors if target (rider or inst) lacks both components.colouradder and AnimState (ApplyLunarAlignAddColour falls back to AnimState:SetAddColour if colouradder missing, but crashes if neither exists).

### `DoShadowAlignFx(inst)`
* **Description:** Plays shadow transformation sound and starts a fade-in effect on the target (rider or Woby). Cancels existing fade tasks and creates a periodic task that interpolates mult colour from black to normal over 15 ticks. Adds/removes `woby_align_fade` tag based on fade progress.
* **Parameters:** `inst` -- Woby entity instance
* **Returns:** None
* **Error states:** Errors if target (rider or inst) lacks AnimState (ApplyShadowAlignMultColour directly calls target.AnimState:SetMultColour with no nil guard or fallback).



## Events & listeners
- **Listens to (client-side):** `onactivateskill_client` -- triggers `RefreshCommands` when skill is activated
- **Listens to (client-side):** `ondeactivateskill_client` -- triggers `RefreshCommands` when skill is deactivated
- **Listens to (client-side):** `skilltreeinitialized_client` -- triggers initial `RefreshCommands` after skill tree loads
- **Pushes:** None identified — this module only listens to events, does not push them