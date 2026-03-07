---
id: wobycommon
title: Wobycommon
description: Utility module for Woby (Walter's companion creature) that manages command wheel setup, skill-aware UI rendering, container restrictions, alignment transformation effects, and courier delivery logic.
tags: [ai, ui, container, entity, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3f496847
system_scope: entity
---

# Wobycommon

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wobycommon.lua` is a shared utility module (not a component) that centralizes core logic for Walter's companion creature, Woby. It provides functions to initialize and manage Woby's action wheel (via `SpellBook`), handle dynamic spell availability based on player skilltree state, enforce container restrictions for courier bags, and generate visual/audio effects for lunar and shadow alignment transformations. This module is included by Woby prefabs and used during their initialization and operation.

## Usage example
```lua
local wobycommon = require("prefabs/wobycommon")

local inst = CreateEntity()
-- Attach the SpellBook component first
inst:AddComponent("spellbook")
-- Initialize Woby's command wheel
wobycommon.SetupCommandWheel(inst)
-- Later, update available spells when the player's skills change
wobycommon.RefreshCommands(inst, player)
```

## Dependencies & tags
**Components used:** `spellbook`, `container`, `rideable`, `colouradder`, `playercontroller`, `focalpoint`, `skilltreeupdater`, `stackable`  
**Tags:** Uses `largecreature`, `transforming`, `_container`, `companion`, `portablestorage`, `mermonly`, `mastercookware`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`; creates `wobybag*`, `woby_align_fade`

## Properties
No public properties — this module exposes only functions and constants for reuse.

## Main functions
### `SetupCommandWheel(inst)`
* **Description:** Initializes the `SpellBook` component on Woby with configuration for the action wheel, including radius, sounds, and spell item list. Sets up event listeners for skill activation/deactivation to refresh the wheel dynamically (client-side only).
* **Parameters:** `inst` (Entity) — The Woby entity instance.
* **Returns:** Nothing.
* **Error states:** On the client, delays refresh setup until after the current frame due to construction timing issues.

### `RefreshCommands(inst, player)`
* **Description:** Dynamically populates `inst._spells` based on whether Woby is `largecreature` or small, and which skilltree skills (e.g., `walter_woby_itemfetcher`) are activated. Replaces disabled spells with `BLANK` or `SPACER` entries.
* **Parameters:**  
  `inst` (Entity) — Woby entity; uses `inst._spells` as the spell array.  
  `player` (Entity) — Player entity used to query skilltree state.
* **Returns:** Nothing.
* **Error states:** Assumes `inst._spells` exists; does not handle missing player or skilltreeupdater.

### `MakeWobyCommand(cmd)`
* **Description:** Factory function that returns a closure to execute a named Woby command (e.g., `"PET"`, `"MOUNT"`). Plays a negative sound if the command fails.
* **Parameters:** `cmd` (string or int) — Command name or its index in `COMMANDS`.
* **Returns:** Function — A zero-argument function that invokes `ThePlayer.woby_commands_classified:ExecuteCommand(cmd)`.
* **Error states:** Returns a function that logs a negative sound on failure; does not guard against nil `ThePlayer` or `woby_commands_classified`.

### `DoLunarAlignFx(inst)`
* **Description:** Triggers a 15-frame fade effect for lunar alignment on the rider or Woby itself. Uses `colouradder` if present, otherwise falls back to `AnimState:SetAddColour`. Plays an SFX once at start.
* **Parameters:** `inst` (Entity) — Woby entity.
* **Returns:** Nothing.
* **Error states:** If `rideable` component is present, affects the rider; otherwise affects `inst`.

### `DoShadowAlignFx(inst)`
* **Description:** Triggers a 15-frame fade effect for shadow alignment using `AnimState:SetMultColour`. Plays an SFX once at start.
* **Parameters:** `inst` (Entity) — Woby entity.
* **Returns:** Nothing.
* **Error states:** Same as `DoLunarAlignFx`.

### `RestrictContainer(inst, restrict)`
* **Description:** Restricts or releases access to Woby's container to only the linked player. Adds/removes a uniquely named tag (e.g., `"wobybag1234"`) to the player and uses it as a `restrictedtag` in the container component.
* **Parameters:**  
  `inst` (Entity) — Woby entity with a `container` component.  
  `restrict` (boolean) — If `true`, restricts access; if `false`, removes restrictions.
* **Returns:** Nothing.
* **Error states:** Safely handles nil or invalid `inst._playerlink`.

### `WobyCourier_ForceDelivery(_pet, itemcountmax)`
* **Description:** Moves items from Woby's container to the nearest valid chest at the courier destination. Tries to match stacks by prefab first, then uses any available space.
* **Parameters:**  
  `_pet` (Entity) — Woby entity with a `container`.  
  `itemcountmax` (number?, optional) — Maximum items to deliver before returning early.
* **Returns:** Nothing.
* **Error states:** early return if `itemcountmax` threshold is reached; relies on `TheWorld.Map`, container tags, and `canacceptgivenitems`.

### `WobyCourier_FindValidContainerForItem(_pet, item)`
* **Description:** Returns the first valid container at the courier destination that can accept the given item (prefab match or space).
* **Parameters:**  
  `_pet` (Entity) — Woby entity with `courierdata`.  
  `item` (Entity) — The item to deliver.
* **Returns:** Entity or `nil`.

### `ReskinToolFilterFn(inst)`
* **Description:** Filter function for UI reskin logic. Returns `must_have`/`must_not_have` tag arrays to control whether an item can be skinned with lunar/shadow themes.
* **Parameters:** `inst` (Entity) — The item being skinned.
* **Returns:** Two arrays:  
  `must_have` (array or nil), `must_not_have` (array or nil).  
  Lunar items require `"_lunar"`, shadow require `"_shadow"`, others may not have either.

### `SetupMouseOver(w)`
* **Description:** Attaches an invisible `Image` hitbox with a raycast radius to a widget (e.g., spell button) to improve mouseover accuracy.
* **Parameters:** `w` (Widget) — UI widget (e.g., spell button).
* **Returns:** Nothing.

### `MakeAutocastToggle(name, noclicksound, overrideanimname)`
* **Description:** Factory that returns a post-init callback for spell widgets that enables autocast styling and sounds.
* **Parameters:**  
  `name` (string) — Autocast toggle ID.  
  `noclicksound` (boolean, optional) — Skip sound on toggle.  
  `overrideanimname` (string, optional) — Custom animation name.
* **Returns:** Function — Callback to set up ring, animation updates, and sound overrides.

## Events & listeners
- **Listens to:**  
  - `onremove` — Cleanup listener for source-based colour effects (via `colouradder`).  
  - `onactivateskill_client` / `ondeactivateskill_client` — Refreshes spell wheel when skills change.  
  - `skilltreeinitialized_client` — One-time refresh after skilltree is ready (client-side only).  
- **Pushes:**  
  None — this module does not fire events directly.