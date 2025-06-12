---
id: event-system
title: Event System
sidebar_position: 2
---

# Event System

Don't Starve Together uses an event system to manage and react to game state changes. This system allows entities to register listeners and respond to events from other entities.

The event system is a fundamental part of the game's architecture, enabling communication between different components and entities. It follows a publisher-subscriber pattern, where entities can:
- **Publish (fire) events** when something happens
- **Subscribe (listen) to events** to react when they occur
- **Unsubscribe (remove listeners)** when no longer needed

This approach creates a loosely coupled system where components don't need direct knowledge of each other to interact, making the codebase more modular and easier to extend.

## Registering and Firing Events

The event system has two primary operations: registering event listeners and firing events. These operations form the foundation of event-based communication in the game.

### Key Methods

```lua
-- Register event listener
inst:ListenForEvent(event_name, fn, source)

-- Fire event
inst:PushEvent(event_name, data)
```

Where:
- `event_name`: Name of the event (string) - identifies what happened (e.g., "death", "attacked")
- `fn`: Callback function called when the event occurs - contains the code that should run in response
- `source`: (Optional) Source entity firing the event - if not specified, listens from all sources
- `data`: (Optional) Data sent with the event, usually a table - provides additional context about the event

### How It Works

When you call `ListenForEvent()`, you're essentially saying: "When this specific event happens, run this function." The event system maintains internal tables of registered listeners and notifies them when relevant events occur.

When you call `PushEvent()`, the system checks for all listeners registered for that event and calls their callback functions, passing any provided data.

## Unregistering Events

To prevent memory leaks and ensure proper cleanup, it's important to remove event listeners when they're no longer needed, especially for temporary entities.

```lua
-- Unregister event listener
inst:RemoveEventCallback(event_name, fn, source)

-- Unregister all event listeners
inst:RemoveAllEventCallbacks()
```

When removing a listener, you need to provide the same parameters that were used when registering it: the event name, function reference, and source (if specified). Alternatively, `RemoveAllEventCallbacks()` removes all listeners from an entity at once, which is useful during cleanup operations.

## Usage Examples

The following examples demonstrate common patterns for using the event system in Don't Starve Together.

### Listening to events from the entity itself

One of the most common uses of events is to have an entity react to its own state changes:

```lua
-- Entity listens to "attacked" event from itself
inst:ListenForEvent("attacked", function(inst, data)
    print("Attacked by: " .. tostring(data.attacker))
    print("Damage: " .. tostring(data.damage))
    
    -- Example: Play a unique sound when attacked
    if inst.SoundEmitter then
        inst.SoundEmitter:PlaySound("dontstarve/creatures/monster_hurt")
    end
    
    -- Example: Notify nearby allies
    local x, y, z = inst.Transform:GetWorldPosition()
    local allies = TheSim:FindEntities(x, y, z, 20, {"ally"})
    for _, ally in ipairs(allies) do
        ally:PushEvent("allythreatened", {threatener = data.attacker})
    end
end)
```

In this example, when the entity is attacked:
1. It prints information about the attack
2. Plays a sound effect
3. Notifies nearby allies about the threat

### Listening to events from another entity

You can also listen to events fired by other entities, which is useful for creating interactions between entities:

```lua
-- Entity listens to "death" event from target
inst:ListenForEvent("death", function(target)
    print(target.prefab .. " has died!")
    
    -- Example: Celebrate when target dies
    if inst.components.talker then
        inst.components.talker:Say("I've defeated " .. target:GetDisplayName() .. "!")
    end
    
    -- Example: Grant experience reward
    if inst.components.combat then
        inst.components.combat.externaldamagetakenmultipliers:SetModifier("victory", 0.9, "victory_buff")
        -- Remove the buff after 10 seconds
        inst:DoTaskInTime(10, function() 
            inst.components.combat.externaldamagetakenmultipliers:RemoveModifier("victory") 
        end)
    end
end, target)
```

In this example:
1. The entity listens for when a specific target entity dies
2. Makes the entity "say" something when the target dies
3. Grants a temporary combat buff to the entity

### Firing events with data

You can fire custom events with additional data to communicate between different parts of your code:

```lua
-- Fire "customaction" event with data
inst:PushEvent("customaction", { 
    target = target_entity, 
    value = 10,
    location = Vector3(inst.Transform:GetWorldPosition()),
    success = true
})
```

This pattern is particularly useful when:
- You need to communicate between different components on the same entity
- You want to broadcast information to multiple listeners
- You want to decouple the action trigger from the action handler

## Common Events

Don't Starve Together has numerous built-in events that you can listen for in your mods. Below are some of the most frequently used events organized by category. Understanding these events allows you to respond to various game situations effectively.

### Combat Events

Combat events are triggered during fights and interactions between entities that can deal or receive damage.

