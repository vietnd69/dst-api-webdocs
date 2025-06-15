---
id: brain
title: Brain
sidebar_position: 5
last_updated: 2023-07-06
---

# Brain

Brains are specialized scripts that control the AI and decision-making behavior of entities. They define how entities respond to their environment and other entities.

## Overview

Brains use behavior trees to create complex AI behaviors by combining simpler behaviors. Each brain consists of a root node that contains different types of behavior nodes such as:

- Priority nodes: Execute behaviors in order of priority
- Sequence nodes: Execute behaviors in sequence
- Decorator nodes: Modify the behavior of child nodes

## Common Brain Structure

```lua
local SomeBrain = Class(Brain, function(self, inst)
    Brain._ctor(self, inst)
end)

function SomeBrain:OnStart()
    local root = PriorityNode(
    {
        -- Behaviors in order of priority
        ChaseAndAttack(self.inst, MAX_CHASE_TIME),
        Wander(self.inst),
    }, 0)
    
    self.bt = BT(self.inst, root)
end

return SomeBrain
```

## Key Functions

- `OnStart()`: Initializes the behavior tree
- `OnStop()`: Cleans up when the brain stops
- `UpdateTarget()`: Updates target information

## Common Behaviors

- `ChaseAndAttack`: Chase and attack targets
- `RunAway`: Run from threats
- `Wander`: Wander around aimlessly
- `Follow`: Follow a target
- `FindFood`: Search for food
- `Panic`: Flee from danger

## Example

The Wilson brain is a simple example that controls player-owned characters when they're under AI control:

```lua
function WilsonBrain:OnStart()
    local root = PriorityNode(
    {
        WhileNode(function() 
            return self.inst.components.playercontroller ~= nil 
                and self.inst.components.playercontroller:IsControlPressed(CONTROL_PRIMARY) 
            end, 
            "Hold LMB", 
            ChaseAndAttack(self.inst, MAX_CHASE_TIME)
        ),
        ChaseAndAttack(self.inst, MAX_CHASE_TIME, nil, 1),
    }, 0)

    self.bt = BT(self.inst, root)
end
```

## Related Components

- Combat component
- Locomotor component
- Follower component 
