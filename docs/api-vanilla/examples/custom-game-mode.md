---
id: custom-game-mode
title: Designing Custom Game Modes
sidebar_position: 15
---

# Designing Custom Game Modes

This guide focuses on creating custom game modes for Don't Starve Together. Custom game modes allow you to fundamentally change how the game is played by altering core mechanics, win conditions, player interactions, and world generation.

## Understanding Game Modes in DST

Don't Starve Together has several built-in game modes that serve as examples:

1. **Survival**: The standard endless survival experience
2. **Wilderness**: Players respawn at random locations when they die
3. **Endless**: Players can respawn at the portal without world regeneration
4. **Lavaarena**: A combat-focused arena mode (special event)
5. **Quagmire**: A cooking-focused mode (special event)

Custom game modes allow you to create entirely new ways to play, such as:

- Competitive team-based modes
- Goal-oriented challenges with win conditions
- Specialized survival scenarios with unique rules
- Story-driven experiences with custom progression

## Basic Game Mode Structure

A custom game mode typically requires:

1. A mod main file that defines the game mode
2. Custom world generation settings
3. Modified game mechanics
4. Custom UI elements for game mode information
5. Win/loss conditions (optional)
6. Custom scoring or progression systems (optional)

## Creating a Simple Game Mode

Let's create a basic "Resource Race" game mode where players compete to collect resources:

```lua
-- In modmain.lua
local GAME_MODE_NAME = "RESOURCE_RACE"
local GAME_MODE_DESCRIPTION = "Collect resources faster than other players!"
local GAME_MODE_DURATION = TUNING.TOTAL_DAY_TIME * 10 -- 10 days

-- Register the game mode
AddGameMode(GAME_MODE_NAME, {
    name = GAME_MODE_NAME,
    description = GAME_MODE_DESCRIPTION,
    duration = GAME_MODE_DURATION,
    override_normal_game = true,
})

-- Game mode initialization
local function InitGameMode(inst)
    if TheWorld.ismastersim then
        -- Set up resource targets
        TheWorld.resource_targets = {
            ["log"] = 50,
            ["rocks"] = 30,
            ["cutgrass"] = 100,
            ["twigs"] = 100,
        }
        
        -- Set up player scores
        TheWorld.player_scores = {}
        
        -- Set game end time
        TheWorld.end_time = GetTime() + GAME_MODE_DURATION
        
        -- Announce game start
        TheNet:Announce("Resource Race has begun! Collect resources to win!")
    end
end

-- Hook into world creation
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim and TheNet:GetServerGameMode() == GAME_MODE_NAME then
        InitGameMode(inst)
        
        -- Set up periodic score updates
        inst:DoPeriodicTask(1, function()
            UpdateScores()
            CheckGameEnd()
        end)
    end
end)

-- Track resource collection
local function OnPickup(inst, data)
    if TheWorld.ismastersim and TheNet:GetServerGameMode() == GAME_MODE_NAME then
        local item = data.item
        local player = inst
        
        if not TheWorld.player_scores[player.userid] then
            TheWorld.player_scores[player.userid] = {
                name = player.name,
                resources = {},
                total_points = 0
            }
        end
        
        local player_score = TheWorld.player_scores[player.userid]
        
        -- Check if the item is a target resource
        if TheWorld.resource_targets[item.prefab] then
            player_score.resources[item.prefab] = (player_score.resources[item.prefab] or 0) + 1
            player_score.total_points = player_score.total_points + 1
            
            -- Announce milestones
            if player_score.total_points % 25 == 0 then
                TheNet:Announce(player.name .. " has collected " .. player_score.total_points .. " resources!")
            end
        end
    end
end

-- Listen for item pickups
AddPlayerPostInit(function(inst)
    inst:ListenForEvent("itemget", function(inst, data)
        OnPickup(inst, data)
    end)
end)

-- Update scores and check for game end
function UpdateScores()
    -- Send score updates to clients
    for i, player in ipairs(AllPlayers) do
        if TheWorld.player_scores[player.userid] then
            SendModRPCToClient(GetClientModRPC("ResourceRace", "SyncScore"), 
                player.userid, 
                json.encode(TheWorld.player_scores))
        end
    end
end

function CheckGameEnd()
    local current_time = GetTime()
    
    -- Check if time is up
    if current_time >= TheWorld.end_time then
        -- Find the winner
        local highest_score = 0
        local winner = nil
        
        for userid, score_data in pairs(TheWorld.player_scores) do
            if score_data.total_points > highest_score then
                highest_score = score_data.total_points
                winner = score_data.name
            end
        end
        
        -- Announce winner
        if winner then
            TheNet:Announce("Game Over! " .. winner .. " wins with " .. highest_score .. " resources!")
        else
            TheNet:Announce("Game Over! It's a tie!")
        end
        
        -- Reset the world after a delay
        TheWorld:DoTaskInTime(10, function()
            TheNet:SendWorldResetRequestToServer()
        end)
    end
end
```

