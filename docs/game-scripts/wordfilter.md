---
id: wordfilter
title: Wordfilter
description: Contains a curated list of profane or inappropriate strings for use in filtering user-generated content.
tags: [network, text, filtering]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 182aa3c2
system_scope: network
---

# Wordfilter

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `wordfilter` table is a static data module that defines blocked strings used to sanitize user input, such as player names or chat messages. It contains two filtering mechanisms: `exact_match`, a hash-based lookup for precise matches, and `loose_match`, an array of substrings used for partial/proxy-based detection. This module is not an Entity Component System component and does not expose methods or properties at runtime — it serves as a configuration resource for higher-level filtering logic elsewhere in the codebase.

## Usage example
This module is not directly instantiated or used as a component. Instead, it is typically imported and referenced by filtering utilities (e.g., `profanityfilter.lua` or similar), for example:
```lua
local wordfilter = require "wordfilter"

local function IsNameValid(name)
    for _, pattern in ipairs(wordfilter.loose_match) do
        if name:find(pattern, 1, true) then
            return false
        end
    end
    -- Additional logic using wordfilter.exact_match hashes would follow
    return true
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This is a plain Lua table returned by `require("wordfilter")`.

## Main functions
Not applicable — this module exposes no functions.

## Events & listeners
Not applicable — this module does not participate in the event system.