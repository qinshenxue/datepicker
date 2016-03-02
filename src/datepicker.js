(function ($) {
    function DatePicker(options) {

        var ele = $(this);
        var pos = ele.offset();

        var defaults = {
            weekStart: 1,
            yearRange: [-6, 7],
            language: 'zh_CN'
        };
        $.extend(defaults, options);
        var languagePack = DatePicker.language[defaults.language];

        var tpl = '<div class="datepicker" id="datepicker">\
                    <div class="top">\
                        <div class="datepicker-select datepicker-select-year">\
                            <div class="datepicker-select-selected"></div>\
                            <ul class="datepicker-select-option">\
                            {{yearRange}}\
                            </ul>\
                        </div>\
                        <div class="datepicker-select datepicker-select-month">\
                            <div class="datepicker-select-selected"></div>\
                                <ul class="datepicker-select-option">\
                                    <li data-month="1">&ensp;1</li>\
                                    <li data-month="7">&ensp;7</li>\
                                    <li data-month="2">&ensp;2</li>\
                                    <li data-month="8">&ensp;8</li>\
                                    <li data-month="3">&ensp;3</li>\
                                    <li data-month="9">&ensp;9</li>\
                                    <li data-month="4">&ensp;4</li>\
                                    <li data-month="10">10</li>\
                                    <li data-month="5">&ensp;5</li>\
                                    <li data-month="11">11</li>\
                                    <li data-month="6">&ensp;6</li>\
                                    <li data-month="12">12</li>\
                                </ul>\
                            </div>\
                        </div>\
                    <table class="body">\
                        <thead>\
                            <tr>\
                                {{weekHead}}\
                            </tr>\
                        </thead>\
                        <tbody>\
                        </tbody>\
                    </table>\
                    <div class="bottom">\
                        <div class="btn-clear">{{clearText}}</div>\
                    </div>\
            </div>';

        var tplData = {
            yearRange: function getYearRange() {
                var now = new Date();
                var startYear = now.getFullYear() + defaults.yearRange[0];
                var rangeSpan = defaults.yearRange[1] - defaults.yearRange[0];
                var rows = Math.ceil(rangeSpan / 2);
                var html = [];
                for (var i = 0; i < rows; i++) {
                    html.push('<li data-year="' + (startYear + i) + '">' + (startYear + i) + '</li>');
                    html.push('<li data-year="' + (startYear + i + rows) + '">' + (startYear + i + rows) + '</li>');
                }
                if (rangeSpan % 2 != 0) {
                    html.pop();
                }
                return html.join('');
            }(),
            weekHead: function getWeekHead() {
                var html = [];
                for (var i = defaults.weekStart; i < defaults.weekStart + 7; i++) {
                    html.push('<td class="cell week-cell">' + languagePack.week[i % 7] + '</td>');
                }
                return html.join('');
            }(),
            clearText: languagePack.clearText
        };

        tpl = tpl.replace(/\{\{(\w+)\}\}/g, function (m, c) {
            return tplData[c];
        });

        var $datepicker = $(tpl).appendTo(document.body);

        $datepicker.css({
            top: pos.top + ele.outerHeight(),
            left: pos.left
        }).on('click', '.datepicker-select', function () {
            var option = $(this).find('.datepicker-select-option');
            $(this).siblings('.datepicker-select').find('.datepicker-select-option').fadeOut(200);
            if (option.is(':hidden')) {
                option.fadeIn(100);
            } else {
                option.fadeOut(200);
            }

        }).on('click', '.datepicker-select-option li', function () {
            // 点击选择年份
            var year = $(this).data('year') || $datepicker.find('.datepicker-select-year .datepicker-select-selected').data('year');
            var month = $(this).data('month') || $datepicker.find('.datepicker-select-month .datepicker-select-selected').data('month');
            getDatesOfMonth(year, month);

        }).on('click', '.curr-month,.prev-month,.next-month', function () {
            // 鼠标移出年份，月份选择区域
            $datepicker.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            var value = $(this).data('value');
            ele.val(value);
            $datepicker.hide();

        }).on('click', '.btn-clear', function () {
            // 确定选择
            ele.val('');
            $datepicker.hide();
        });

        ele.on({
            focus: function (e) {
                var date = checkDate();
                getDatesOfMonth(date.year, date.month);
                $datepicker.find('.datepicker-select-option').hide();
                $datepicker.show();
            }
        });

        $(document).on('mousedown', function (e) {
            var target = $(e.target);
            if (target.closest('.datepicker').length == 0 && !target.is(ele)) {
                $datepicker.hide();
            }
        });

        function getDatesOfMonth(year, month) {
            var dates = [];
            // 初始化为month第一天的日期
            var date = new Date(year, month - 1, 1);
            var dayOfWeek = date.getDay();

            var lastMonthDays = 0;
            if (dayOfWeek != defaults.weekStart) {
                date.setDate(0);  // 上月最后一天
                var prevDate = date.getDate();
                var lastMonthDays = dayOfWeek - defaults.weekStart;
                if (lastMonthDays < 0) {
                    lastMonthDays += 7;
                }
                // -1是因为i可以等于0
                for (var i = lastMonthDays - 1; i >= 0; i--) {
                    dates.push({
                        'value': formatDate(date.getFullYear(), date.getMonth() + 1, prevDate - i),
                        'date': prevDate - i,
                        'class': 'prev-month'
                    });
                }
            }
            date.setFullYear(year, month, 0);

            for (var i = 1, j = date.getDate(); i <= j; i++) {
                dates.push({
                    'value': formatDate(date.getFullYear(), date.getMonth() + 1, i),
                    'date': i,
                    'class': 'curr-month'
                });
            }

            // 对于$datepicker选中的日期要增加选中的样式
            var selectedDate = checkDate();
            if (selectedDate.year == year && selectedDate.month == month) {
                // -1是数组下标从0开始
                dates[lastMonthDays + selectedDate.day - 1]['class'] += ' selected';
            }

            // 上月日期总数+当月日期总数之和不为7的倍数才会显示下月的部分日期
            if (dates.length % 7 > 0) {
                date.setFullYear(year, month, 1);
                for (var i = 1, j = 7 - dates.length % 7; i <= j; i++) {
                    dates.push({
                        'value': formatDate(date.getFullYear(), date.getMonth() + 1, i),
                        'date': i,
                        'class': 'next-month'
                    });
                }
            }
            $datepicker.find('.datepicker-select-year .datepicker-select-selected').data('year', year).text(year + languagePack.yearText);
            $datepicker.find('.datepicker-select-month .datepicker-select-selected').data('month', month).text(month + languagePack.monthText);
            $datepicker.find('.body tbody').html(getDatesDom(dates));
        }

        function getDatesDom(dates) {
            var dom = [];
            dom.push('<tr>');
            for (var i = 0, j = dates.length; i < j; i++) {
                dom.push('<td class="cell ' + dates[i]['class'] + '" data-value="' + dates[i]['value'] + '">' + dates[i]['date'] + '</td>');
                if ((i + 1) % 7 == 0 && i != j - 1) {
                    dom.push('</tr></tr>');
                }
            }
            dom.push('</tr>');
            return dom.join('');
        }

        function formatDate(year, month, day) {
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return year + '-' + month + '-' + day;
        }

        function checkDate() {
            var date = {};
            var v = ele.val();
            if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(v)) {
                var vArr = v.split('-');
                date = {
                    year: vArr[0] - 0,
                    month: vArr[1] - 0,
                    day: vArr[2] - 0
                };
            } else {
                var now = new Date();
                date = {
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                    day: now.getDate()
                };
            }
            return date;
        }

        return $datepicker;
    };
    DatePicker.language = {
        zh_CN: {
            yearText: '年',
            monthText: '月',
            clearText: '清除',
            week: ['日', '一', '二', '三', '四', '五', '六']
        }
    };

    $.fn.datepicker = DatePicker;
    $.fn.datepicker.language = DatePicker.language;
})(jQuery);

