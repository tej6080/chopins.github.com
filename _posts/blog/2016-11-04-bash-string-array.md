---
layout: blog_contents
title: Bash 脚本字符串与数组相关
categories: blog
---

__字符串分割成数组__
使用bash的`read`命令分割字符串方法
`IFS='.' read -r -a STR <<< 'this.needle.split.string'`

分割后得到`STR`数组:`(this needle split string)`  
`IFS`定义的是分割符号  
`${STR[@]`分割后的数组

__数组常用方法__

定义方法:`ARR1=(foo1 foo2 foo3 foo4 foo5)`,`ARR2=(1 2 3 4 5)`
数组个数：`${#ARR1[@]}`
数组输出全部：`${ARR1[@]}`
__数组元素访问__
获取数组一部分：`${ARR1[@]:N1:N2}`, 其中`N1`为开始索引，从0开始,返回值包括该元素,`N1`为获取长度,如果长度省略，将获取后续所有　　
以下为例子：　

* `${ARR1[@]:0:1}`　为　`(foo1)` 
* `(foo1 foo2)`是`${ARR1[@]:0:2}`  
* `(foo2 foo3 foo4 foo5)`为`${ARR1[@]:1}`  
* `(foo3 foo4)` 为　`${ARR1[@]:2:2}` 

__数组循环__

```
for item in ${ARR[@]};do
    echo $item
do
```

__运算__

```bash
N1=5
N2=6
RES1=$[1+2]
RES2=$[$N1+N2]
```
__相关解释__

* `$`符号为取变量值
* `(  )` 单小括号，需要新开子shell执行的命令组，命令组中定义的变量无法在脚本后面使用
* `(( ))`　双小括号，执行符合C语言的运算和表达式，输出结果为整数，表达式中变量可以不用加`$`符号,`((a=1+2));echo $a`,表达式无返回值
* `[ ]`　bash内部命令,`[`调用`test`命令，执行内部表达式，`]`退出并返回状态码，比较运算符只有`==`、`!=`，其只能用于字符串
* `[[ ]]` bash关键字，执行内部表达式，支持较多运算符
* `{ }`　命令组或扩展，执行的命令在本shell内
* `\`\`` 在子shell中执行命令


