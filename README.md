# datepicker
> 日期选择控件，依赖jquery，代码简单，小巧，只提供最基本的功能，可以自己进行二次开发，自定义样式，保持更新。


### 演示
- 日期选择
[http://www.qinshenxue.com/demo/datepicker/index.html](http://www.qinshenxue.com/demo/datepicker/index.html)


### 配置

#### weekStart
- 类型：Number
- 默认：1（星期一）
- 解释：定义周从星期几开始
- 参数值：0（星期日）、1（星期一）、2、3、4、5、6

#### yearRange
- 类型：Array
- 默认：[-6,6]
- 解释：选择年份的跨度，[-6,6]即[当前年份-6,当前年份+6]
- 参数值：根据实际情况自定义
- 建议：宽度最好不要超过12，超过后会有滚动条出现
- 举例：如果当前年份为2016，那么[-6,6]即[2010,2022]，那么[0,10]即[2016,2026]

#### lang
- 类型：String
- 默认：zh_CN（中文）
- 解释：国际化语言包
- 参数值：可自己添加


### 示例
```html
<link rel="stylesheet" type="text/css" href="datepicker.min.css">
<script src="jquery.js"></script>
<script src="datepicker.min.js"></script>
<input type="text" id="test">
<script>
$('#test').datepicker();
</script>
```
### 效果
![](readme/demo.gif)

### 日志
2016-03-02
1、增加yearRange配置