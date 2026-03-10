---
id: lavaarena_achievements
title: Lavaarena Achievements
description: Defines win condition and performance-based achievement requirements for the Lava Arena mini-game.
tags: [combat, achievements, boss, player]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7f433b37
system_scope: world
---

# Lavaarena Achievements

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`lavaarena_achievements` is a data-only Lua module that declares all achievement definitions for the Lava Arena mini-game. It specifies win conditions, round-specific performance criteria, and character-specific objectives using `testfn`, `endofmatchfn`, and `shared_progress_fn` callbacks. This file is consumed by the achievement system to evaluate player performance during and after Lava Arena matches, using stats tracked by `lavaarenamvpstatstracker` and round state from `lavaarenaevent`.

## Usage example
This file does not define a component and is not added directly to entities. Instead, it is returned as a configuration table consumed by the game's achievement system. Modders can extend or modify achievements by importing and appending to `Lavaarena_Achievements` before return:

```lua
local Lavaarena_Achievements = require("lavaarena_achievements")

-- Add a custom achievement
table.insert(Lavaarena_Achievements[1].data, {
    achievementid = "custom_example",
    wxp = 5000,
    testfn = function(user, data)
        return data.round == 1 and true -- placeholder condition
    end,
})

return {
    seasons = { 1 },
    eventid = "lavaarena",
    achievements = Lavaarena_Achievements,
}
```

## Dependencies & tags
**Components used:**  
- `lavaarenamvpstatstracker` (`TheWorld.components.lavaarenamvpstatstracker:GetStatTotal()`)  
- `lavaarenaevent` (`TheWorld.components.lavaarenaevent:GetCurrentRound()`)  
- `health` (`target.components.health:IsDead()` via `data.target`)

**Tags:** None identified.

## Properties
No public properties are defined. The module exports a single table containing structured achievement definitions.

## Main functions
Not applicable — this file contains only static data and helper functions used to construct achievement definitions.

## Events & listeners
Not applicable — this module does not register or fire events. Achievement evaluation is handled externally by the game's achievement system based on the `testfn` and `endofmatchfn` callbacks provided in the definitions.