```lua
-- When entity is attacked
-- data: { attacker, damage, damageresolved, original_damage, weapon, stimuli, spdamage, redirected, noimpactsound }
inst:ListenForEvent("attacked", function(inst, data)
    -- The 'data' table contains detailed information about the attack
    local attacker = data.attacker -- Entity that performed the attack
    local damage = data.damage -- Final damage after all modifiers
    local original_damage = data.original_damage -- Damage before modifiers
    
    -- Example: Apply a counter-effect when attacked by spiders
    if attacker and attacker:HasTag("spider") then
        attacker:PushEvent("attacked", {attacker = inst, damage = damage * 0.5})
    end
end)

-- When entity dies
inst:ListenForEvent("death", function(inst)
    -- This is often used for:
    -- - Playing death animations or sounds
    -- - Dropping special loot
    -- - Triggering world events
    
    -- Example: Spawn flies when a monster dies
    for i = 1, 3 do
        local fly = SpawnPrefab("fly")
        local x, y, z = inst.Transform:GetWorldPosition()
        fly.Transform:SetPosition(x + math.random(-2, 2), y, z + math.random(-2, 2))
    end
end)

-- When entity damages another entity
inst:ListenForEvent("onhitother", function(inst, data)
    -- data contains: target, damage, stimuli, etc.
    local target = data.target
    local damage = data.damage
    
    -- Example: Apply a burning effect on hit
    if inst.components.burnable and inst.components.burnable:IsBurning() and
       target.components.burnable and not target.components.burnable:IsBurning() then
        target.components.burnable:Ignite()
    end
end)
```

### Character Events

Character events relate to player characters and their stats, providing ways to respond to changes in hunger, health, sanity, and equipment.

```lua
-- When character's hunger changes
inst:ListenForEvent("hungerdelta", function(inst, data)
    -- data.newpercent - new hunger percentage
    -- data.oldpercent - previous hunger percentage
    -- data.delta - amount changed
    
    -- Example: Make the character move slower when very hungry
    if data.newpercent < 0.2 and inst.components.locomotor then
        inst.components.locomotor:SetExternalSpeedMultiplier("hunger_penalty", 0.7)
    elseif data.newpercent >= 0.2 and inst.components.locomotor then
        inst.components.locomotor:RemoveExternalSpeedMultiplier("hunger_penalty")
    end
end)

-- When character's health changes
inst:ListenForEvent("healthdelta", function(inst, data)
    -- Similar structure to hungerdelta
    -- Example: Create a visual effect when health is very low
    if data.newpercent < 0.1 then
        local fx = SpawnPrefab("hitsparks")
        fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
    end
end)

-- When character equips item
inst:ListenForEvent("equip", function(inst, data)
    -- data.item - the equipped item
    -- data.eslot - equipment slot
    
    -- Example: Apply special effect for a specific item
    if data.item.prefab == "nightsword" then
        inst.components.sanity.night_drain_mult = 1.5
    end
end)
```

### World Events

World events are fired by `TheWorld` entity and represent global changes like seasons, time of day, or weather conditions.

```lua
-- When season changes
TheWorld:ListenForEvent("seasonchange", function(world, data)
    -- data.season - new season ("winter", "summer", etc.)
    -- data.prev - previous season
    
    -- Example: Prepare all players for winter
    if data.season == "winter" then
        for _, player in ipairs(AllPlayers) do
            if player.components.talker then
                player.components.talker:Say("Winter is coming!")
            end
            
            -- Give insulation buff
            if player.components.temperature then
                player.components.temperature:SetModifier("season_change", 10)
            end
        end
    end
end)

-- When day/night phase changes
TheWorld:ListenForEvent("phasechanged", function(world, data)
    -- data.newphase - "day", "dusk", or "night"
    -- data.oldphase - previous phase
    
    -- Example: Make monsters more aggressive at night
    if data.newphase == "night" then
        local monsters = TheSim:FindEntities(0, 0, 0, 1000, {"monster"})
        for _, monster in ipairs(monsters) do
            if monster.components.combat then
                monster.components.combat:SetAttackPeriod(monster.components.combat.min_attack_period * 0.8)
            end
        end
    end
end)
```

### Entity Lifecycle Events

These events help manage the lifecycle of entities, from animation completion to destruction.

```lua
-- When animation ends
inst:ListenForEvent("animover", function(inst)
    -- This is useful for:
    -- - Chaining animations
    -- - Triggering actions after animations
    -- - State transitions
    
    -- Example: Return to idle state after attack animation
    if inst.sg and inst.sg:HasStateTag("attack") then
        inst.sg:GoToState("idle")
    end
end)

-- When entity is destroyed
inst:ListenForEvent("onremove", function(inst)
    -- Critical for cleanup to prevent memory leaks
    -- Example: Remove all tasks and event listeners
    if inst.task then
        inst.task:Cancel()
        inst.task = nil
    end
    
    -- Clean up any external references
    if inst.ownerref and inst.ownerref:IsValid() then
        inst.ownerref.owneditem = nil
    end
end)
```

Learning to use these common events effectively is key to creating responsive, interactive mods that integrate well with the game's systems.

## Network Events

In multiplayer environments, events play a critical role in synchronizing game state between the server and clients. The event system works in conjunction with network variables to efficiently propagate changes across the network.

### How Network Synchronization Works

1. The server is authoritative and manages the "master" game state
2. Network variables (`net_*` types) store data that needs to be synchronized
3. When network variables change, they trigger events on clients
4. Clients listen for these events and update their local state accordingly

This architecture ensures that all players see a consistent game world while minimizing network traffic.

### Network Variables and Events

```lua
-- Define a network variable on an entity
-- Parameters: GUID, variable path, dirty event name
inst.mynetval = net_bool(inst.GUID, "myentity.mynetval", "mynetvaldirty")

-- On the server, set the value (this will sync to clients)
if TheWorld.ismastersim then
    inst.mynetval:set(true)  -- Will trigger "mynetvaldirty" event on clients
end

-- On clients, listen for the change event
if not TheWorld.ismastersim then
    inst:ListenForEvent("mynetvaldirty", function()
        -- Get the current synchronized value
        local current_value = inst.mynetval:value()
        
        -- Update visual representation based on the value
        if current_value then
            inst.AnimState:SetBuild("entity_active_build")
        else
            inst.AnimState:SetBuild("entity_inactive_build")
        end
    end)
end
```

