---
id: seasons
title: Seasons API
sidebar_position: 3
last_updated: 2023-07-06
---

# Seasons API

Controls for seasonal mechanics and transitions in the game world.

## Overview

The Seasons API manages the game's seasonal cycle, including transitions, durations, and associated environmental effects. It controls day/night cycles, temperature changes, and seasonal events.

## Season Types

Don't Starve Together has four main seasons, each with unique characteristics:

- **Autumn**: Moderate temperature and foraging conditions
- **Winter**: Cold temperatures, snow, and limited resource availability
- **Spring**: Frequent rain, abundant resources, and increased plant growth
- **Summer**: Hot temperatures, wildfires, and drought conditions

## Season Modes

The seasons component supports three operational modes:

```lua
-- Season mode names
local MODE_NAMES = {
    "cycle",   -- Normal seasonal cycle
    "endless", -- Stays in one season indefinitely
    "always",  -- Permanent single season
}
```

## Key Functions

### Season Management

```lua
-- Get current season
local current_season = TheWorld.components.seasons:GetSeason()

-- Get days remaining in current season
local days_remaining = TheWorld.components.seasons:GetDaysLeftInSeason()

-- Get seasonal parameters
local is_endless = TheWorld.components.seasons:IsEndless()
local progress = TheWorld.components.seasons:GetSeasonProgress()

-- Set season (requires admin privileges)
TheWorld.components.seasons:SetSeason("winter")

-- Transition to next season (requires admin privileges)
TheWorld.components.seasons:Advance()
```

### Season Configuration

```lua
-- Configure season lengths
TheWorld.components.seasons:SetSeasonLengths({
    autumn = 20,
    winter = 15,
    spring = 20,
    summer = 15,
})

-- Set season segment modifiers (day/dusk/night ratios)
TheWorld.components.seasons:SetSeasonSegmentModifier({
    day = 1.0,
    dusk = 1.0,
    night = 1.0,
})
```

## Events

The seasons component triggers several events that other components can listen for:

- `seasontick`: Fired regularly with current season information
- `seasonchange`: Fired when the season changes
- `ms_setclocksegs`: Adjusts day/dusk/night segment lengths based on season

## Related Components

- **Temperature**: Controls ambient temperature based on season
- **Precipitation**: Manages rain and snow patterns by season
- **WorldState**: Tracks global season-related state variables 
