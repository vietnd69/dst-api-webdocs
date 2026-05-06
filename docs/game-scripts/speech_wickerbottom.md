---
id: speech_wickerbottom
title: Speech Wickerbottom
description: Provides speech dialogue data and definitions for the Wickerbottom character, used for contextual book-related interactions in DST.
tags: [speech, character, dialogue, wickerbottom]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: data_patched
category_type: root
source_hash: 35b7d9d7
system_scope: player

---

# Speech Wickerbottom

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Speech Wickerbottom is a data-only component that defines the dialogue tables and speech definitions used by the Wickerbottom character during book-related interactions. It contains static lookup structures (e.g., `DECIDUOUSTREE`, `ENDTABLE`) used to map events or context to specific speech lines, but contains no executable logic, event listeners, or runtime behavior—its purpose is purely to provide content for speech-triggering systems elsewhere in the codebase.

## Usage example
This component does not expose callable functions or runtime APIs. It is loaded and consumed internally by the game’s speech/dialgue system. Modders seeking to modify Wickerbottom’s speech must override or extend its data tables in their own mod’s prefabs or `modmain.lua` (e.g., by patching ` TheSim:GetModConfigData("speech_wickerbottom")`-style references), but cannot directly invoke or interact with this component via `inst:AddComponent()`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| DECIDUOUSTREE | table | (static data) | Dictionary of speech branches keyed by event or condition for deciduous tree-related speech. |
| ENDTABLE | table | (static data) | Terminal/narrative-end speech entries, likely used after long reads or specific book completions. |

## Main functions
No executable functions defined.

## Events & listeners
No events defined.