### Common Network Variable Types

DST provides several types of network variables to match different data needs:

```lua
-- Boolean values
net_bool = net_bool(GUID, path, dirty_event)

-- Integer values (for whole numbers)
net_int = net_int(GUID, path, dirty_event)

-- Float values (for decimal numbers)
net_float = net_float(GUID, path, dirty_event)

-- String values
net_string = net_string(GUID, path, dirty_event)

-- Entity references
net_entity = net_entity(GUID, path, dirty_event)

-- Hash values (for optimized string comparison)
net_hash = net_hash(GUID, path, dirty_event)

-- Vector3 values (for positions)
net_vector3 = net_vector3(GUID, path, dirty_event)
```

### Real-World Example: Syncing Entity State

Here's a more complete example showing how to use network events to synchronize an entity's state between server and clients:

```lua
-- In the entity's constructor
function MyEntity:ctor(inst)
    -- Network variables - define on both server and client
    self.active = net_bool(inst.GUID, "myentity.active", "myentity.activedirty")
    self.power_level = net_float(inst.GUID, "myentity.power_level", "myentity.powerleveldirty")
    self.owner = net_entity(inst.GUID, "myentity.owner", "myentity.ownerdirty")
    
    -- Client-side handlers for network events
    if not TheWorld.ismastersim then
        -- Handle active state changes
        inst:ListenForEvent("myentity.activedirty", function(inst)
            local is_active = self.active:value()
            self:UpdateActiveVisuals(is_active)
        end)
        
        -- Handle power level changes
        inst:ListenForEvent("myentity.powerleveldirty", function(inst)
            local power = self.power_level:value()
            self:UpdatePowerVisuals(power)
        end)
        
        -- Handle owner changes
        inst:ListenForEvent("myentity.ownerdirty", function(inst)
            local owner = self.owner:value()
            self:UpdateOwnerVisuals(owner)
        end)
    end
end

-- Server-side methods to change state
function MyEntity:Activate(active_state)
    if not TheWorld.ismastersim then return end
    self.active:set(active_state)
    -- Additional server-side logic...
end

function MyEntity:SetPowerLevel(level)
    if not TheWorld.ismastersim then return end
    self.power_level:set(level)
    -- Additional server-side logic...
end

function MyEntity:SetOwner(owner_entity)
    if not TheWorld.ismastersim then return end
    self.owner:set(owner_entity)
    -- Additional server-side logic...
end

-- Client-side visual update methods
function MyEntity:UpdateActiveVisuals(is_active)
    if is_active then
        self.inst.AnimState:PlayAnimation("active")
        -- Add light, effects, etc.
    else
        self.inst.AnimState:PlayAnimation("inactive")
        -- Remove light, effects, etc.
    end
end

-- Other visual updates...
```

This pattern ensures that:
- The server maintains authority over game state
- Clients receive updates only when values actually change
- Network traffic is minimized
- Visual representations stay synchronized across all players

## Creating Custom Events in Mods

Custom events allow mod developers to create their own communication channels between different parts of their mod. This approach helps maintain clean, modular code by decoupling systems while still allowing them to interact.

### Defining Custom Events

The first step is to define your custom events. It's a good practice to list all your custom events in one place:

```lua
-- In modmain.lua or a shared constants file
local MY_EVENTS = {
    "mycustomevent1",      -- Triggered when something specific happens
    "mycustomevent2",      -- Triggered when another specific thing happens
    "special_ability_used", -- Triggered when a special ability is used
    "resource_discovered",  -- Triggered when a new resource is found
    "quest_progress",       -- Triggered when quest progress is made
}
```

### Firing Custom Events

You can fire custom events from anywhere in your code. Make sure to include relevant data that listeners might need:

```lua
-- In a prefab or component
function TriggerSpecialAbility(inst, ability_name, power_level)
    -- Perform the ability logic
    -- ...
    
    -- Then fire an event so other systems can respond
    inst:PushEvent("special_ability_used", {
        ability = ability_name,
        power = power_level,
        location = Vector3(inst.Transform:GetWorldPosition()),
        timestamp = GetTime()
    })
end
```

### Listening for Custom Events

Other parts of your mod can listen for your custom events:

```lua
-- In another prefab or component
function SetupEventListeners(inst)
    -- Listen for the special ability event
    inst:ListenForEvent("special_ability_used", function(inst, data)
        -- React to the ability being used
        print("Special ability used: " .. data.ability)
        print("Power level: " .. data.power)
        
        -- Maybe create visual effects at the location
        local fx = SpawnPrefab("sparkle_fx")
        fx.Transform:SetPosition(data.location:Get())
        
        -- Or grant buffs to nearby allies
        local x, y, z = data.location:Get()
        local allies = TheSim:FindEntities(x, y, z, 10, {"player"})
        for _, ally in ipairs(allies) do
            if ally.components.health then
                ally.components.health:DoDelta(5)
            end
        end
    end)
end
```

### Practical Example: Custom Quest System

Here's a more complete example of how you might use custom events to implement a quest system in your mod:

