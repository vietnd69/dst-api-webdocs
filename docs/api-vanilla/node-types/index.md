---
id: node-types-overview
title: Node Types Overview
sidebar_position: 1
slug: /api/node-types
---

# Node Types Overview

Don't Starve Together's game architecture is built around a variety of specialized node types that work together to create the game experience. Each node type serves a specific purpose in the game's ecosystem.

## Core Node Types

The DST codebase is structured around these fundamental node types:

### [Entity](/docs/api-vanilla/node-types/entity)
Entities are the fundamental objects in the game world. Everything from characters and creatures to items and structures are entities. They serve as containers for components and provide the foundation for the entity-component system.

### [Component](/docs/api-vanilla/node-types/component)
Components are reusable modules that provide specific behaviors and properties to entities. They implement discrete functionality that can be attached to entities to give them capabilities like health, inventory, combat, and more.

### [Prefab](/docs/api-vanilla/node-types/prefab)
Prefabs are templates or blueprints for creating entities. They define which components an entity should have and set initial values for those components. Prefabs allow for consistent creation of similar entities.

## Behavioral Node Types

These node types handle AI, movement, and state management:

### [Brain](/docs/api-vanilla/node-types/brain)
Brains control the AI behavior of entities, defining how they make decisions and respond to the environment. They use behavior trees to create complex decision-making processes.

### [Stategraph](/docs/api-vanilla/node-types/stategraph)
Stategraphs manage animations, sounds, and state-based behaviors for entities. They define the states an entity can be in and the transitions between those states.

## Interface Node Types

These node types handle the user interface:

### [Widget](/docs/api-vanilla/node-types/widget)
Widgets are UI elements that make up the game's interface. They handle rendering, input, and animation for UI components.

## Networking Node Types

These node types handle multiplayer functionality:

### [Network](/docs/api-vanilla/node-types/network)
Network nodes manage the synchronization of game state between server and clients, allowing for multiplayer gameplay.

## System Interaction

All these node types interact to create the complete game experience:

1. **Prefabs** define what an entity is and which components it has
2. **Entities** provide the foundation for game objects
3. **Components** provide specific behaviors to entities
4. **Brains** control AI decision-making
5. **Stategraphs** manage animations and state-based behaviors
6. **Widgets** create the user interface
7. **Network** nodes synchronize the game state for multiplayer

Understanding how these node types work together is key to modifying the game or creating new content for Don't Starve Together. 