---
layout: blog_contents
title: 阴阳师亚服PC版配置记录
categories: blog
---

国内因为无法访问Facebook，所以在无翻墙工具的情况下无法使用阴阳师PC版本。
1、获取一个翻墙工具，VPN或其他代理
2、下载Facebook Gameroom
3、安装 陰陽師Onmyoji
4、为了防止VPN掉线影响游戏流畅度，需要配置路由让游戏绕开VPN，直接连接，VPN主要是为了连接Facebook
5、配置方法如下，在windows中执行如下命令
```
route add 104.0.0.0 mask 255.0.0.0 10.0.0.1 metric 5 if 2 -p
route add 54.0.0.0 mask 255.0.0.0 10.0.0.1 metric 5 if 2 -p
route add 130.0.0.0 mask 255.0.0.0 10.0.0.1 metric 5 if 2 -p
route add 52.0.0.0 mask 255.0.0.0 10.0.0.1 metric 5 if 2 -p
route add 13.0.0.0 mask 255.0.0.0 10.0.0.1 metric 5 if 2 -p
```
上面命名中的`10.0.0.1`需要自行换成真实网关IP地址，就是本地路由器地址。如果是虚拟机需要换成虚拟机的网关地址

`metric 5` 为路由跃点数

`if 2`为接口ID，接口ID通过下面的命令获得：
```
route print -4
```
该命令会输出接口表，然后找到你的实际网卡，改成第一个数字
如果VPN程序自带防火墙，请关闭他，否在路由不会生效
