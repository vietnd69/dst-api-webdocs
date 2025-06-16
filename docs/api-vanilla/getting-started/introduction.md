---
id: introduction
title: Introduction to DST API
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/getting-started
---
*Last Update: 2023-07-06*
# Introduction to Don't Starve Together API

Don't Starve Together (DST) is a multiplayer survival game developed by Klei Entertainment. The game's modding API allows developers to create custom content, modify game mechanics, and enhance gameplay through the use of Lua scripts.

## What is the DST API?

The DST API (Application Programming Interface) is a set of functions, data structures, and systems that allow modders to interact with the game engine. Through this API, you can:

- Create new items, creatures, structures, and characters
- Modify existing game content and mechanics
- Add new gameplay systems and features
- Change how the game looks and behaves

## Key Concepts

Before diving into modding DST, it's important to understand some fundamental concepts:

### Component-Entity System

DST uses a component-based architecture where game objects (entities) are composed of various components that define their behavior. For example:

- A `health` component manages an entity's health state
- A `combat` component handles attacking and being attacked
- An `inventory` component allows an entity to carry items

Understanding how components work and interact is essential for effective modding.

### Prefabs

Prefabs (short for "prefabricated objects") are the templates that define entities in the game. Each prefab specifies:

- Which components the entity should have
- Default values for those components
- Visual assets and animations
- Network synchronization properties

### Networking

As a multiplayer game, DST separates code that runs on the server from code that runs on clients. Understanding this distinction is crucial:

- Server code manages game state and authoritative logic
- Client code handles visual representation and player input
- Network variables synchronize data between server and clients

## Getting Started with Modding

To begin modding Don't Starve Together:

1. Install the game and set up the modding environment
2. Learn the basic structure of a mod
3. Understand how to use the API documentation
4. Start with simple modifications before moving to complex features

The following sections in this documentation will guide you through these steps and provide detailed information about the DST API components.

## Documentation Structure

This documentation is organized to help both beginners and experienced modders:

- **Getting Started**: Basic concepts and setup guides
- **Core Systems**: Fundamental game systems like entities and components
- **Global Objects**: Important global variables and functions
- **Entity Framework**: Details on creating and modifying game objects
- **World API**: World generation and management
- **Game Systems**: Specific gameplay systems like crafting and combat
- **Data Types & Utilities**: Helper functions and common data structures
- **Modding Reference**: Constants, tuning values, and best practices
- **Examples & Tutorials**: Step-by-step guides for common modding tasks 
