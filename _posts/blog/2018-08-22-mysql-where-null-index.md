---
layout: blog_contents
title: Mysql where 使用索引相关备注
categories: blog
---

以下结论在`MariaDB 10.2.16`下验证：

1. 当字段`COLUMN_NAME`是索引，且可为`NULL`时，在`where` 语句中使用`COLUMN_NAME IS NULL`，将会使用索引；`COLUMN_NAME IS NOT NULL`任何情况下都不会使用索引
2. 当字段不可为`NULL`时，`COLUMN_NAME IS NULL`与`COLUMN_NAME IS NOT NULL`任何情况下都不会使用索引
3. 当`COLUMN_NAME`字段为索引时，在`where`语句中`COLUMN_NAME = ''`和`COLUMN_NAME != ''`均不会使用索引；`COLUMN_NAME > ''`将会使用索引
4. 当`COLUMN_NAME`字段为索引，且可为`NULL`时，`COLUMN_NAME IS NULL OR COLUMN_NAME = ''`将不会使用索引
5. 字段为数字索引时， `COLUMN_NAME != 1`和`COLUMN_NAME<>1`效果相同
6. 当`COLUMN_NAME`字段为索引，可为`NULL`时，`COLUMN_NAME IS NOT NULL OR COLUMN_NAME >0`将不会使用索引,`OR`条件顺序不影响效果，都不使用索引
7. 当`COLUMN_NAME`字段为索引时，`COLUMN_NAME >0 OR != ''`时，将会使用索引使用