```lua
-- In modmain.lua
local QUEST_EVENTS = {
    "quest_accepted",
    "quest_objective_progress",
    "quest_completed",
    "quest_failed",
    "quest_abandoned"
}

-- In quest_component.lua
local QuestComponent = Class(function(self, inst)
    self.inst = inst
    self.active_quests = {}
    self.completed_quests = {}
    
    -- Set up listeners for events that might advance quests
    self:SetupQuestProgressListeners()
end)

function QuestComponent:SetupQuestProgressListeners()
    -- Listen for monster kills
    self.inst:ListenForEvent("killed", function(attacker, data)
        if data.victim and self:HasKillObjective(data.victim.prefab) then
            self:AdvanceKillObjective(data.victim.prefab)
        end
    end)
    
    -- Listen for item pickups
    self.inst:ListenForEvent("itemget", function(inst, data)
        if data.item and self:HasCollectionObjective(data.item.prefab) then
            self:AdvanceCollectionObjective(data.item.prefab)
        end
    end)
end

function QuestComponent:AcceptQuest(quest_id)
    -- Set up the quest
    local quest = QUEST_DEFINITIONS[quest_id]
    if not quest then return false end
    
    self.active_quests[quest_id] = {
        id = quest_id,
        objectives = table.deepcopy(quest.objectives),
        started_at = GetTime()
    }
    
    -- Fire the quest accepted event
    self.inst:PushEvent("quest_accepted", {
        quest_id = quest_id,
        quest_name = quest.name
    })
    
    return true
end

function QuestComponent:AdvanceKillObjective(monster_prefab)
    -- Check all active quests for this objective
    for quest_id, quest_data in pairs(self.active_quests) do
        for i, objective in ipairs(quest_data.objectives) do
            if objective.type == "kill" and objective.target == monster_prefab then
                -- Update the objective
                objective.current = (objective.current or 0) + 1
                
                -- Fire progress event
                self.inst:PushEvent("quest_objective_progress", {
                    quest_id = quest_id,
                    objective_index = i,
                    current = objective.current,
                    required = objective.count,
                    percent = objective.current / objective.count
                })
                
                -- Check if quest is completed
                if self:CheckQuestCompletion(quest_id) then
                    self:CompleteQuest(quest_id)
                end
                
                break
            end
        end
    end
end

-- Other methods for quest management...

function QuestComponent:CompleteQuest(quest_id)
    local quest = QUEST_DEFINITIONS[quest_id]
    if not quest then return false end
    
    -- Move from active to completed
    self.completed_quests[quest_id] = self.active_quests[quest_id]
    self.active_quests[quest_id] = nil
    
    -- Fire the completion event
    self.inst:PushEvent("quest_completed", {
        quest_id = quest_id,
        quest_name = quest.name,
        rewards = quest.rewards
    })
    
    -- Grant rewards
    self:GrantQuestRewards(quest_id)
    
    return true
end

-- In another file that uses the quest events
local function SetupQuestUI(inst)
    -- Listen for quest events to update the UI
    inst:ListenForEvent("quest_accepted", function(inst, data)
        -- Show a notification
        if inst.HUD and inst.HUD.controls then
            inst.HUD.controls:ShowQuestNotification("New Quest: " .. data.quest_name)
        end
    end)
    
    inst:ListenForEvent("quest_objective_progress", function(inst, data)
        -- Update the quest tracker UI
        if inst.HUD and inst.HUD.controls and inst.HUD.controls.questtracker then
            inst.HUD.controls.questtracker:UpdateObjective(
                data.quest_id, 
                data.objective_index, 
                data.current, 
                data.required
            )
        end
    end)
    
    inst:ListenForEvent("quest_completed", function(inst, data)
        -- Show completion notification and rewards
        if inst.HUD and inst.HUD.controls then
            inst.HUD.controls:ShowQuestCompletionPopup(data.quest_name, data.rewards)
        end
        
        -- Maybe play a sound
        inst.SoundEmitter:PlaySound("dontstarve/HUD/quest_complete")
    end)
end
```

### Benefits of Custom Events

Using custom events in your mods provides several advantages:

1. **Decoupling** - Different systems can interact without direct dependencies
2. **Extensibility** - Other mods can listen for your events to add compatibility
3. **Clean Code** - Event-based architecture promotes organized, maintainable code
4. **Flexibility** - New features can be added by simply adding new event listeners

When designing your mod, consider what events would make sense for other parts of your code (or other mods) to react to, and create a consistent naming scheme for your custom events.

## Comprehensive Event List

Below is a comprehensive list of events available in Don't Starve Together, organized by category:

### Player Events

```lua
-- Player spawning and initialization
"ms_playerjoined"           -- Player joined the game
"ms_playerspawn"            -- Player spawned in the world
"ms_respawnedfromghost"     -- Player revived from ghost
"respawnfromghost"          -- Player is being revived from ghost
"ghost"                     -- Player became a ghost
"playeractivated"           -- Player character fully activated
"playerdeactivated"         -- Player character deactivated (disconnect, etc.)
"ms_becameghost"            -- Player became a ghost (master simulation)

-- Player stats and state
"healthdelta"               -- Health changed
"hungerdelta"               -- Hunger changed
"sanitydelta"               -- Sanity changed
"temperaturedelta"          -- Temperature changed
"moisturedelta"             -- Moisture (wetness) changed
"goinginsane"               -- Starting to go insane
"attacked"                  -- Player was attacked
"startstarving"             -- Started starving
"stopstarving"              -- Stopped starving
"startfreezing"             -- Started freezing
"stopfreezing"              -- Stopped freezing
"startoverheating"          -- Started overheating
"stopoverheating"           -- Stopped overheating
"death"                     -- Player died
"ms_playerreroll"           -- Player changed character

-- Inventory and item events
"equip"                     -- Equipped an item
"unequip"                   -- Unequipped an item
"itemget"                   -- Got an item
"itemlose"                  -- Lost an item
"newactiveitem"             -- New active item
"stacksizechange"           -- Stack size changed
"dropitem"                  -- Dropped an item
"gotnewitem"                -- Got a new item
"builditem"                 -- Built an item
"buildsuccess"              -- Successfully built something
"buildstructure"            -- Built a structure
"techtreechange"            -- Tech tree level changed

-- Action events
"actionfailed"              -- Action failed
"locomote"                  -- Movement related event
"working"                   -- Performing work action
"finishedwork"              -- Finished work action
"makecamp"                  -- Made a camp
"performaction"             -- Performed an action
```

