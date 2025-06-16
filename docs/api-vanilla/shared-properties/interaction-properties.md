---
id: interaction-properties
title: Interaction Properties
sidebar_position: 3
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Interaction Properties

*API Version: 619045*

Interaction properties define how entities in Don't Starve Together can be interacted with by players and other entities. These properties span across various components and create a consistent interaction system that handles actions like examining, picking up, attacking, and using items.

## Core Interaction Properties

| Property | Type | Description |
|----------|------|-------------|
| `clickable` | Boolean | Whether the entity can be clicked on |
| `inspectable` | Boolean | Whether the entity can be examined |
| `isactivatable` | Boolean | Whether the entity can be activated |
| `interactive` | Boolean | General property for interactive status |
| `useable` | Boolean | Whether the entity can be used |
| `useableitem` | Boolean | Whether the item can be used on other entities |
| `actionable` | Boolean | Whether actions can be performed on the entity |
| `attackwhenworkable` | Boolean | Whether entity is attacked when right-clicked with a tool |
| `inventoryitem` | Boolean | Whether the entity can be picked up into inventory |
| `unwrappable` | Boolean | Whether the entity can be unwrapped |
| `activatable` | Boolean | Whether the entity can be turned on/off |

## Interaction Mechanisms

Interactions in Don't Starve Together work through a layered system of action priority and targeting:

### Action Detection and Prioritization

When a player attempts to interact with an entity, the system follows these steps:

1. **Detect Possible Actions**: Identify all possible actions based on:
   - The entity's components
   - The player's current state (items held, buffs, etc.)
   - Distance and positioning

2. **Action Prioritization**: Sort actions based on priority values
   - Higher priority actions are shown first in the action wheel
   - Default actions are executed when right-clicking without a specific selection

3. **Action Execution**: Perform the selected action through the component's handler

```lua
-- Example action handler
function SomeComponent:DoAction(act)
    if act.action == ACTIONS.EXAMINE then
        -- Handle examination
        return true
    elseif act.action == ACTIONS.PICKUP then
        -- Handle pickup
        return true
    end
    return false
end
```

### Interaction Distance

Interactions have distance requirements:

- **Standard Interaction**: Usually requires player to be within ~2-4 game units
- **Far Interaction**: Some actions can work at longer ranges (e.g., examining)
- **Weapon Interaction**: Based on weapon reach for attacks
- **Obstacle Checking**: Line-of-sight checks for many interactions

```lua
-- Example distance check in component
function Component:TestAction(act, doer)
    -- Check if interaction is physically possible
    if act.action == ACTIONS.INTERACT and 
       doer:GetDistanceSqToInst(self.inst) <= self.interaction_distance_sq then
        return true
    end
    return false
end
```

## Action Types

Don't Starve Together has several standard action types:

| Action | Description | Common Components |
|--------|-------------|-------------------|
| `EXAMINE` | Look at and describe the entity | Inspectable |
| `PICKUP` | Pick up into inventory | Inventoryitem |
| `EAT` | Consume for food value | Edible |
| `CHOP` | Cut down with an axe | Workable |
| `MINE` | Break with a pickaxe | Workable |
| `HAMMER` | Dismantle with a hammer | Workable |
| `ATTACK` | Deal damage | Combat |
| `LIGHT` | Light on fire | Lighter |
| `USE` | Use an item | UseableItem |
| `DEPLOY` | Place in the world | Deployable |
| `HARVEST` | Collect resources | Harvestable |
| `COOK` | Cook on fire | Cookable |
| `REPAIR` | Fix damaged item | Repairable |
| `STORE` | Put into container | Container |
| `EQUIP` | Wear or hold | Equippable |
| `OPEN` | Open container | Container |

## Entity State and Interactions

Entity state affects available interactions:

- **Burning**: Usually prevents standard interactions
- **Frozen**: Many interactions disabled until thawed
- **Sleeping**: Can enable special interactions
- **Building**: Different interactions during construction
- **Damaged**: May enable repair actions
- **Charged**: Special interactions for electrical items

## Interaction-Related Components

Several components define interaction properties:

| Component | Key Interaction Properties |
|-----------|----------------------------|
| [Inspectable](../components/inspectable.md) | `description`, `nameoverride`, `getstatus` |
| [Inventoryitem](../components/other-components.md) | `cangoincontainer`, `nobounce`, `canbepickedup` |
| [Workable](../components/workable.md) | `workable`, `workleft`, `workaction`, `onwork` |
| [UseableItem](../components/other-components.md) | `canuse`, `onuse`, `inuse` |
| [Equippable](../components/equippable.md) | `equipslot`, `isequipped`, `onequip` |
| [Activatable](../components/other-components.md) | `inactive`, `inactive_name`, `active_name` |
| [Tradable](../components/trader.md) | `goldvalue`, `tradefor`, `acceptsstacks` |

## Custom Interaction Handlers

Games and mods can define custom interaction handlers through component methods:

```lua
-- Example of custom interaction handler
function MyComponent:GetActionVerb(actiontype)
    if actiontype == "EXAMINE" then
        return "Analyze"  -- Custom examine verb
    elseif actiontype == "ACTIVATE" then
        return self.activated and "Deactivate" or "Activate"
    end
    return nil -- Fall back to default
end

function MyComponent:CustomInteract(doer)
    -- Custom interaction logic here
    self.inst:PushEvent("interacted_with", {doer = doer})
    return true
end
```

## Controller Support

Interaction properties handle different input methods:

- **Mouse/Keyboard**: Direct clicking on entities
- **Controller**: Auto-targeting nearby entities
- **Action Wheel**: When multiple actions are available
- **Action Prioritization**: Determining which action to perform

```lua
-- Example controller targeting priority
function MyComponent:TranslateControllerUse()
    if self.canuseontargets then
        return "INTERACT"  -- Higher priority for controller users
    end
    return nil
end
```

## Common Interaction Events

Entities trigger several interaction-related events:

- `onactivate` - When activated
- `ondeactivate` - When deactivated
- `onpickup` - When item is picked up
- `ondrop` - When item is dropped
- `onputininventory` - When placed in inventory
- `onremoved` - When removed from inventory
- `onopen` - When container is opened
- `onclose` - When container is closed
- `onbuilt` - When structure is built

## See also

- [Inspectable Component](../components/inspectable.md) - For entity examination
- [Workable Component](../components/workable.md) - For work-based interactions like chopping and mining
- [Inventoryitem Component](../components/other-components.md) - For pickup and inventory interactions
- [Equippable Component](../components/equippable.md) - For wearing and wielding items
- [Trader Component](../components/trader.md) - For trading interactions
- [Container Component](../components/container.md) - For storage interactions
- [ActionHandler System](../core/entity-system.md) - For the action handling system
