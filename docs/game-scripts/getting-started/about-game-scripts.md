---
id: about-game-scripts
title: About Don't Starve Together Game Scripts
description: Introduction to DST's Lua-based game scripts and their role in defining gameplay mechanics, UI systems, and mod support
sidebar_position: 2
slug: getting-started/about-game-scripts
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# About Don't Starve Together Game Scripts

## What Are DST Game Scripts?

Don't Starve Together (DST) is built on a comprehensive Lua scripting system that defines virtually every aspect of the game's behavior. These scripts form the backbone of DST's gameplay mechanics, user interface, artificial intelligence, world generation, and modding capabilities.

The game scripts serve as both:
- **Game Logic Implementation**: Core systems that make DST function
- **Modding Framework**: Foundation that enables community modifications and customizations

## Why Lua Scripts Matter

### 1. **Flexibility and Customization**
DST's Lua-based architecture allows for:
- Dynamic gameplay modifications without engine recompilation
- Real-time testing and iteration of game mechanics
- Extensive modding capabilities for the community
- Easy configuration and tuning of game parameters

### 2. **Modular Design**
The script system organizes functionality into discrete, reusable components:
- **Components**: Reusable functionality attached to entities (health, inventory, combat)
- **Prefabs**: Complete entity definitions (characters, items, structures)
- **Stategraphs**: Animation and behavior state management
- **Brains**: AI decision-making systems

### 3. **Community Empowerment**
The accessible Lua scripting system enables:
- Thousands of community-created mods
- Custom game modes and challenges
- Quality-of-life improvements and features
- Educational opportunities for learning game development

## Script System Architecture

### Core Script Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **[Components](../core-systems/index.md)** | Reusable entity behaviors | Health, Inventory, Combat, Cooking |
| **[Prefabs](../perfabs/index.md)** | Complete entity definitions | Characters, Items, Structures, Creatures |
| **[Stategraphs](../stategraphs/index.md)** | Animation and state management | Player actions, creature behaviors |
| **[Brains](../brains/index.md)** | AI decision-making logic | Creature AI, NPC behaviors |
| **[Behaviours](../behaviours/index.md)** | Reusable AI patterns | Approach target, flee danger, wander |
| **[Widgets](../widgets/index.md)** | User interface elements | Buttons, panels, inventory displays |
| **[Screens](../screens/index.md)** | Full screen interfaces | Main menu, crafting screens, settings |

### Script Relationships

```
Prefab (Entity Definition)
├── Components (Functionality)
│   ├── Health Component
│   ├── Inventory Component
│   └── Combat Component
├── Stategraph (Animation/States)
│   ├── Idle State
│   ├── Walking State
│   └── Attack State
└── Brain (AI Logic)
    ├── Behaviours (AI Patterns)
    └── Decision Trees
```

## Understanding the Codebase

### File Organization

The DST scripts are organized in a logical hierarchy:

```
dst-scripts/
├── components/          # Reusable entity functionality
├── prefabs/            # Complete entity definitions  
├── stategraphs/        # Animation and state management
├── brains/             # AI decision-making systems
├── behaviours/         # Reusable AI patterns
├── widgets/            # UI components
├── screens/            # Full screen interfaces
├── map/                # World generation systems
└── util/               # Utility functions and helpers
```

### Script Interconnections

DST scripts work together through well-defined interfaces:

1. **Entity-Component System**: Entities (prefabs) are composed of multiple components that provide specific functionality
2. **Event System**: Components communicate through events, enabling loose coupling
3. **State Management**: Stategraphs manage entity animations and behavioral states
4. **AI Framework**: Brains coordinate behaviors to create intelligent entity actions

## Learning Path for DST Scripts

### 1. **Start with Components**
- Understand how components provide functionality to entities
- Learn common patterns like health, inventory, and transform components
- Practice reading component implementations

### 2. **Explore Prefabs**
- See how components combine to create complete entities
- Understand prefab construction and initialization
- Learn about tags, physics, and entity relationships

### 3. **Study Stategraphs**
- Learn how animations and states are managed
- Understand state transitions and timeline events
- See how player actions are implemented

### 4. **Examine AI Systems**
- Explore how brains coordinate entity behavior
- Understand the relationship between brains and behaviours
- Learn how AI decisions are made and executed

## Common Script Patterns

### Component Pattern
```lua
-- Components provide reusable functionality
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
end)

function MyComponent:SetValue(val)
    self.value = val
    self.inst:PushEvent("valuechanged", {value = val})
end
```

### Event-Driven Communication
```lua
-- Components communicate through events
inst:ListenForEvent("healthdelta", function(inst, data)
    -- React to health changes
    if data.newpercent <= 0.25 then
        inst:AddTag("low_health")
    end
end)
```

### Prefab Construction
```lua
-- Prefabs combine components into complete entities
local function CreateMyEntity()
    local inst = CreateEntity()
    
    -- Add components
    inst:AddComponent("health")
    inst:AddComponent("inventory")
    inst:AddComponent("combat")
    
    -- Configure components
    inst.components.health:SetMaxHealth(100)
    
    return inst
end
```

## Building on DST Scripts

### For Game Understanding
- **Study Mechanics**: Learn how game features are implemented
- **Trace Interactions**: Follow event chains and component interactions
- **Understand Balance**: See how game parameters create balanced gameplay

### For Modding
- **Override Behavior**: Modify existing components and prefabs
- **Add Features**: Create new components and functionality
- **Custom Content**: Design new items, creatures, and mechanics

### For Education
- **Game Architecture**: Learn professional game development patterns
- **Lua Programming**: Practice scripting in a real-world context
- **System Design**: Understand how complex systems are organized

## Documentation Structure

This documentation is organized to support your learning journey:

### **[Core Systems](../core-systems/index.md)**
Fundamental components and utilities that power DST's gameplay

### **[Game Features](../)**
Specific game systems like stategraphs, brains, and prefabs

### **[Utilities and Tools](../util/index.md)**
Helper functions and development tools

### **[Reference Materials](../)**
Comprehensive API documentation and implementation details

## Getting Started

Ready to explore DST's game scripts? Here's your next steps:

1. **[Browse Core Systems](../core-systems/index.md)**: Start with fundamental components
2. **[Explore Prefabs](../perfabs/index.md)**: See how entities are constructed
3. **[Study Examples](../core-systems/fundamentals/core/index.md)**: Learn from real implementations
4. **[Try Modding](../core-systems/mod-support/index.md)**: Apply your knowledge practically

## Contributing to Documentation

Found something unclear or have improvements to suggest? This documentation benefits from community contributions:

- **Report Issues**: Help us identify outdated or incorrect information
- **Suggest Improvements**: Share your learning experience to help others
- **Add Examples**: Contribute practical examples and use cases

The DST community thrives on shared knowledge and collaborative learning. Your insights help make this documentation better for everyone exploring Don't Starve Together's fascinating script system.