### World Events

```lua
-- Time and season
"clocktick"                 -- Clock ticked
"daycomplete"               -- Day cycle completed
"nightcomplete"             -- Night cycle completed
"cycleschanged"             -- Cycles (days) changed
"phasechanged"              -- Day/Dusk/Night phase changed
"ms_setseason"              -- Season being set
"ms_setseasonmode"          -- Season mode being set
"seasonchange"              -- Season changed
"seasontick"                -- Season tick

-- Weather
"rainstart"                 -- Rain started
"rainstop"                  -- Rain stopped
"snowcoverchange"           -- Snow cover changed
"lightningstriketarget"     -- Lightning strike target determined
"ms_sendlightningstrike"    -- Lightning strike sent
"ms_forceprecipitation"     -- Precipitation forced
"ms_forcenoprecipitation"   -- No precipitation forced
"stormlevel"                -- Storm level changed

-- World generation
"worldmapsetsize"           -- World map size set
"worldmappropgated"         -- World map propagated
"ms_worldgenupdate"         -- World generation update
"worldgenseedset"           -- World generation seed set
"ms_worldgenmapprepasstatus" -- World gen map prepass status
"ms_worldgenflagsset"       -- World gen flags set
"ms_worldgenmappregeneration" -- World gen map pregeneration
"ms_worldgenmappostgeneration" -- World gen map postgeneration

-- Miscellaneous world
"moonphasechanged"          -- Moon phase changed
"ms_simunpaused"            -- Simulation unpaused
"ms_simpaused"              -- Simulation paused
"pausechanged"              -- Pause state changed
"fireaddedtotile"           -- Fire added to tile
"fireremovedtromtile"       -- Fire removed from tile
"fog_thicken"               -- Fog thickened
"worldstate"                -- World state change
```

### Entity Events

```lua
-- Lifecycle
"onremove"                  -- Entity removed/destroyed
"enterlimbo"                -- Entity entered limbo state
"exitlimbo"                 -- Entity exited limbo state
"entity_sleep"              -- Entity went to sleep
"entity_wake"               -- Entity woke up
"saveandremove"             -- Entity saved and removed

-- Animation
"animover"                  -- Animation finished
"animqueueover"             -- Animation queue finished
"newstate"                  -- State graph state changed

-- Interaction
"attacked"                  -- Entity attacked
"onhitother"                -- Hit another entity
"blocked"                   -- Attack was blocked
"knockback"                 -- Entity knocked back
"startfollowing"            -- Started following
"stopfollowing"             -- Stopped following
"pickedup"                  -- Entity picked up
"putininventory"            -- Put in inventory
"ondropped"                 -- Dropped on ground
"onpickup"                  -- On pickup
"onbuilt"                   -- Structure built
"onopen"                    -- Container opened
"onclose"                   -- Container closed
"timerdone"                 -- Timer completed
"startportableboat"         -- Started portable boat
"finishportableboat"        -- Finished portable boat
```

### Environmental and Status Effects

```lua
-- Fire and temperature
"startfiredamage"           -- Started taking fire damage
"stopfiredamage"            -- Stopped taking fire damage
"onignite"                  -- Entity ignited
"onextinguish"              -- Entity extinguished
"onburnt"                   -- Entity burnt

-- Other effects
"startaeid"                 -- Started AoE ID
"stopaeid"                  -- Stopped AoE ID
"poisondamage"              -- Poison damage
"foodbuffattached"          -- Food buff attached
"foodbuffdetached"          -- Food buff detached
"sheltered"                 -- Entity became sheltered
"becameconsumable"          -- Became consumable
"reactivate"                -- Entity reactivated
```

### Component-Specific Events

```lua
-- Gardening
"plantgrowth"               -- Plant growth changed
"plantpicked"               -- Plant picked
"pollinated"                -- Plant pollinated

-- Cooking and food
"spoilratechange"           -- Spoil rate changed
"perishchange"              -- Perish state changed
"harvestable"               -- Entity became harvestable
"harvest"                   -- Entity harvested
"killed"                    -- Entity killed

-- Combat and health
"minhealth"                 -- Health reached minimum
"percentusedchange"         -- Percent used changed
"armordamaged"              -- Armor damaged
"fishingtargetgotaway"      -- Fishing target escaped
"fishingcollect"            -- Fishing collection
"fishingended"              -- Fishing ended
"killed"                    -- Entity killed
"detachchild"               -- Detached child entity
```

## Game Hooks

Hooks allow you to intercept and modify game behavior at specific points in the code execution. Unlike events, which are triggered during gameplay, hooks are applied when the game is loading, allowing you to modify core functionality before it's used.

### Understanding the Hook System

Hooks in Don't Starve Together follow a "Post-Init" pattern, meaning they run after the original initialization of components, prefabs, stategraphs, or brains. This gives you the opportunity to:

