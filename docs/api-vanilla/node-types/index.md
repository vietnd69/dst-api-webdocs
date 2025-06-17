---
id: node-types-overview
title: Node Types Overview
sidebar_position: 1
last_updated: 2023-08-15
slug: /api/node-types
---
*Last Update: 2023-08-15*
# Node Types Overview

Don't Starve Together's game architecture is built around a robust system of specialized node types that work together to create the game experience. Each node type serves a specific purpose in the game's ecosystem, with its own properties, methods, and interactions with other nodes.

## Node Type Categories

DST's node types are organized into the following categories:

### Entity Framework Nodes
These nodes form the foundation of all game objects:

| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| [Entity](/docs/api-vanilla/node-types/entity) | Base object in the game world | Transform, AnimState, Tags |
| [Component](/docs/api-vanilla/node-types/component) | Reusable modules for entity behaviors | Component-specific properties |
| [Prefab](/docs/api-vanilla/node-types/prefab) | Templates for entity creation | Assets, Functions |

### Behavioral AI Nodes
These nodes control entity decision-making and state management:

| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| [Brain](/docs/api-vanilla/node-types/brain) | Controls AI decision-making | BehaviorTree, UpdatePeriod |
| [Action Nodes](/docs/api-vanilla/node-types/action-nodes) | Performs specific actions in behavior trees | Status, Visit Function |
| [Condition Nodes](/docs/api-vanilla/node-types/condition-nodes) | Evaluates conditions in behavior trees | Status, Condition Function |
| [Sequence Nodes](/docs/api-vanilla/node-types/sequence-nodes) | Executes multiple nodes in sequence | Children, CurrentChild |
| [Priority Nodes](/docs/api-vanilla/node-types/priority-nodes) | Selects highest priority action | Children, Priorities |
| [Decorator Nodes](/docs/api-vanilla/node-types/decorator-nodes) | Modifies behavior of other nodes | Child, Decorator Function |

### Animation and State Nodes
These nodes manage entity animations and states:

| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| [Stategraph](/docs/api-vanilla/node-types/stategraph) | Manages entity state and animations | States, Events, Timeline |

### UI and Interface Nodes
These nodes create and control the user interface:

| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| [Widget](/docs/api-vanilla/node-types/widget) | UI elements for game interface | Position, Scale, Children |

### Network Communication Nodes
These nodes handle multiplayer functionality:

| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| [Network](/docs/api-vanilla/node-types/network) | Synchronizes game state across clients | NetVars, Replication |

## Common Node Properties and Methods

While each node type has its own specific properties and methods, there are some common patterns across many node types:

### Common Properties
- **GUID**: Unique identifier for node instances
- **parent/children**: Hierarchical relationships between nodes
- **tags**: Labels that identify node characteristics
- **components**: Attached functionality modules (for Entity nodes)

### Common Methods
- **AddChild/RemoveChild**: Manage node hierarchy
- **AddTag/RemoveTag**: Manage node identification tags
- **AddComponent/RemoveComponent**: Manage entity components
- **OnUpdate**: Called during update cycle

## Working with Node Types

When developing mods or extensions for Don't Starve Together, you'll typically work with these node types in these ways:

1. **Creation**: Instantiating new nodes
2. **Configuration**: Setting properties and connecting nodes
3. **Behavior**: Defining how nodes respond to events and conditions
4. **Integration**: Making nodes work with the existing game systems

## Node Type Inheritance

Many node types inherit properties and methods from parent classes:

```
Entity
  ├── Character
  ├── Item
  └── Structure

BehaviorNode
  ├── ActionNode
  ├── ConditionNode
  ├── SequenceNode
  ├── PriorityNode
  └── DecoratorNode

Widget
  ├── Button
  ├── Text
  └── Image
```

## System Interaction

All these node types interact to create the complete game experience:

1. **Prefabs** define what an entity is and which components it has
2. **Entities** provide the foundation for game objects
3. **Components** provide specific behaviors to entities
4. **Brains** control AI decision-making using various node types
5. **Stategraphs** manage animations and state-based behaviors
6. **Widgets** create the user interface
7. **Network** nodes synchronize the game state for multiplayer

Understanding how these node types work together is key to modifying the game or creating new content for Don't Starve Together. 
