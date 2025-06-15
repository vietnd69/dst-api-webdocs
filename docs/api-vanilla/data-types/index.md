---
id: data-types-overview
title: Data Types Overview
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/data-types
---

# Data Types Overview

Don't Starve Together uses a variety of data types for representing and manipulating game data. These data types can be classified into several categories:

## Basic Types

- **Number**: Lua's numerical type, used for integers and floating-point values
- **String**: Text data, often used for identifiers, names, and messages
- **Boolean**: Logical true/false values
- **Function**: Callable code blocks that can accept arguments and return values
- **nil**: Represents the absence of a value

## DST-Specific Types

- **[Vector](/docs/api-vanilla/data-types/vector)**: Represents 2D or 3D positions, directions, and velocities
- **[Colour](/docs/api-vanilla/data-types/colour)**: Represents RGBA color values with components ranging from 0 to 1
- **[Network Variables](/docs/api-vanilla/data-types/netvar)**: Special variables used to synchronize data between server and client
- **[Lua Table](/docs/api-vanilla/data-types/luatable)**: The core data structure in Lua, used extensively throughout the DST API

## Object References

- **Entity**: References to game entities like players, creatures, and items
- **Component**: References to entity components that define behavior and properties
- **Instance**: Generic references to instantiated game objects

Understanding these data types is essential for effectively working with the DST API and creating mods that interact with the game world. 