1. **Extend existing functionality** - Add new behaviors to existing game elements
2. **Override default behavior** - Replace original methods with your own implementations
3. **Modify default values** - Change properties or configurations set during initialization
4. **Add new features** - Inject completely new functionality into the game

The hook system is one of the most powerful tools available to modders, as it allows deep integration with the game's systems without having to replace entire files.

### Hook Types and Usage

DST provides several types of hooks for different parts of the game:

### Component Hooks

```lua
-- Add functionality to existing components
AddComponentPostInit("health", function(self, inst)
    -- Runs after Health component is initialized
    -- self: The component instance
    -- inst: The entity the component belongs to
    
    local old_DoDelta = self.DoDelta
    self.DoDelta = function(self, amount, ...)
        print("Health changed by: " .. amount)
        return old_DoDelta(self, amount, ...)
    end
end)
```

### Prefab Hooks

```lua
-- Modify existing prefabs
AddPrefabPostInit("wilson", function(inst)
    -- Runs after wilson prefab is created
    -- inst: The entity instance
    
    if not TheWorld.ismastersim then 
        return 
    end
    
    -- Give Wilson extra starting health
    if inst.components.health then
        inst.components.health:SetMaxHealth(200)
        inst.components.health:SetPercent(1)
    end
end)
```

### State Graph Hooks

```lua
-- Modify stategraphs
AddStategraphPostInit("wilson", function(sg)
    -- Runs after wilson stategraph is created
    -- sg: The stategraph instance
    
    -- Add a new state
    sg.states["mycustomstate"] = State{
        name = "mycustomstate",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    }
    
    -- Modify an existing state
    local old_onenter = sg.states.idle.onenter
    sg.states.idle.onenter = function(inst, ...)
        print("Wilson entered idle state")
        return old_onenter(inst, ...)
    end
})
```

### Brain Hooks

```lua
-- Modify AI brains
AddBrainPostInit("beefalobrain", function(brain)
    -- Runs after beefalo brain is created
    -- brain: The brain instance
    
    -- Add a new behavior
    table.insert(brain.bt.root.children, 
        BehaviourNode({
            Action = function(inst)
                if inst.components.hunger and inst.components.hunger:GetPercent() < 0.5 then
                    -- Look for food when hungry
                    return SUCCESS
                end
                return FAILED
            end
        })
    )
})
```

### Global Hooks

```lua
-- Run code when game entities are added
AddPrefabPostInitAny(function(inst)
    -- Runs for every prefab instantiated
    -- inst: The entity instance
    
    if inst:HasTag("player") then
        print("A player prefab was created: " .. inst.prefab)
    end
end)

-- Run code when world is generated
AddSimPostInit(function()
    -- Runs after world generation
    print("World generation complete!")
    
    -- Modify world settings
    if TheWorld.components.seasons then
        TheWorld.components.seasons:SetSeason(SEASONS.SUMMER)
    end
end)
```

## Event Handling Best Practices

### Performance Considerations

```lua
-- Avoid creating closures in ListenForEvent
-- BAD:
for i = 1, 100 do
    local entity = SpawnPrefab("rabbit")
    entity:ListenForEvent("death", function() 
        print("Rabbit " .. i .. " died!") 
    end)
end

-- GOOD:
local function OnRabbitDeath(inst, rabbitId)
    print("Rabbit " .. rabbitId .. " died!")
end

for i = 1, 100 do
    local entity = SpawnPrefab("rabbit")
    entity.rabbitId = i
    entity:ListenForEvent("death", function(inst) 
        OnRabbitDeath(inst, inst.rabbitId) 
    end)
end
```

### Memory Management

```lua
-- Always remove event listeners when they're no longer needed
local function SetupTempListener(inst, target)
    local function OnTargetDeath()
        print("Target died!")
        -- Further cleanup code
    end
    
    inst:ListenForEvent("death", OnTargetDeath, target)
    
    -- Store the callback and source for later cleanup
    inst.deathCallback = OnTargetDeath
    inst.deathSource = target
end

local function RemoveTempListener(inst)
    if inst.deathCallback and inst.deathSource then
        inst:RemoveEventCallback("death", inst.deathCallback, inst.deathSource)
        inst.deathCallback = nil
        inst.deathSource = nil
    end
end

-- Remove listeners when entity is removed
inst:ListenForEvent("onremove", function(inst)
    RemoveTempListener(inst)
end)
```

## Practical Examples

### Weather Warning System

```lua
-- This example creates a weather warning system that alerts players before storms
local function WeatherWarningSystem(inst)
    -- Precipitation warning
    TheWorld:ListenForEvent("ms_forceprecipitation", function(world, data)
        for _, player in ipairs(AllPlayers) do
            if player.components.talker then
                player.components.talker:Say("I feel raindrops coming...")
            end
        end
    end)
    
    -- Lightning warning
    TheWorld:ListenForEvent("ms_sendlightningstrike", function(world, data)
        -- Check if player is near the strike
        for _, player in ipairs(AllPlayers) do
            if player:GetDistanceSqToPoint(data.x, data.y, data.z) < 400 then
                if player.components.talker then
                    player.components.talker:Say("That lightning was too close!")
                end
                
                -- Apply temporary speed boost from fear
                if player.components.locomotor then
                    player.components.locomotor:SetExternalSpeedMultiplier("lightning_fear", 1.25)
                    player:DoTaskInTime(3, function()
                        player.components.locomotor:RemoveExternalSpeedMultiplier("lightning_fear")
                    end)
                end
            end
        end
    end)
    
    -- Season change preparation
    TheWorld:ListenForEvent("seasonchange", function(world, data)
        -- Alert players 3 days before winter
        if data.season == "winter" then
            for _, player in ipairs(AllPlayers) do
                if player.components.talker then
                    player.components.talker:Say("Winter is coming soon. I should prepare.")
                end
            end
        end
    end)
end

AddSimPostInit(WeatherWarningSystem)
```

