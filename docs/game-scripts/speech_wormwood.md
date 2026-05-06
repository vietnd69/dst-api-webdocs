---
id: speech_wormwood
title: Speech Wormwood
description: Provides localization and speech-related functionality specific to the Wormwood character.
tags: [speech, localization, character]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: data_patched
category_type: root
source_hash: be9f38b1
system_scope: player
---

# Speech Wormwood

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file contains language and speech-related data and configurations specific to the Wormwood character, likely used for dynamic or context-sensitive dialogue, narration, or localization within the game. Based on the structure and naming convention, it complements the broader speech system (`speech.lua`) by offering Wormwood-specific overrides or extensions.

## Usage example
Wormwood's speech behavior is typically integrated at the character level via localization strings or speech event handlers defined in `prefabs/wormwood.lua` or similar. No public functions or components are directly exposed by this file; it serves as a data module for internal use by the speech subsystem.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| *Unnamed string table* | table | N/A | Contains key-value pairs where keys are speech identifiers and values are localized strings or speech templates for Wormwood. No properties are assigned to `self` or `inst`, indicating this is a top-level data table. |

## Main functions
No functions are defined in this file.

## Events & listeners
No events are listened to or pushed by this file.