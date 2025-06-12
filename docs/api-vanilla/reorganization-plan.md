---
id: reorganization-plan
title: API Documentation Reorganization Plan
sidebar_position: 0
---

# API Documentation Reorganization Plan

## Current Structure

The current documentation structure includes these main sections:
- Global Objects
- Core API
- Components
- Prefabs
- Stategraphs
- Recipes
- Utilities
- World
- Node Types
- Shared Properties
- Data Types

## Proposed Reorganization

Based on analysis of the DST API and best practices for API documentation, we propose the following reorganized structure:

### 1. Getting Started
- Introduction to DST API
- Setting Up Your Development Environment
- Basic Modding Concepts
- Mod Structure

### 2. Core Systems
- Entity System
- Component System
- Event System
- State Graphs
- Networking

### 3. Global Objects
- TheWorld
- ThePlayer
- TheNet
- TheSim
- GLOBAL

### 4. Entity Framework
- EntityScript
- Prefabs
- Components
- Tags
- Network Replication

### 5. World API
- World Generation
- Seasons
- Weather
- Map
- World Settings

### 6. Game Systems
- Crafting
- Cooking
- Combat
- Inventory
- Character Skills
- Events

### 7. Data Types & Utilities
- Vector
- Color
- Network Variables
- Lua Tables
- Common Utilities
- String Helpers
- Math Functions

### 8. Modding Reference
- Constants
- Tuning
- Common Patterns
- Performance Considerations
- Best Practices

### 9. Examples & Tutorials
- Creating a Basic Mod
- Adding New Items
- Custom Character
- Custom Recipes
- Advanced Techniques

## Implementation Approach

To implement this reorganization:

1. First, we'll complete the core content for each section
2. Then reorder existing documentation into the new structure
3. Create new sections where needed
4. Update navigation and cross-references
5. Review for consistency

The goal is to provide a more intuitive organization that follows both the conceptual model of the game engine and the typical learning path of mod developers. 