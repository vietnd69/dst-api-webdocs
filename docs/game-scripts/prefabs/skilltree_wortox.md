---
id: skilltree_wortox
title: Skilltree Wortox
description: Defines Wortox's skill tree configuration including skill definitions for nice, naughty, neutral, and allegiance paths with activation/deactivation callbacks, lock conditions, UI button decorations, and utility functions for panflute timer management, soul jar updates, reviver item linking, and lunar resistance setup.
tags: [skills, character, wortox, configuration, ui]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: bbc54cc8
system_scope: player
---

# Skilltree Wortox

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
This file defines the complete skill tree system for the character Wortox in Don't Starve Together. It contains skill definitions organized into moral alignment paths (nice, naughty, neutral) and allegiance paths (lunar, shadow), along with callback functions that execute when skills are activated or deactivated. The file includes utility functions for managing Wortox-specific mechanics such as the panflute timer, soul jar tracking, reviver item linking, and lunar resistance calculations. UI button decorations are also defined to display token balance visually in the skill tree interface. This configuration is passed to the skill tree system during character initialization and is not a component that attaches to entities.

## Usage example
```lua
local SkillTreeFns = require "components/skilltreefns"
local BuildSkillsData = require "prefabs/skilltree_wortox"

-- Build the skill tree data structure
local skillsData = BuildSkillsData(SkillTreeFns)

-- Access individual skill definitions (SKILLS is a flat table with skill keys)
local wortoxPanflute = skillsData.SKILLS.wortox_panflute_playing
local wortoxAllegiance = skillsData.SKILLS.wortox_allegiance_lunar

-- Filter skills by group property if needed
for skillName, skillData in pairs(skillsData.SKILLS) do
    if skillData.group == "nice" then
        print("Nice skill:", skillName)
    end
end

-- Check custom functions for inclination calculation
local inclination = skillsData.CUSTOM_FUNCTIONS.CalculateInclination(5, 3, "lunar")
print("Player inclination:", inclination)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- Accessed for SKILLS.WORTOX.TIPPED_BALANCE_THRESHOLD, WORTOX_PANFLUTE_INSPIRATION_WAIT, and WORTOX_PANFLUTE_INSPIRATION_WAIT_VARIANCE constants
- `SpawnPrefab` -- Called to spawn wortox_resist_fx prefab
- `GetRandomWithVariance` -- Called to calculate panflute timer duration with variance
- `EQUIPSLOTS` -- Accessed for HANDS slot constant in UpdateNabBags
- `TWOPI` -- Used as constant for random angle calculation in OnResistDamage
- `widgets/uianim` -- Required in button_decorations init to create animated token UI elements
- `widgets/widget` -- Required in button_decorations init to create token layer widget
- `TheWorld` -- Accessed for TheWorld.components.linkeditemmanager in wortox_lifebringer_1/3 ondeactivate
- `STRINGS` -- Accessed for SKILLTREE.WORTOX skill titles and descriptions
- `SkillTreeFns` -- Parameter passed to BuildSkillsData, used for CountTags, MakeCelestialChampionLock, MakeNoShadowLock, MakeFuelWeaverLock, MakeNoLunarLock

**Components used:**
- `timer` -- TimerExists, PauseTimer, ResumeTimer, StartTimer, StopTimer methods called for panflute timer management
- `inventory` -- GetEquippedItem called to check HANDS slot for wortox_nabbag
- `inventoryitem` -- owner property and GetGrandOwner method accessed for item ownership
- `equippable` -- IsEquipped method called to check if item is equipped
- `skilltreeupdater` -- IsActivated method called to check wortox_allegiance_lunar and wortox_panflute_playing skills
- `health` -- IsDead method called to check if entity is dead
- `container` -- Close method called on wortox_souljar items
- `linkeditem` -- LinkToOwnerUserID method called to unlink items
- `resistance` -- Added via AddComponent, configured with AddResistance, SetShouldResistFn, SetOnResistDamageFn
- `damagetyperesist` -- AddResist/RemoveResist called in wortox_allegiance_lunar/shadow onactivate/ondeactivate
- `damagetypebonus` -- AddBonus/RemoveBonus called in wortox_allegiance_lunar/shadow onactivate/ondeactivate
- `linkeditemmanager` -- ForEachLinkedItemForPlayerOfPrefab called in wortox_lifebringer_1/3 ondeactivate via TheWorld.components

**Tags:**
- `lock` -- check
- `nice` -- check
- `nice1` -- check
- `naughty` -- check
- `naughty1` -- check
- `neutral` -- check
- `lunar_favor` -- add
- `shadow_favor` -- add
- `allegiance` -- check
- `nabbaguser` -- add
- `player_lunar_aligned` -- add
- `player_shadow_aligned` -- add

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| SKILLS | table | --- | Contains all skill definitions organized by group (nice, naughty, neutral, allegiance). Each skill is a table with fields: title, desc, icon, pos, group, tags, locks, connects, onactivate, ondeactivate, lock_open, infographic, root, forced_focus, button_decorations, defaultfocus. |
| ORDERS | table | --- | Array of title position configurations for the skill tree UI, each entry contains title name and `{x, y}` coordinates. |
| CUSTOM_FUNCTIONS | table | --- | Utility functions for skill tree logic: CalculateInclination, ShouldResistFn, OnResistDamage, LunarResists, SetupLunarResists, TryResetPanfluteTimer, TryPanfluteTimerSetup. |
| title | string | --- | Skill display title from STRINGS.SKILLTREE.WORTOX. |
| desc | string | --- | Skill description from STRINGS.SKILLTREE.WORTOX. |
| icon | string | --- | Icon name for the skill UI element. |
| pos | table | --- | `{x, y}` position coordinates for the skill in the tree UI. |
| group | string | --- | Skill group alignment: 'nice', 'naughty', 'neutral', or 'allegiance'. |
| tags | table | --- | Array of tag strings for skill categorization and filtering. |
| locks | table | --- | Array of lock skill names that must be open for this skill to be unlockable. |
| connects | table | --- | Array of skill names this skill connects to in the tree graph. |
| onactivate | function | --- | Callback executed when the skill is activated/unlocked. Receives player inst. |
| ondeactivate | function | --- | Callback executed when the skill is deactivated/respec'd. Receives player inst. |
| lock_open | function | --- | Function that returns boolean indicating if a lock should be open. Receives prefabname, activatedskills, readonly. |
| infographic | boolean | --- | If true, skill is an informational display element rather than unlockable. |
| root | boolean | --- | If true, skill is a root node in the skill tree graph. |
| forced_focus | table | --- | Optional `{left, right}` mapping to force UI focus to adjacent skills. |
| button_decorations | table | --- | UI decoration config with init and onskillschanged callbacks for custom button rendering. |
| defaultfocus | boolean | --- | If true, this skill receives default focus when the tree opens. |

## Main functions

### `OnTimerDone(inst, data)`
* **Description:** Callback fired when a timer completes. Adds the wortox_panflute_buff debuff if the completed timer is wortox_panflute_playing.
* **Parameters:**
  - `inst` -- Entity instance that owns the timer
  - `data` -- Timer completion data table containing timer name
* **Returns:** nil
* **Error states:** None

### `OnDeath(inst, data)`
* **Description:** Callback fired on entity death. Pauses the wortox_panflute_playing timer if it exists.
* **Parameters:**
  - `inst` -- Entity instance that died
  - `data` -- Death event data
* **Returns:** nil
* **Error states:** None

### `OnRespawnedFromGhost(inst, data)`
* **Description:** Callback fired when entity respawns from ghost form. Resumes the wortox_panflute_playing timer if it was paused.
* **Parameters:**
  - `inst` -- Entity instance that respawned
  - `data` -- Respawn event data
* **Returns:** nil
* **Error states:** None

### `UpdateSoulJars(item)`
* **Description:** Updates the percent display on wortox_souljar items by calling UpdatePercent().
* **Parameters:**
  - `item` -- Entity instance to check for wortox_souljar prefab
* **Returns:** nil
* **Error states:** None

### `CloseAndUpdateSoulJars(item, doer)`
* **Description:** Closes the container component on wortox_souljar items and updates their percent display.
* **Parameters:**
  - `item` -- Entity instance to check for wortox_souljar prefab
  - `doer` -- Player entity closing the container
* **Returns:** nil
* **Error states:** None

### `AllowConsumption_wortox_reviver(item, player)`
* **Description:** Enables consumption on the item by calling SetAllowConsumption(true).
* **Parameters:**
  - `item` -- Item entity to allow consumption on
  - `player` -- Player entity (unused in function body)
* **Returns:** nil
* **Error states:** None

### `DisallowConsumption_wortox_reviver(item, player)`
* **Description:** Disables consumption on the item by calling SetAllowConsumption(false).
* **Parameters:**
  - `item` -- Item entity to disallow consumption on
  - `player` -- Player entity (unused in function body)
* **Returns:** nil
* **Error states:** None

### `LinkUnlinked_wortox_reviver(item, player)`
* **Description:** Attempts to attach the player's Wortox ID to wortox_reviver items.
* **Parameters:**
  - `item` -- Item entity to check for wortox_reviver prefab
  - `player` -- Player entity to attach as owner via TryToAttachWortoxID
* **Returns:** nil
* **Error states:** None

### `Unlink_wortox_reviver(item, player)`
* **Description:** Unlinks the item from its owner by calling LinkToOwnerUserID(nil) on the linkeditem component.
* **Parameters:**
  - `item` -- Item entity with linkeditem component
  - `player` -- Player entity (unused in function body)
* **Returns:** nil
* **Error states:** None

### `UpdateNabBags(inst)`
* **Description:** Checks if the HANDS equip slot contains a wortox_nabbag and triggers OnInventoryStateChanged if found.
* **Parameters:**
  - `inst` -- Entity instance with inventory component
* **Returns:** nil
* **Error states:** None

### `CalculateInclination(nice, naughty, affinitytype)`
* **Description:** Calculates the moral inclination based on nice vs naughty token difference. Returns 'nice', 'naughty', or nil based on TUNING.SKILLS.WORTOX.TIPPED_BALANCE_THRESHOLD.
* **Parameters:**
  - `nice` -- Number of nice tokens
  - `naughty` -- Number of naughty tokens
  - `affinitytype` -- Optional affinity type for bias calculation
* **Returns:** string ('nice' or 'naughty') or nil
* **Error states:** None

### `ShouldResistFn(item)`
* **Description:** Determines if lunar resistance should activate. Returns true if item is equipped, owner has wortox_allegiance_lunar skill activated, and portal hop succeeds.
* **Parameters:**
  - `item` -- Item entity with equippable and inventoryitem components
* **Returns:** boolean
* **Error states:** None

### `OnResistDamage(item, damage, attacker)`
* **Description:** Spawns wortox_resist_fx at a random position around the owner when damage is resisted. Calculates spawn angle based on attacker position if available.
* **Parameters:**
  - `item` -- Item entity receiving damage
  - `damage` -- Damage amount being resisted
  - `attacker` -- Attacking entity (optional, used for angle calculation)
* **Returns:** nil
* **Error states:** None

### `SetupLunarResists(item)`
* **Description:** Adds a resistance component to the item and configures it with LunarResists damage types, ShouldResistFn, and OnResistDamageFn callbacks.
* **Parameters:**
  - `item` -- Item entity to add resistance component to
* **Returns:** nil
* **Error states:** None

### `TryResetPanfluteTimer(inst)`
* **Description:** Starts the wortox_panflute_playing timer if the skill is activated and timer doesn't exist. Pauses timer if entity is dead.
* **Parameters:**
  - `inst` -- Entity instance with skilltreeupdater, timer, and health components
* **Returns:** nil
* **Error states:** None

### `TryPanfluteTimerSetup(inst)`
* **Description:** Initializes or cleans up the wortox_panflute_playing timer based on skill activation state. Registers event listeners for timerdone, death, and ms_respawnedfromghost when active. Removes timer and debuff when inactive.
* **Parameters:**
  - `inst` -- Entity instance with skilltreeupdater, timer, health, and debuff components
* **Returns:** nil
* **Error states:** None

### `UpdateToken(token, diff, instant, nice, MAX_TOKENS, affinitytype)`
* **Description:** Updates token animation state based on token count and affinity type. Handles lunar, shadow, overcharged, on, and off states with appropriate animation transitions and color adjustments.
* **Parameters:**
  - `token` -- Token entity with AnimState and bar components
  - `diff` -- Token difference value for state calculation
  - `instant` -- Boolean to skip animation transitions
  - `nice` -- Boolean indicating nice vs naughty alignment
  - `MAX_TOKENS` -- Maximum token count threshold
  - `affinitytype` -- Optional affinity type ('lunar' or 'shadow')
* **Returns:** nil
* **Error states:** None

### `BuildSkillsData(SkillTreeFns)`
* **Description:** Constructs and returns the Wortox skill tree data configuration including all skill definitions organized by group (nice, naughty, neutral, allegiance) with their positions, tags, locks, connections, and activation callbacks.
* **Parameters:**
  - `SkillTreeFns` -- Table containing skill tree helper functions like CountTags, MakeCelestialChampionLock, MakeNoShadowLock, MakeFuelWeaverLock, MakeNoLunarLock
* **Returns:** Table containing SKILLS, ORDERS, and CUSTOM_FUNCTIONS
* **Error states:** None













## Events & listeners
**Listens to:**
- `timerdone` -- Listened to in TryPanfluteTimerSetup to handle timer completion via OnTimerDone callback
- `death` -- Listened to in TryPanfluteTimerSetup to pause panflute timer via OnDeath callback
- `ms_respawnedfromghost` -- Listened to in TryPanfluteTimerSetup to resume panflute timer via OnRespawnedFromGhost callback

**Pushes:**
None