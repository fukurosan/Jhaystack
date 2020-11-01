# Advanced Search

## Advanced Queries (and / or)
Instead of inventing a proprietary query language that the developer has to learn, Jhaystack allows you to create advanced queries by providing them as comparison strategy functions.

Your comparison strategy functions can both contain any necessary and/or logic through simple if statements, while still leveraging built in comparison strategies of Jhaystack like bitap.

## Searching for Properties

## Speed, speed, speed
Online searches will simply never be as fast as offline searches. There are however things you can do to help Jhaystack perform better.

Here is a checklist:
- Do you only need x amount of results? Set a result limit. This means Jhaystack can stop searching as soon as he has found enough matches.
- Are you looking for values that follow a certain pattern? Like email addresses? Use a pattern strategy. This means Jhaystack only has to search through a smaller selection of values.
- Do you really need weighted properties? If not, don't use the feature. It will result in a slightly lower performance.
- Do you have multiple comparison strategies, but they are all "worth" the same? Provide them as one combined custom strategy. This will mean the dataset will not have to be traversed multiple times.