### Enhanced Sanity System

```lua
-- This example enhances the sanity system with new effects at different sanity levels
local function EnhanceSanitySystem()
    AddComponentPostInit("sanity", function(self, inst)
        if not inst:HasTag("player") then return end
        
        -- Track previous sanity percent for threshold detection
        self.previous_percent = self:GetPercent()
        
        -- Store original DoDelta
        local oldDoDelta = self.DoDelta
        
        -- Override DoDelta to add our custom logic
        self.DoDelta = function(self, delta, ...)
            -- Call original function
            local result = oldDoDelta(self, delta, ...)
            
            -- Get new percentage
            local current_percent = self:GetPercent()
            
            -- Check if we crossed thresholds
            if current_percent <= 0.3 and self.previous_percent > 0.3 then
                -- Below 30% sanity
                inst:PushEvent("sanitylow", {percent = current_percent})
                
                -- Start spawning shadow creatures more frequently
                if inst.components.areaaware then
                    local x, y, z = inst.Transform:GetWorldPosition()
                    local nightmares = TheSim:FindEntities(x, y, z, 20, {"nightmare"})
                    
                    if #nightmares < 2 then
                        local nightmare = SpawnPrefab("crawlinghorror")
                        local offset = FindWalkableOffset(Point(x, y, z), math.random() * 2 * PI, 10, 12)
                        if offset then
                            nightmare.Transform:SetPosition(x + offset.x, 0, z + offset.z)
                        end
                    end
                end
            elseif current_percent >= 0.5 and self.previous_percent < 0.5 then
                -- Above 50% sanity
                inst:PushEvent("sanitynormal", {percent = current_percent})
                
                -- Improve combat abilities slightly when sane
                if inst.components.combat then
                    inst.components.combat.damagemultiplier = 1.1
                end
            elseif current_percent >= 0.8 and self.previous_percent < 0.8 then
                -- Above 80% sanity
                inst:PushEvent("sanityhigh", {percent = current_percent})
                
                -- Grant movement speed when very sane
                if inst.components.locomotor then
                    inst.components.locomotor:SetExternalSpeedMultiplier("high_sanity", 1.15)
                end
            elseif current_percent < 0.8 and self.previous_percent >= 0.8 then
                -- Remove high sanity bonuses
                if inst.components.locomotor then
                    inst.components.locomotor:RemoveExternalSpeedMultiplier("high_sanity")
                end
            end
            
            -- Update previous percent
            self.previous_percent = current_percent
            
            return result
        end
        
        -- Listen for custom sanity events
        inst:ListenForEvent("sanitylow", function(inst, data)
            if inst.components.talker then
                inst.components.talker:Say("The shadows are closing in...")
            end
        end)
        
        inst:ListenForEvent("sanityhigh", function(inst, data)
            if inst.components.talker then
                inst.components.talker:Say("My mind is clear and focused!")
            end
        end)
    end)
end

AddSimPostInit(EnhanceSanitySystem)
```

### Interactive Environment System

```lua
-- This example creates an interactive environment that responds to player actions
local function SetupInteractiveEnvironment()
    -- Make trees remember who chopped them
    AddPrefabPostInit("evergreen", function(inst)
        if not TheWorld.ismastersim then return end
        
        -- Track players who chop this tree
        inst.choppers = {}
        
        -- Listen for work events
        inst:ListenForEvent("worked", function(inst, data)
            if data.worker and data.worker:HasTag("player") and data.worker.userid then
                -- Record this player as having chopped this tree
                inst.choppers[data.worker.userid] = true
                
                -- If this tree has been chopped by 3 or more different players
                local chopper_count = 0
                for _ in pairs(inst.choppers) do 
                    chopper_count = chopper_count + 1 
                end
                
                if chopper_count >= 3 then
                    -- Make tree special - more logs when it falls
                    if inst.components.lootdropper then
                        local old_DropLoot = inst.components.lootdropper.DropLoot
                        inst.components.lootdropper.DropLoot = function(self, pt)
                            old_DropLoot(self, pt)
                            -- Drop extra logs
                            for i = 1, 2 do
                                local log = SpawnPrefab("log")
                                if log then
                                    local x, y, z = pt:Get()
                                    log.Transform:SetPosition(x + math.random(-1, 1), y, z + math.random(-1, 1))
                                end
                            end
                            -- Special effect
                            SpawnPrefab("pine_needles_chop").Transform:SetPosition(pt:Get())
                        end
                    end
                    
                    -- Visual indicator
                    if not inst:HasTag("communal_tree") then
                        inst:AddTag("communal_tree")
                        inst.AnimState:SetMultColour(1.1, 1.1, 1.1, 1)
                    end
                end
            end
        end)
    end)
    
    -- Birds react to player presence
    AddPrefabPostInit("crow", function(inst)
        if not TheWorld.ismastersim then return end
        
        local old_OnEntityWake = inst.OnEntityWake
        inst.OnEntityWake = function(inst)
            if old_OnEntityWake then
                old_OnEntityWake(inst)
            end
            
            -- Check for nearby players
            local x, y, z = inst.Transform:GetWorldPosition()
            local players = TheSim:FindEntities(x, y, z, 10, {"player"})
            
            for _, player in ipairs(players) do
                -- If player is sneaking
                if player.sg and player.sg:HasStateTag("idle") and 
                   player.components.locomotor and player.components.locomotor:WantsToMoveForward() and
                   player.components.locomotor.walkspeed < 3 then
                    -- Bird doesn't fly away from sneaking players
                    return
                end
            end
            
            -- If player has recently killed birds, this bird is more cautious
            local recent_bird_kills = TheWorld.components.birdrespawner and TheWorld.components.birdrespawner.recent_bird_kills or 0
            if recent_bird_kills > 3 then
                -- Increase detection range
                local x, y, z = inst.Transform:GetWorldPosition()
                local players = TheSim:FindEntities(x, y, z, 15, {"player"})
                if #players > 0 then
                    inst:PushEvent("startled")
                end
            end
        end
    end)
    
    -- Track bird kills for the world
    if not TheWorld.components.birdrespawner then return end
    
    local old_SpawnModeNormal = TheWorld.components.birdrespawner.SpawnModeNormal
    TheWorld.components.birdrespawner.SpawnModeNormal = function(self, ...)
        -- Track recent bird kills
        self.recent_bird_kills = self.recent_bird_kills or 0
        
        -- Decay bird kill count every day
        if not self.bird_kill_task then
            self.bird_kill_task = TheWorld:DoPeriodicTask(TUNING.TOTAL_DAY_TIME, function()
                if self.recent_bird_kills > 0 then
                    self.recent_bird_kills = math.max(0, self.recent_bird_kills - 1)
                end
            end)
        end
        
        return old_SpawnModeNormal(self, ...)
    end
    
    -- Listen for bird deaths
    AddPrefabPostInit("bird", function(inst)
        if not TheWorld.ismastersim then return end
        
        inst:ListenForEvent("death", function()
            if TheWorld.components.birdrespawner then
                TheWorld.components.birdrespawner.recent_bird_kills = 
                    (TheWorld.components.birdrespawner.recent_bird_kills or 0) + 1
            end
        end)
    end)
end

AddSimPostInit(SetupInteractiveEnvironment) 
```

