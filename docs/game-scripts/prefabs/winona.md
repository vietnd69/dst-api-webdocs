---
id: winona
title: Winona
description: Defines Winona as a playable character, configuring her skills, recipes, visual assets, and specialization mechanics.
tags: [player, character, crafting, skilltree, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 453fcdea
system_scope: player
---

# Winona

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona.lua` defines the prefab and behavior for the character Winona, a fast-building, technologically adept character whose utility scales with skill progression. It leverages the `MakePlayerCharacter` framework to integrate her with DST’s player system, setting up shared (common) and server-specific (master) logic. Key integrations include the `builder`, `skilltreeupdater`, `inspectaclesparticipant`, `reticule`, and `roseinspectableuser` components, which control her recipe availability, skill-based modulations, and inspection-related interactions.

## Usage example
```lua
-- Typically loaded automatically by the game when Winona is selected
-- Custom usage in a mod might register an event listener for skill changes:
TheWorld:ListenForEvent("winona_catapultskillchanged", function(inst)
    print("Winona's catapult skill has changed.")
end)
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `foodaffinity`, `grue`, `builder`, `playeractionpicker`, `reticule`, `inspectaclesparticipant`, `skilltreeupdater`, `roseinspectableuser`  
**Tags:** `handyperson`, `fastbuilder`, `hungrybuilder`, `quagmire_fasthands` (Quagmire mode), `quagmire_shopper` (Quagmire mode)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charlie_vinesave` | any | `nil` | Stores character state for Charlievine serialization (saved/restored manually). |

## Main functions
### `GetPointSpecialActions(inst, pos, useitem, right, usereticulepos)`
* **Description:** Determines the special action shown in the reticule for Winona’s right-click interactions. Specifically, it enables `ACTIONS.LOOKAT` when wearing and using the `roseglasseshat` with close-inspector functionality.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `pos` (Vector3) — Target position.  
  - `useitem` (entity or nil) — Currently equipped item; if `nil`, uses the head slot.  
  - `right` (boolean) — Whether the input is a right-click.  
  - `usereticulepos` (boolean) — Whether to search along a local ray for a valid inspection point.  
* **Returns:** `{ ACTIONS.LOOKAT }` (table) or `{}` (empty table).  
* **Error states:** Returns an empty table if no valid inspection point is found or conditions aren’t met.

### `ReticuleTargetFn()`
* **Description:** Computes a custom target position for Winona’s reticule, scanning along her local X-axis from 2.5 to 1 units away to find the first valid inspection spot.  
* **Parameters:** None.  
* **Returns:** `Vector3` — The target position, falling back to her world position if no valid spot is found.

### `OnSetOwner(inst)`
* **Description:** Assigns the `GetPointSpecialActions` function to the `playeractionpicker` component’s `pointspecialactionsfn` property upon ownership assignment.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
* **Returns:** Nothing.

### `OnActivateSkill(inst, data)`
* **Description:** Responds to skill activation events. Triggers world-level events for catapult, spotlight, and battery-related skills.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `data` (table or nil) — Must contain `data.skill` (string).  
* **Returns:** Nothing.

### `OnDeactivateSkill(inst, data)`
* **Description:** Responds to skill deactivation. Removes builder recipes associated with deactivated `winona_wagstaff_1` or `winona_wagstaff_2` skills.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `data` (table or nil) — Must contain `data.skill` (string).  
* **Returns:** Nothing.
* **Error states:** No effect if `data` is `nil`, or if the skill isn’t `"winona_wagstaff_1"` or `"winona_wagstaff_2"`.

### `OnSkillTreeInitialized(inst)`
* **Description:** Ensures builder recipes are correctly added/removed on skilltree initialization based on which Wagstaff upgrades are unlocked. Also broadcasts skill-change events for other systems to react.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes Winona’s `charlie_vinesave` state for savegames.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `data` (table) — Save data table.  
* **Returns:** Nothing.

### `OnPreLoad(inst, data, ents)`
* **Description:** Restores `charlie_vinesave` from save data during character load.  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `data` (table) — Loaded save data.  
  - `ents` (table) — Entity mapping (unused in this function).  
* **Returns:** Nothing.

### `OnLoad(inst, data, ents)`
* **Description:** Clears `charlie_vinesave` after load if Winona is alive (resets state associated with Charlievine deaths).  
* **Parameters:**  
  - `inst` (entity) — The character instance.  
  - `data` (table) — Loaded save data.  
  - `ents` (table) — Entity mapping (unused in this function).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `setowner` — Calls `OnSetOwner`.  
  - `onactivateskill_server` — Calls `OnActivateSkill`.  
  - `ondeactivateskill_server` — Calls `OnDeactivateSkill`.  
  - `ms_skilltreeinitialized` — Calls `OnSkillTreeInitialized`.  
- **Pushes:**  
  - `winona_catapultskillchanged` — Fired on catapult, spotlight, or battery skill changes.  
  - `winona_spotlightskillchanged` — Fired on spotlight skill changes.  
  - `winona_batteryskillchanged` — Fired on battery skill changes.  
  - These events are always triggered on `ms_skilltreeinitialized` and whenever relevant skills are activated or deactivated.