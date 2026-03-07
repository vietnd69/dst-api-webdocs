---
id: quagmire_pot
title: Quagmire Pot
description: Creates and registers prefabs for Quagmire cooking pots with configurable capacity and visual variants.
tags: [crafting, cooking, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 909cf750
system_scope: crafting
---

# Quagmire Pot

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_pot.lua` is a factory script that defines reusable prefab templates for Quagmire cooking vessels. It generates distinct pot prefabs (standard, small, and syrup variants) by parameterizing geometry, animations, slot count, and tags. Each pot prefab supports being the server-side authoritative entity (`master_postinit`) and a lightweight client-side representation.

## Usage example
```lua
-- Registers three prefabs: quagmire_pot, quagmire_pot_small, and quagmire_pot_syrup
local quagmire_pot = require "prefabs/quagmire_pot"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `quagmire_stewer` and `quagmire_pot` to every generated instance. May additionally add `quagmire_syrup_cooker` (for syrup variant).

## Properties
No public properties

## Main functions
This file does not define component classes or instance methods; it defines prefab construction logic. As such, there are no main functions documented here.

### `MakePot(suffix, goop_suffix, numslots, tag)`
*   **Description:** Factory function that constructs and returns a `Prefab` definition for a Quagmire cooking pot. It configures animations, sound, network, and visual (goop overlay) assets based on parameters, adds required tags, and triggers master-side initialization.
*   **Parameters:**
    *   `suffix` (string) – appended to `"quagmire_pot"` to form the prefab name (e.g., `""`, `"_small"`, `"_syrup"`).
    *   `goop_suffix` (string) – used to locate the goop symbol in the hanger animation for visual variation.
    *   `numslots` (number) – determines the UI texture variant (`quagmire_ui_pot_1x[numslots]`) used for rendering.
    *   `tag` (string or nil) – optional additional tag to attach (e.g., `"quagmire_syrup_cooker"`).
*   **Returns:** `Prefab` – a ready-to-register prefab object.
*   **Error states:** None identified.

## Events & listeners
None identified.