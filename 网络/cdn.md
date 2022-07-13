
### 比较好的解释
<https://juejin.cn/post/6844903873518239752>

### cdn简介
+ 源站内容发布全国节点
+ 将源站请求导向最近对缓存节点
+ 提高网站响应速度

### 首先先了解域名解析过程
+ 本地hosts文件->hosts缓存->本地DNS->根DNS->顶级域DNS->权威DNS
### dns记录类型
#### 4种字段构成一个记录，Name、Value、Type、TTL。其中Name和Value可以理解为一对键值对，但是其具体含义取决于Type的类型，TTL记录了该条记录应当从缓存中删除的时间。

+ A记录，域名name指向的value就是目标IP地址。
+ NS记录，域名name指向的value是解析该域名DNS服务的IP地址。
+ CNAME记录，域名name指向的value是另一个域名，另一个域名被A类型记录，其name对应的value最终指向的是目标IP。

### cdn服务的DNS解析
+ 全局负载均衡系统（GSLB）：主要功能是根据用户的本地DNS的IP地址判断用户的位置，筛选出距离用户较近的本地负载均衡系统（SLB）。
+ 本地负载均衡系统（SLB）：缓存服务器集群中是否包含用户请求的资源数据，如果缓存服务器中存在请求的资源，则根据缓存服务器集群中节点的健康程度、负载量、连接数等因素筛选出最优的缓存节点，并将HTTP请求重定向到最优的缓存节点上。

### cdn的大致过程
+ dns服务解析通过CNAME记录查找到全局负载均衡系统（GSLB)。
+ 全局负载均衡系统（GSLB)判断大概位置，寻找性能较好的靠近该地区的本地负载均衡系统（SLB）的IP。
+ 本地负载均衡系统（SLB）判断缓存服务集群是否存在请求资源，根据服务集群挑选性能较好的服务器，并将HTTP重定向至该服务器。
+ 该服务器判断是否存在缓存资源，无则向源服务器请求资源。
### 深入问负载均衡是什么？
+ 流量调度器，通过均衡算法，将流量均衡地发送到集群中的不同服务器
### 常见的均衡算法（如何）
<https://zhuanlan.zhihu.com/p/144974957>
换一种问法：随着流量大如何保证每台服务器能得到大致相等访问次数呢？
+ random随机法
+ 轮询访问
+ 轮询加权
``` java
/** 服务器列表 */
private static HashMap<String, Integer> serverMap = new HashMap<>();
static {
    serverMap.put("192.168.1.2", 2);
    serverMap.put("192.168.1.3", 2);
    serverMap.put("192.168.1.4", 2);
    serverMap.put("192.168.1.5", 4);
}
private static Integer index = 0;

/**
 * 加权路由算法
 */
public static String oneByOneWithWeight() {
    List<String> tempList = new ArrayList();
    HashMap<String, Integer> tempMap = new HashMap<>();
    tempMap.putAll(serverMap);
    for (String key : serverMap.keySet()) {
        for (int i = 0; i < serverMap.get(key); i++) {
            tempList.add(key);
        }
    }
    synchronized (index) {
        index++;
        if (index == tempList.size()) {
            index = 0;
        }
        return tempList.get(index);
    }
}

```
加权轮询就是对权重多的服务器分配多点流量
+ 随机加权
``` java
  /** 服务器列表 */
private static HashMap<String, Integer> serverMap = new HashMap<>();
static {
    serverMap.put("192.168.1.2", 2);
    serverMap.put("192.168.1.3", 2);
    serverMap.put("192.168.1.4", 2);
    serverMap.put("192.168.1.5", 4);
}
/**
 * 加权路由算法
 */
public static String randomWithWeight() {
    List<String> tempList = new ArrayList();
    HashMap<String, Integer> tempMap = new HashMap<>();
    tempMap.putAll(serverMap);
    for (String key : serverMap.keySet()) {
        for (int i = 0; i < serverMap.get(key); i++) {
            tempList.add(key);
        }
    }
    int randomInt = new Random().nextInt(tempList.size());
    return tempList.get(randomInt);
}
```
随机加权的方式和轮询加权的方式大致相同，只是把使用互斥锁轮询的方式换成了随机访问，按照概率论来说，访问量增多时，服务访问也会达到负载均衡

+ IP-hash算法
``` java

/**
 * ip hash 路由算法 保证同个用户的多个请求能打到同个服务器
 */
public static String ipHash(String ip) {
    // 复制遍历用的集合，防止操作中集合有变更
    List<String> tempList = new ArrayList<>(serverList.size());
    tempList.addAll(serverList);
    // 哈希计算请求的服务器
    int index = ip.hashCode() % serverList.size();
    return tempList.get(Math.abs(index));
}
```
 ip hash路由算法,保证同个用户的多个请求能打到同个服务器。


 + 最小连接数算法
 最少连接数均衡:客户端的每一次请求服务在服务器停留的时间可能会有较大的差异，随着工作时间加长，如果采用简单的轮询或随机均衡算法，每一台服务器上的连接进程可能会产生极大的不同，并没有达到真正的负载均衡。最少连接数均衡算法对内部需负载的每一台服务器都有一个数据记录，记录当前该服务器正在处理的连接数量，当有新的服务连接请求时，将把当前请求分配给连接数最少的服务器，使均衡更加符合实际隋况，负载更加均衡。