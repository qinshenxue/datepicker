# datepicker
日期选择控件，依赖jquery，代码简单，小巧，只提供最基本的功能，可以自己进行二次开发，自定义样式，保持更新。
### 需求
1. 点击输入框显示选择日期界面，点击具体日期确认选择，界面隐藏
2. 支持ie8+
3. 提供基本功能，减少配置项，方便在源码上进行二次开发

### 设计
1. 基于jQuery
2. 多个日期选择只初始化一次日期选择的dom结构

### 示例
```html
<link rel="stylesheet" type="text/css" href="datepicker.css">
<script src="jquery.js"></script>
<script src="datepicker.js"></script>
<input type="text" id="test">
<script>
$('#test').datepicker();
</script>
```
### 效果
![](readme/api-datepicker-1.gif)
