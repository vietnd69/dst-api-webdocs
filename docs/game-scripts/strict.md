---
id: strict
title: Strict
description: Enforces Lua strict-mode behavior by requiring all global variables to be explicitly declared before assignment or access.
tags: [tooling, debugging]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9999dbee
system_scope: world
---

# Strict

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`strict.lua` implements a global environment enforcer that ensures global variable usage adheres to strict declarations. It modifies the global metatable (`_G`) to prevent accidental creation of undeclared globals, which helps catch typos and unintended side effects during development. This is a foundational development-time utility—typically loaded early in mod or game initialization—and is not intended for runtime gameplay components.

The component does not attach to entities or interact with the ECS; it operates at the Lua interpreter level by overriding `__newindex` and `__index` metamethods on the global environment.

## Usage example
This module is automatically loaded by the game/mod framework and does not require explicit instantiation by modders. Declaring globals explicitly using the `global()` helper ensures compliance:
```lua
-- Declare globals before use
global("MY_VAR", "ANOTHER_VAR")

MY_VAR = 42
ANOTHER_VAR = "hello"

-- Accessing undeclared globals raises an error:
-- print(MISSPelled_VAR)  -- would throw: "variable 'MISSPelled_VAR' is not declared"
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `global(...)`
*   **Description:** Marks one or more variable names as declared in the global environment, allowing them to be assigned or read without triggering strict-mode errors.
*   **Parameters:** `...` (list of strings) — one or more global variable names to declare.
*   **Returns:** Nothing.

## Events & listeners
Not applicable