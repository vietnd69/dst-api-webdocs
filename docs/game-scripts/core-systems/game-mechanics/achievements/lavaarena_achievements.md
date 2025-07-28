---
id: lavaarena-achievements
title: Lava Arena Achievements
description: Character-specific achievement definitions for Lava Arena events
sidebar_position: 3
slug: core-systems-lavaarena-achievements
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Lava Arena Achievements

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `lavaarena_achievements` module defines character-specific achievements for the Lava Arena event. Each character has unique achievements that reflect their abilities and playstyle, along with universal achievements available to all characters.

## Usage Example

```lua
-- Achievements are automatically loaded during Lava Arena events
local achievements_data = require("lavaarena_achievements")
local wilson_achievements = achievements_data.achievements[3] -- Wilson category
```

## Constants

### XWP_VICTORY

**Value:** `10000`

**Status:** stable

**Description:** Experience points awarded for victory achievements for each character.

### XWP_LEVEL1

**Value:** `500`

**Status:** stable

**Description:** Experience points awarded for level 1 (basic) character achievements.

### XWP_LEVEL2

**Value:** `1000`

**Status:** stable

**Description:** Experience points awarded for level 2 (intermediate) character achievements.

### XWP_LEVEL2_5

**Value:** `5000`

**Status:** stable

**Description:** Experience points awarded for level 2.5 (advanced intermediate) achievements.

### XWP_LEVEL3

**Value:** `10000`

**Status:** stable

**Description:** Experience points awarded for level 3 (difficult) achievements.

### XWP_LEVEL4

**Value:** `20000`

**Status:** stable

**Description:** Experience points awarded for level 4 (very difficult) achievements.

### XWP_LEVEL5

**Value:** `30000`

**Status:** stable

**Description:** Experience points awarded for level 5 (extreme difficulty) achievements.

## Functions

### TestMatchTime(user, data, max_time) {#test-match-time}

**Status:** stable

**Description:**
Tests whether a match was won within the specified time limit.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Match outcome data containing `outcome.won` and `outcome.time`
- `max_time` (number): Maximum allowed time in seconds

**Returns:**
- (boolean): True if match was won within time limit

### TestForVictory(user, data) {#test-for-victory}

**Status:** stable

**Description:**
Tests whether the player achieved victory in the match.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Match outcome data containing `outcome.won`

**Returns:**
- (boolean): True if player won the match

## Achievement Categories

### encore

**Status:** stable

**Description:**
High-level encore achievements available to any character, focusing on advanced gameplay.

**Properties:**
- `anycharacter = true`: Available to all characters

**Key Achievements:**
- `encore_boarons`: Complete round 2 with minimal team damage `(<800)`
- `encore_boarons_hard`: Complete round 2 with very minimal team damage `(<600)`
- `encore_turtillus`: Complete round 3 with limited special ability usage
- `encore_turtillus_hard`: Complete round 3 without using special abilities
- `encore_peghook`: Complete without failing peghook mechanics
- `encore_nodeath_easy`: Complete rounds 1-3 without any deaths
- `encore_nodeath_medium`: Complete rounds 1-4 without any deaths
- `encore_nodeath_hard`: Complete entire match without any deaths

### nodeaths

**Status:** stable

**Description:**
No-death achievements focusing on survival and team coordination.

**Properties:**
- `anycharacter = true`: Available to all characters

**Achievements:**
- `nodeaths_self`: Complete match without personal deaths (20000 WXP)
- `nodeaths_team`: Win with no team deaths (30000 WXP)
- `nodeaths_uniqueteam`: Win with no deaths using unique character team (30000 WXP)

### wintime

**Status:** stable

**Description:**
Time-based victory achievements requiring fast completion.

**Properties:**
- `anycharacter = true`: Available to all characters

**Achievements:**
- `wintime_30`: Win within 30 minutes (10000 WXP)
- `wintime_25`: Win within 25 minutes (20000 WXP)
- `wintime_20`: Win within 20 minutes (30000 WXP)

## Character-Specific Categories

### wilson

**Status:** stable

**Description:**
Achievements specific to Wilson, focusing on support and revival capabilities.

**Achievements:**
- `wilson_battlestandards`: Place 3+ battle standards
- `wilson_reviver`: Revive 1+ corpse
- `wilson_victory`: Achieve victory as Wilson

### willow

**Status:** stable

**Description:**
Achievements specific to Willow, focusing on fire-based abilities.

**Achievements:**
- `willow_meteor`: Hit 40+ targets with meteor
- `willow_moltenbolt`: Complete molten bolt achievement
- `willow_victory`: Achieve victory as Willow

### wolfgang

**Status:** stable

**Description:**
Achievements specific to Wolfgang, focusing on combat and guard breaking.

**Achievements:**
- `wolfgang_guardsbroken`: Break 5+ enemy guards
- `wolfgang_nospinning`: Complete without allowing enemy spinning
- `wolfgang_victory`: Achieve victory as Wolfgang

### wendy

**Status:** stable

**Description:**
Achievements specific to Wendy, focusing on precision and damage avoidance.

