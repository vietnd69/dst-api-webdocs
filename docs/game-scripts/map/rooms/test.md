---
id: test
title: Test
description: Registers several test rooms for world generation, each configured with specific layouts and content distribution for debugging and development.
tags: [worldgen, test]
sidebar_position: 10

last_updated: 2026-03-15
build_version: 714014
change_status: stable
category_type: root
source_hash: 6e18f946
system_scope: world
---

# Test

> Based on game build **714014** | Last updated: 2026-03-15

## Overview
This file registers a set of predefined test rooms for world generation in Don't Starve Together. These rooms are used internally for development, debugging, and validation of world generation logic. Each room is defined with a unique name, visual colour, tile type, and content specifications—including static layouts, prefab counts, and distribution probabilities.

The component does not define a new ECS component. Instead, it is a script-level configuration that invokes the global `AddRoom()` function to register room templates with the world generator.

## Usage example
This script is loaded automatically during startup as part of the core worldgen setup and is not intended for manual instantiation.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

No public properties — this file does not define or expose any component-level variables.

## Main functions
This file contains no component functions — it is a top-level configuration script.

## Events & listeners
Not applicable.
