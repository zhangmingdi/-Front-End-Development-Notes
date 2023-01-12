### 常见的属性
 + 生命周期
   - Expires
   - Max-Age
 + 限制访问Cookie
   - Secure：限制
   - HttpOnly：防止xss攻击，禁止脚本访问cookie
 + 作用域
   - Domain：指定了哪些主机可以接受 Cookie，默认为 origin，如果指定了Domain，则一般包含子域名。例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在子域名中（如developer.mozilla.org）
   - path：指定了主机下的哪些路径可以接受 Cookie
 + samesite：规定什么情况下才能跨站使用cookie
   - Strict：禁止跨站
   - Lax：表单get请求、预加载、连接挑战是可以的
   - None：允许跨站携带cookie，同时得搭配设置Secure属性
### 跨站的含义
 + 二级域名相同，但是不属于同一个网站，your-project.github.io与my-project.github.io二级域名相同，且属于不同网站，那么就是前者网站上请求后者就属于跨站

总结：一般而言，对于业务来说是建议设置SameSite属性值为Lax的，因为Strict太影响用户体验。

Lax对GET请求是放行的，因此整改的重点在于要严格区分GET和POST的职责，即GET只能进行一些查询类或导航类的访问、而不是进行状态更改，要执行一些更改类的表单操作就必须交由POST来处理，在这种场景下Lax的设置才会将风险降到较低。
 + Cookie的SameSite属性设置为Lax的GET请求还是会被攻击者利用进行CSRF攻击，且GET型CSRF攻击难度低