## Game Mode Configuration

To make your game mode configurable, add options to the mod configuration:

```lua
-- In modinfo.lua
name = "Resource Race"
description = "A competitive resource gathering game mode"
author = "Your Name"
version = "1.0"

-- Game mode configuration options
configuration_options = {
    {
        name = "game_duration",
        label = "Game Duration",
        options = {
            {description = "5 Days", data = 5},
            {description = "10 Days", data = 10},
            {description = "20 Days", data = 20},
        },
        default = 10,
    },
    {
        name = "resource_targets",
        label = "Resource Targets",
        options = {
            {description = "Easy", data = "easy"},
            {description = "Normal", data = "normal"},
            {description = "Hard", data = "hard"},
        },
        default = "normal",
    },
}

-- Then in modmain.lua, use these settings:
local GAME_DURATION = GetModConfigData("game_duration") * TUNING.TOTAL_DAY_TIME
local DIFFICULTY = GetModConfigData("resource_targets")

-- Set resource targets based on difficulty
local resource_targets = {
    easy = {
        ["log"] = 30,
        ["rocks"] = 20,
        -- etc.
    },
    normal = {
        ["log"] = 50,
        ["rocks"] = 30,
        -- etc.
    },
    hard = {
        ["log"] = 80,
        ["rocks"] = 50,
        -- etc.
    },
}

TheWorld.resource_targets = resource_targets[DIFFICULTY]
```

## Custom World Generation

Game modes often require specialized world generation:

```lua
-- In modmain.lua
-- Override world generation settings
GLOBAL.TUNING.RESOURCERACE_WORLDGEN = {
    -- Modify world size
    override_size = "medium",
    
    -- Modify resource distribution
    resources = {
        flint = "many",
        rocks = "many",
        trees = "many",
    },
    
    -- Modify creature spawns
    monsters = "few",
    
    -- Add special structures
    add_prefabs = {
        "scorekeeper",
        "resourcechest",
    },
}

-- Apply world generation overrides
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    if TheNet:GetServerGameMode() == "RESOURCE_RACE" then
        level.overrides = GLOBAL.TUNING.RESOURCERACE_WORLDGEN
    end
end)
```

## Custom UI for Game Modes

Create a custom UI to display game information:

```lua
-- In scripts/widgets/resourceracescore.lua
local Widget = require "widgets/widget"
local Text = require "widgets/text"
local Image = require "widgets/image"
local TEMPLATES = require "widgets/redux/templates"

local ResourceRaceScore = Class(Widget, function(self, owner)
    Widget._ctor(self, "ResourceRaceScore")
    self.owner = owner
    
    -- Create background panel
    self.root = self:AddChild(TEMPLATES.CurlyWindow(200, 300, "Resource Race", nil, nil, ""))
    
    -- Add timer
    self.timer_text = self.root:AddChild(Text(BODYTEXTFONT, 30))
    self.timer_text:SetPosition(0, 120, 0)
    self.timer_text:SetString("Time Left: 10:00")
    
    -- Add score list
    self.score_root = self.root:AddChild(Widget("score_root"))
    self.score_root:SetPosition(0, 0, 0)
    
    -- Initialize scores
    self.scores = {}
    self:UpdateScores({})
    
    -- Start update loop
    self:StartUpdating()
end)

function ResourceRaceScore:UpdateScores(score_data)
    -- Clear existing score widgets
    self.score_root:KillAllChildren()
    
    -- Create ordered list of players by score
    local players = {}
    for userid, data in pairs(score_data) do
        table.insert(players, data)
    end
    
    -- Sort by total points
    table.sort(players, function(a, b) return a.total_points > b.total_points end)
    
    -- Create score entries
    for i, player_data in ipairs(players) do
        local y_pos = 80 - (i * 40)
        
        -- Player name
        local name_text = self.score_root:AddChild(Text(BODYTEXTFONT, 20))
        name_text:SetPosition(-70, y_pos, 0)
        name_text:SetString(player_data.name)
        name_text:SetHAlign(ANCHOR_LEFT)
        
        -- Player score
        local score_text = self.score_root:AddChild(Text(BODYTEXTFONT, 20))
        score_text:SetPosition(70, y_pos, 0)
        score_text:SetString(tostring(player_data.total_points))
        score_text:SetHAlign(ANCHOR_RIGHT)
    end
end

function ResourceRaceScore:OnUpdate(dt)
    if TheWorld.end_time then
        local time_left = math.max(0, TheWorld.end_time - GetTime())
        local minutes = math.floor(time_left / 60)
        local seconds = math.floor(time_left % 60)
        self.timer_text:SetString(string.format("Time Left: %02d:%02d", minutes, seconds))
    end
end

return ResourceRaceScore

-- Then in modmain.lua:
AddClassPostConstruct("widgets/controls", function(self)
    if TheNet:GetServerGameMode() == "RESOURCE_RACE" then
        self.resourcerace = self:AddChild(require("widgets/resourceracescore")(self.owner))
        self.resourcerace:SetPosition(200, -15, 0)
    end
end)
```

## Win Conditions and Game Rules

Define custom win conditions and rules for your game mode:

```lua
-- In modmain.lua
-- Different types of win conditions
local WIN_CONDITIONS = {
    -- Time-based: Player with most resources when time expires wins
    time_based = function()
        return GetTime() >= TheWorld.end_time
    end,
    
    -- Target-based: First player to reach target amount wins
    target_based = function()
        for userid, score_data in pairs(TheWorld.player_scores) do
            if score_data.total_points >= TheWorld.target_score then
                return true, score_data.name
            end
        end
        return false
    end,
    
    -- Survival-based: Last player/team standing wins
    survival_based = function()
        local teams_alive = {}
        for i, player in ipairs(AllPlayers) do
            if not player:HasTag("playerghost") then
                teams_alive[player.components.teamleader.teamID] = true
            end
        end
        
        local count = 0
        for _ in pairs(teams_alive) do count = count + 1 end
        
        if count <= 1 then
            -- Find the surviving team
            for team_id in pairs(teams_alive) do
                return true, "Team " .. team_id
            end
            return true, "No one" -- All teams dead
        end
        
        return false
    end
}

-- Set the active win condition
TheWorld.win_condition = WIN_CONDITIONS.time_based

-- Custom game rules
local GAME_RULES = {
    -- PvP enabled
    pvp_enabled = true,
    
    -- Respawn settings
    respawn_enabled = true,
    respawn_time = 30,
    
    -- Resource settings
    resource_multiplier = 1.5,
    
    -- Special rules
    drop_items_on_death = true,
    night_always = false,
    eternal_summer = true,
}

-- Apply game rules
local function ApplyGameRules(inst)
    if TheWorld.ismastersim and TheNet:GetServerGameMode() == "RESOURCE_RACE" then
        -- Set PvP mode
        TheNet:SetAllowPvP(GAME_RULES.pvp_enabled)
        
        -- Set respawn settings
        TheWorld:PushEvent("ms_setrespawntime", GAME_RULES.respawn_time)
        
        -- Apply special rules
        if GAME_RULES.eternal_summer then
            TheWorld:PushEvent("ms_setseason", "summer")
            TheWorld:PushEvent("ms_setseasonlength", {summer=999, autumn=1, winter=1, spring=1})
        end
        
        if GAME_RULES.night_always then
            TheWorld:PushEvent("ms_setphase", "night")
            TheWorld:PushEvent("ms_setclocksegs", {day=0, dusk=0, night=16})
        end
    end
end

-- Apply rules on world initialization
AddPrefabPostInit("world", ApplyGameRules)
```