**Achievements:**
- `wendy_guardsbroken`: Break 5+ enemy guards using ranged attacks
- `wendy_outofharmsway`: Fire 150+ blowdarts while taking `<100` damage in round 4
- `wendy_victory`: Achieve victory as Wendy

### wx78

**Status:** stable

**Description:**
Achievements specific to WX-78, focusing on electrical abilities and anvil usage.

**Achievements:**
- `wx78_anvil`: Hit 50+ targets with anvil attacks
- `wx78_shocks`: Complete electrical shock achievement
- `wx78_victory`: Achieve victory as WX-78

### wickerbottom

**Status:** stable

**Description:**
Achievements specific to Wickerbottom, focusing on magic and healing.

**Achievements:**
- `wickerbottom_meteor`: Kill 1+ enemy with meteor
- `wickerbottom_healing`: Cast 3+ healing spells within 60 seconds
- `wickerbottom_victory`: Achieve victory as Wickerbottom

### woodie

**Status:** stable

**Description:**
Achievements specific to Woodie, focusing on Lucy axe throwing.

**Achievements:**
- `woodie_lucychuck`: Throw Lucy 20+ times
- `woodie_nospinning`: Complete without allowing enemy spinning
- `woodie_victory`: Achieve victory as Woodie

### wes

**Status:** stable

**Description:**
Achievements specific to Wes, focusing on support and aggro management.

**Achievements:**
- `wes_battlestandards`: Place 3+ battle standards
- `wes_decoy`: Win MVP card for aggro held without participation
- `wes_victory`: Achieve victory as Wes

### waxwell

**Status:** stable

**Description:**
Achievements specific to Waxwell, focusing on magic abilities and minions.

**Achievements:**
- `waxwell_petrify`: Petrify 25+ enemies before round 3
- `waxwell_minion_kill`: Kill enemy using shadow minions
- `waxwell_victory`: Achieve victory as Waxwell

### wathgrithr

**Status:** stable

**Description:**
Achievements specific to Wathgrithr (Wigfrid), focusing on combat and battle cries.

**Achievements:**
- `wathgrithr_flip`: Flip Turtillus 20+ times
- `wathgrithr_battlecry`: Use battle cry affecting 3+ allies, 5+ times
- `wathgrithr_victory`: Achieve victory as Wathgrithr

### webber

**Status:** stable

**Description:**
Achievements specific to Webber, focusing on rapid attacks and damage dealing.

**Achievements:**
- `webber_darts`: Fire 3+ darts within 20 seconds
- `webber_merciless`: Win MVP card for total damage dealt
- `webber_victory`: Achieve victory as Webber

### winona

**Status:** stable

**Description:**
Achievements specific to Winona, focusing on diverse weapon usage and abilities.

**Achievements:**
- `winona_allweapons`: Use all 3 weapon types in single match
- `winona_altattacks`: Cast 40+ spells and alternative attacks combined
- `winona_victory`: Achieve victory as Winona

## Achievement Properties

### achievementid

**Type:** `string`

**Status:** stable

**Description:** Unique identifier for the achievement.

### wxp

**Type:** `number`

**Status:** stable

**Description:** Experience points awarded upon completion.

### testfn

**Type:** `function`

**Status:** stable

**Description:** Function called during gameplay to test achievement progress.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Event-specific data
- `scratchpad` (table): Per-player temporary storage
- `shared_scratchpad` (table): Shared temporary storage (optional)

### endofmatchfn

**Type:** `function`

**Status:** stable

**Description:** Function called at match end to test achievement completion.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Complete match data including statistics

### shared_progress_fn

**Type:** `function`

**Status:** stable

**Description:** Function to update shared progress data across team members.

**Parameters:**
- `data` (table): Event data
- `shared_scratchpad` (table): Shared temporary storage

### nosave

**Type:** `boolean`

**Status:** stable

**Description:** Whether scratchpad data should not be saved between sessions.

## Data Structure

### Achievement Definition

```lua
{
    achievementid = "character_achievement",
    wxp = 1000,
    testfn = function(user, data, scratchpad)
        -- Test logic during gameplay
        return achievement_completed
    end,
    endofmatchfn = function(user, data)
        -- Test logic at match end
        return data.outcome.won and other_conditions
    end,
    nosave = false  -- Optional
}
```

### Category Definition

```lua
{
    category = "character_name",
    anycharacter = false,  -- Optional, defaults to false
    data = {
        -- Array of achievement definitions
    }
}
```

## Event Configuration

### seasons

**Value:** `{ 1 }`

**Status:** stable

**Description:** Array of seasons when these achievements are active.

### eventid

**Value:** `"lavaarena"`

**Status:** stable

**Description:** Event identifier for the Lava Arena event.

## Related Modules

- [Lava Arena Achievement Quest Definitions](./lavaarena_achievement_quest_defs.md): Quest-based achievement system
- [Lava Arena Community Progression](./lavaarena_communityprogression.md): Community-wide progression tracking
- [Event Achievements](./eventachievements.md): General event achievement framework
