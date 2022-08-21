# A variant of [json-tree-view-vue3](https://github.com/seijikohara/json-tree-view-vue3) with icons

This is just a little rewrite of the library, because i needed a simple typescript vue tree component without all the hasle of many that i have tried.

My use case was different from displaying a json string, so i added some little features. The spirit of the changes seem to not be the same as the original project so i just put here and didn't make any pull request to it.

There is no intention in turning this in a maintained project. Anyone is welcome to copy or fork it to do whatever they want. Just remember to aknowledge the original author of json-tree-view-vue3.

## Changes

For the whole documentation go to [json-tree-view-vue3](https://github.com/seijikohara/json-tree-view-vue3)

I updated most of the dependencies. But most of the rest of the code is the same beside some added props. Even the package.json name, author, ... :)

I maintained this as the simplest possible features. It it more to show how to do it than a whole library. Many more changes would have to be made and they would have to depend on the use case. 

I changed the code to use `<script setup`, since i am taking this chance to try to learn a little on how to use Vue.

This repo is a vue project with an included example of the changes. So it will be easy to check how to use it.

New JsonTreeView added component props:

- `:folderFlag: boolean` - For the component to display folder and files icons for respectivelly array and obects

- `arrayKey: string` - In the case of arrays, the component will use the index as the "key". If it is an array of objects, `arrayKey` will be what object property to display instead.

- `@toggleOpen: ()=>any` - An 'event listener' to check when an array of object was toggled open or close.