## Summary and Best Practices

The event system and hooks are fundamental tools for creating mods in Don't Starve Together. Here's a summary of key concepts and best practices to keep in mind:

### Key Concepts Recap

- **Events** are signals fired during gameplay that entities can listen for and react to
- **Hooks** are initialization-time modifications that change how game systems function
- **Network variables** synchronize state between server and clients using events
- **Custom events** allow you to create your own communication channels in mods

### Best Practices for Events

1. **Clean up event listeners** when they're no longer needed to prevent memory leaks
   ```lua
   inst:ListenForEvent("onremove", function()
       inst:RemoveEventCallback("myevent", myeventfn)
   end)
   ```

2. **Keep event handlers focused** - Each handler should do one specific thing
   ```lua
   -- Good practice - separate handlers for different concerns
   inst:ListenForEvent("attacked", OnAttackedUpdateHealth)
   inst:ListenForEvent("attacked", OnAttackedPlayEffects)
   
   -- Bad practice - one handler doing too many things
   inst:ListenForEvent("attacked", OnAttackedDoEverything)
   ```

3. **Use descriptive event names** for custom events that clearly indicate what happened
   ```lua
   -- Good: Clear and specific
   inst:PushEvent("special_ability_activated", data)
   
   -- Bad: Vague and unclear
   inst:PushEvent("effect1", data)
   ```

4. **Include all relevant data** in your event payload to avoid coupling between systems
   ```lua
   inst:PushEvent("harvest_complete", {
       harvester = harvester,
       position = Vector3(x, y, z),
       item_prefab = "carrot",
       quantity = 3,
       quality = "perfect"
   })
   ```

### Best Practices for Hooks

1. **Always check for server/client** when using hooks that might affect gameplay
   ```lua
   AddPrefabPostInit("wilson", function(inst)
       if not TheWorld.ismastersim then return end
       -- Server-side modifications...
   end)
   ```

2. **Preserve original functionality** when overriding methods unless you have a good reason not to
   ```lua
   -- Save original method
   local oldOnAttacked = inst.components.health.OnAttacked
   
   -- Override with new behavior that calls the original
   inst.components.health.OnAttacked = function(self, attacker, damage, ...)
       -- Custom code before
       local result = oldOnAttacked(self, attacker, damage, ...)
       -- Custom code after
       return result
   end
   ```

3. **Use AddComponentPostInit sparingly** as it affects all instances of a component

4. **Consider compatibility with other mods** when applying hooks to commonly modified components

### Performance Considerations

1. **Avoid creating too many event listeners** for frequently fired events
2. **Keep event handling code efficient** as it might run many times per second
3. **Be careful with hooks that run on every entity** (like AddPrefabPostInitAny)
4. **Clean up all references in onremove events** to prevent memory leaks

By following these practices, you'll create mods that are more efficient, more maintainable, and more compatible with other mods in the ecosystem.

## Conclusion

The event system and hooks provide powerful tools for modifying and extending Don't Starve Together. Events allow entities to communicate and react to gameplay changes, while hooks let you modify the core behavior of game systems.

Understanding when to use each approach is key to successful modding:

- Use **events** when you need to react to things happening during gameplay
- Use **hooks** when you need to modify how the game works at a fundamental level
- Use **network events** when you need to synchronize state in multiplayer
- Use **custom events** when building complex mods with multiple interacting systems

With these tools at your disposal, you can create sophisticated mods that seamlessly integrate with the game and provide new experiences for players. 