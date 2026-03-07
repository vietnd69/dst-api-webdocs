---
id: webber
title: Webber
description: Provides the implementation for the Webber character, a spider-taming player character with unique beard mechanics, spider affinity, and creep-based movement bonuses.
tags: [player, spider, beard, locomotion]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a88a8b92
system_scope: player
---

# Webber

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`webber.lua` defines the Webber character prefab, implementing his spider-whispering abilities, beard progression system, and creep-optimized movement. It integrates with core player components (`health`, `hunger`, `sanity`, `eater`, `foodaffinity`, `beard`, `locomotor`, `leader`) to deliver unique gameplay behaviors: taming and commanding spider minions, gaining insulation and silk from beard growth, benefiting from faster movement on creep tiles, and losing control over tamed spiders upon attacking or dying.

## Usage example
```lua
-- The Webber character is instantiated via the MakePlayerCharacter factory.
-- Typically loaded via the game's character selection system.
-- Example of component interaction (not typical mod usage):
inst.components.beard:AddCallback(5, function(inst) -- Custom callback
    print("Beard grown at day 5")
end)
inst.components.locomotor:SetFasterOnCreep(true)
```

## Dependencies & tags
**Components used:** `beard`, `eater`, `foodaffinity`, `health`, `hunger`, `sanity`, `locomotor`, `leader`
**Tags added:** `spiderwhisperer`, `playermonster`, `monster`, `dualsoul`, `bearded`, `fastpicker` (quagmire), `quagmire_farmhand` (quagmire), `quagmire_shopper` (quagmire), `<spider_upgradeuser>` (dynamic)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `customidleanim` | string | `"idle_webber"` | Animation state machine idle animation name. |
| `talker_path_override` | string | `"dontstarve_DLC001/characters/"` | Sound path override for voice lines. |
| `starting_inventory` | table | `<inferred from TUNING>` | Starting item set based on game mode. |
| `HostileTest` | function | `CLIENT_Webber_HostileTest` | Custom hostile test logic for Webber. |

## Main functions
### `OnResetBeard(inst)`
*   **Description:** Clears the beard override animation when the character respawns or resets beard state.
*   **Parameters:** `inst` (Entity) - The Webber instance.
*   **Returns:** Nothing.

### `OnGrowShortBeard(inst, skinname)`
*   **Description:** Applies the short silk beard visual and sets the beard bits value for day 3.
*   **Parameters:**  
    - `inst` (Entity) - The Webber instance.  
    - `skinname` (string? or `nil`) - Optional skin name for skin-specific beard override.  
*   **Returns:** Nothing.

### `OnGrowMediumBeard(inst, skinname)`
*   **Description:** Applies the medium silk beard visual and sets the beard bits value for day 6.
*   **Parameters:** Same as `OnGrowShortBeard`.
*   **Returns:** Nothing.

### `OnGrowLongBeard(inst, skinname)`
*   **Description:** Applies the long silk beard visual and sets the beard bits value for day 9.
*   **Parameters:** Same as `OnGrowShortBeard`.
*   **Returns:** Nothing.

### `ReleaseSpiderFollowers(inst)`
*   **Description:** Releases control over tamed defensive spiders when Webber attacks, is attacked, dies, or is removed from the world.
*   **Parameters:** `inst` (Entity) - The Webber instance.
*   **Returns:** Nothing.
*   **Error states:** Only affects followers that are `spider`-tagged and `defensive`.

### `CLIENT_Webber_HostileTest(inst, target)`
*   **Description:** Determines whether a given entity is hostile to Webber.
*   **Parameters:**  
    - `inst` (Entity) - The Webber instance.  
    - `target` (Entity) - The entity being tested for hostility.  
*   **Returns:** `true` if `target` is hostile, `false` otherwise.  
*   **Error states:** Returns `false` if `target.HostileToPlayerTest` is `nil` and none of the tags match.

## Events & listeners
- **Listens to:**  
  - `attacked` – triggers `ReleaseSpiderFollowers` to release tamed spiders.  
  - `onattackother` – triggers `ReleaseSpiderFollowers` to release tamed spiders.  
  - `death` – triggers `ReleaseSpiderFollowers` to release tamed spiders.  
  - `onremove` – triggers `ReleaseSpiderFollowers` to release tamed spiders.