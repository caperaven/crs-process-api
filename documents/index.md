# Introduction

To get started you need to load the index file of crs-process-api.  
Once you have done that the global api becomes available.  
There are two entry points for usage.

1. intent - crs.intent
2. process - crs.process

## Intent
This is an object literal that enables features for process processing.  
See the extension section for more details.

## Process 
This is the main entry point for executing intent.  
There are two functions to take note of.

1. run - ren a process defined according to the process structure
2. runStep - run a single process step

### run

The run function has two parameters: 

1. context - item referenced by @context
1. process - process definition

### runStep

1. step     - step definition 
1. context  - item referenced by @context statements in process definitions
1. process  - item referenced by @process
1. item     - item referenced by @item

for the most part item is set during loop operations representing the current item in the loop