## Custom Events and Challenges

Add dynamic events to keep your game mode interesting:

```lua
-- In scripts/prefabs/resourcerace_events.lua
local Events = {
    -- Double points event
    double_points = {
        name = "Double Points",
        duration = 60,
        start = function()
            TheWorld.point_multiplier = 2
            TheNet:Announce("Double Points activated for 60 seconds!")
        end,
        finish = function()
            TheWorld.point_multiplier = 1
            TheNet:Announce("Double Points has ended!")
        end,
    },
    
    -- Resource drop event
    resource_drop = {
        name = "Resource Shower",
        duration = 30,
        start = function()
            TheNet:Announce("Resource Shower started! Look for falling resources!")
            
            -- Spawn resources around players
            for i, player in ipairs(AllPlayers) do
                local x, y, z = player.Transform:GetWorldPosition()
                
                for j = 1, 10 do
                    local angle = math.random() * 2 * PI
                    local dist = 5 + math.random() * 10
                    local drop_x = x + math.cos(angle) * dist
                    local drop_z = z + math.sin(angle) * dist
                    
                    -- Choose a random resource
                    local resources = {"log", "rocks", "cutgrass", "twigs"}
                    local resource = resources[math.random(#resources)]
                    
                    -- Spawn with a delay for visual effect
                    TheWorld:DoTaskInTime(j * 0.5, function()
                        local item = SpawnPrefab(resource)
                        if item then
                            item.Transform:SetPosition(drop_x, 20, drop_z)
                            item.Physics:SetVel(0, -5, 0)
                        end
                    end)
                end
            end
        end,
        finish = function()
            -- Nothing needed on finish
        end,
    },
    
    -- Monster attack event
    monster_attack = {
        name = "Monster Attack",
        duration = 120,
        start = function()
            TheNet:Announce("Monster Attack! Defend yourself!")
            
            -- Spawn monsters near each player
            for i, player in ipairs(AllPlayers) do
                local x, y, z = player.Transform:GetWorldPosition()
                
                for j = 1, 5 do
                    local angle = math.random() * 2 * PI
                    local dist = 8 + math.random() * 5
                    local spawn_x = x + math.cos(angle) * dist
                    local spawn_z = z + math.sin(angle) * dist
                    
                    -- Choose a monster based on difficulty
                    local monsters = {"spider", "hound", "tallbird"}
                    local monster = monsters[math.random(#monsters)]
                    
                    local creature = SpawnPrefab(monster)
                    if creature then
                        creature.Transform:SetPosition(spawn_x, 0, spawn_z)
                        
                        -- Make monster target player
                        if creature.components.combat then
                            creature.components.combat:SetTarget(player)
                        end
                    end
                end
            end
        end,
        finish = function()
            TheNet:Announce("The monster attack has subsided!")
        end,
    },
}

-- Event manager
local function CreateEventManager()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    inst:AddTag("CLASSIFIED")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.active_event = nil
    inst.event_end_time = nil
    
    -- Start a random event
    inst.StartRandomEvent = function(self)
        if self.active_event then
            return -- Event already active
        end
        
        -- Choose a random event
        local event_keys = {}
        for k in pairs(Events) do
            table.insert(event_keys, k)
        end
        
        local event_key = event_keys[math.random(#event_keys)]
        local event = Events[event_key]
        
        -- Start the event
        self.active_event = event_key
        self.event_end_time = GetTime() + event.duration
        
        event.start()
        
        -- Schedule event end
        inst:DoTaskInTime(event.duration, function()
            if self.active_event == event_key then
                event.finish()
                self.active_event = nil
                self.event_end_time = nil
            end
        end)
    end
    
    -- Schedule random events
    inst:DoPeriodicTask(120 + math.random() * 180, function()
        inst:StartRandomEvent()
    end)
    
    return inst
end

return Prefab("resourcerace_eventmanager", CreateEventManager)
```

## Team-Based Game Modes

For team-based game modes, implement team functionality:

