---
id: guitartab_dsmaintheme
title: Guitartab Dsmaintheme
description: Defines a guitar tablature representation for the main theme's musical notation used in DST's guitar UI.
tags: [audio, ui, music]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2859d5ac
system_scope: audio
---

# Guitartab Dsmaintheme

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`guitartab_dsmaintheme` is a data-only module that exports structured guitar tablature information for the main theme song. It is referenced by the guitar tab UI system and does not implement any logic itself. The data includes standard E2-A2-D3-G3-B3-E4 tuning frequencies, a transposition offset, a tablature matrix representing note positions on strings, and a spacing multiplier for rendering.

## Usage example
```lua
local main_theme = require "guitartab_dsmaintheme"
local tuning = main_theme.tuning          -- {29, 34, 39, 44, 48, 53}
local tab = main_theme.tab                -- Table of tablature rows
local spacing = main_theme.spacing_multiplier  -- 2.25
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tuning` | table of numbers | `{29, 34, 39, 44, 48, 53}` | Frequency indices for standard guitar tuning (E2, A2, D3, G3, B3, E4). |
| `transposition` | number | `8` | Semitone transposition offset applied to the tablature. |
| `tab` | table of tables | See source | Two-dimensional tablature data: each sub-table represents a staff line with per-string note indices (or `m` for muted/rest). |
| `spacing_multiplier` | number | `2.25` | Horizontal spacing factor used to render the tablature in the UI. |

## Main functions
This module is data-only; no functional methods are exported.

## Events & listeners
None identified