```lua
-- In modmain.lua
-- Team setup
local function SetupTeams(inst)
    if TheWorld.ismastersim and TheNet:GetServerGameMode() == "TEAM_RESOURCE_RACE" then
        TheWorld.teams = {
            [1] = {name = "Red Team", color = {r=0.8, g=0.2, b=0.2}, members = {}, score = 0},
            [2] = {name = "Blue Team", color = {r=0.2, g=0.2, b=0.8}, members = {}},
        }
        
        -- Assign players to teams
        local team_index = 1
        for i, player in ipairs(AllPlayers) do
            local team = TheWorld.teams[team_index]
            
            -- Add player to team
            table.insert(team.members, player.userid)
            
            -- Set player color
            player.components.colourtweener:StartTween(team.color, 0)
            
            -- Set team ID
            player.team_id = team_index
            
            -- Alternate team assignment
            team_index = team_index % #TheWorld.teams + 1
        end
        
        -- Announce teams
        for id, team in pairs(TheWorld.teams) do
            local member_names = {}
            for _, userid in ipairs(team.members) do
                local player = UserToPlayer(userid)
                if player then
                    table.insert(member_names, player.name)
                end
            end
            
            TheNet:Announce(team.name .. ": " .. table.concat(member_names, ", "))
        end
    end
end

-- Add team score tracking
local function OnTeamPickup(inst, data)
    if TheWorld.ismastersim and TheNet:GetServerGameMode() == "TEAM_RESOURCE_RACE" then
        local item = data.item
        local player = inst
        
        if player.team_id and TheWorld.teams[player.team_id] then
            local team = TheWorld.teams[player.team_id]
            
            -- Check if the item is a target resource
            if TheWorld.resource_targets[item.prefab] then
                team.score = team.score + 1
                
                -- Announce milestones
                if team.score % 25 == 0 then
                    TheNet:Announce(team.name .. " has collected " .. team.score .. " resources!")
                end
            end
        end
    end
end

-- Apply team setup on world initialization
AddPrefabPostInit("world", SetupTeams)

-- Listen for item pickups for team scoring
AddPlayerPostInit(function(inst)
    inst:ListenForEvent("itemget", function(inst, data)
        OnTeamPickup(inst, data)
    end)
end)
```

## Best Practices

1. **Balance**: Ensure your game mode is balanced and fun for all players
2. **Clear Goals**: Make sure players understand the objectives and rules
3. **Progression**: Include a sense of progression and achievement
4. **Variety**: Add random elements or events to increase replayability
5. **Performance**: Optimize for multiplayer performance
6. **Feedback**: Provide clear feedback on progress and status
7. **Testing**: Thoroughly test with different player counts and scenarios

## Troubleshooting

### Common Issues

1. **Synchronization problems**: Ensure all game state is properly synchronized between server and clients
2. **Balance issues**: Test with different player counts to ensure the game is fun for all group sizes
3. **Performance problems**: Monitor server performance, especially with many players or complex events
4. **Unclear rules**: Make sure players understand how to play and win your game mode
5. **Save compatibility**: Handle save/load correctly if your game mode supports it

### Debugging Tips

```lua
-- Add debug commands to test your game mode
GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F9, function()
    if GLOBAL.TheWorld.ismastersim then
        print("Debug: Triggering test event")
        -- Test code here
        TheWorld.event_manager:StartRandomEvent()
    end
end)
```

## Conclusion

Creating custom game modes allows you to fundamentally change how Don't Starve Together is played. By combining world generation settings, custom mechanics, UI elements, and win conditions, you can create unique experiences that extend the game in exciting new ways.

Whether you're creating competitive challenges, cooperative adventures, or specialized survival scenarios, custom game modes offer endless possibilities for expanding the Don't Starve Together experience.

See also:
- [Custom World Generation](custom-world-generation.md) - For creating specialized worlds for your game mode
- [Custom AI and Brain Behaviors](custom-ai.md) - For creating specialized AI for your game mode
- [Custom UI Elements](custom-ui-elements.md) - For creating game mode interfaces
- [Custom Weather Effects](custom-weather-effects.md) - For adding atmospheric effects to your game mode
- [Network Optimization](network-optimization.md) - For optimizing multiplayer performance
