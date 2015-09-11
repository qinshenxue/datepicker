/**
 * 2015/9/1
 * qinshenxue
 */

(function ($) {
    var dom = '<div class="datepicker" id="datepicker">\
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
                                    <li data-month="1">&ensp;1月</li>\
                                    <li data-month="2">&ensp;2月</li>\
                                    <li data-month="3">&ensp;3月</li>\
                                    <li data-month="4">&ensp;4月</li>\
                                    <li data-month="5">&ensp;5月</li>\
                                    <li data-month="6">&ensp;6月</li>\
                                    <li data-month="7">&ensp;7月</li>\
                                    <li data-month="8">&ensp;8月</li>\
                                    <li data-month="9">&ensp;9月</li>\
                                    <li data-month="10">10月</li>\
                                    <li data-month="11">11月</li>\
                                    <li data-month="12">12月</li>\
                                </ul>\
                            </div>\
                        </div>\
                    <table class="body">\
                        <thead>\
                            <tr>\
                                <td class="cell week-cell">一</td>\
                                <td class="cell week-cell">二</td>\
                                <td class="cell week-cell">三</td>\
                                <td class="cell week-cell">四</td>\
                                <td class="cell week-cell">五</td>\
                                <td class="cell week-cell">六</td>\
                                <td class="cell week-cell">日</td>\
                            </tr>\
                        </thead>\
                        <tbody>\
                        </tbody>\
                    </table>\
                    <div class="bottom">\
                        <div class="btn-clear">清空</div>\
                    </div>\
            </div>';

    dom = dom.replace('{{yearRange}}', getYearRange());

    var $datepicker = $(dom).appendTo(document.body);

    $datepicker.on('click', '.datepicker-select', function () {
        var option = $(this).find('.datepicker-select-option');
        if (option.is(':hidden')) {
            option.show();
        } else {
            option.hide();
        }

    }).on('click', '.datepicker-select-option li', function () {
        // 点击选择年份
        var year = $(this).data('year') || $('.datepicker-select-year .datepicker-select-selected').data('year');
        var month = $(this).data('month') || $('.datepicker-select-month .datepicker-select-selected').data('month');
        getDatesOfMonth(year, month);

    }).on('mouseleave', '.datepicker-select', function () {
        // 鼠标移出年份，月份选择区域
        $(this).find('.datepicker-select-option').hide();

    }).on('click', '.curr-month,.prev-month,.next-month', function () {
        // 鼠标移出年份，月份选择区域
        $datepicker.find('.selected').removeClass('selected');
        $(this).addClass('selected');
        var value = $(this).data('value');
        var arr = value.split('-');
        $datepicker._value = {
            year: arr[0] - 0,
            month: arr[1] - 0,
            day: arr[2] - 0
        };
        $datepicker._bind.val(value);
        $datepicker.hide();

    }).on('click', '.btn-clear', function () {
        // 确定选择
        $datepicker._bind.val('');
        $datepicker.hide();
    });


    $(document).on('mouseup', function (e) {
        var target = $(e.target);
        if ($datepicker._instance) {
            if (target.closest('.datepicker').length == 0 && !target.is($datepicker._bind)) {
                $datepicker.hide();
            }
        }
    });

    function getDatesOfMonth(year, month) {
        var dates = [];
        // 初始化为month第一天的日期
        var date = new Date(year, month - 1, 1);
        var day = date.getDay();
        if (day == 0) {
            day = 7;
        }

        // 当月第一天不是星期一才会显示上月的部分日期
        if (day > 1) {
            // 上月最后一天
            date = new Date(year, month - 1, 0);
            var prevDate = date.getDate();
            for (var i = day - 2; i >= 0; i--) {
                dates.push({
                    'value': formatDate(date.getFullYear(), date.getMonth() + 1, prevDate - i),
                    'date': prevDate - i,
                    'class': 'prev-month'
                });
            }
        }

        date = new Date(year, month, 0);
        for (var i = 1, j = date.getDate(); i <= j; i++) {
            dates.push({
                'value': formatDate(year, month, i),
                'date': i,
                'class': 'curr-month'
            });
        }

        // 对于$datepicker选中的日期要增加选中的样式
        if ($datepicker._value.year == year && $datepicker._value.month == month) {
            dates[day + $datepicker._value.day - 2]['class'] += ' selected';
        }

        // 上月日期总数+当月日期总数之和不为7的倍数才会显示下月的部分日期
        if (dates.length % 7 > 0) {
            date = new Date(year, month, 1);
            for (var i = 1, j = 7 - dates.length % 7; i <= j; i++) {
                dates.push({
                    'value': formatDate(date.getFullYear(), date.getMonth() + 1, i),
                    'date': i,
                    'class': 'next-month'
                });
            }
        }
        $datepicker.find('.datepicker-select-year .datepicker-select-selected').data('year', year).text(year + '年');
        $datepicker.find('.datepicker-select-month .datepicker-select-selected').data('month', month).text(month + '月');
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

    function getYearRange() {
        var n = new Date();
        var y = n.getFullYear() - 5;
        var html = [];
        for (var i = 0; i < 12; i++) {
            html.push('<li data-year="' + (y + i) + '">' + (y + i) + '年</li>');
        }
        return html.join('');
    }

    function formatDate(year, month, day) {
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
    }

    $.fn.datepicker = function () {
        var ele = $(this);
        $datepicker._instance = true;
        ele.on({
            focus: function (e) {
                var me = $(this);
                var pos = me.offset();
                $datepicker.css({
                    top: pos.top + me.outerHeight(),
                    left: pos.left
                });
                var v = ele.val();
                var arr = [];
                if (v == '') {
                    var now = new Date();
                    arr = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
                } else {
                    arr = v.split('-');
                }
                $datepicker._bind = ele;
                $datepicker._value = {
                    year: arr[0] - 0,
                    month: arr[1] - 0,
                    day: arr[2] - 0
                };
                getDatesOfMonth(arr[0] - 0, arr[1] - 0);
                $datepicker.show();
            }
        });
    };
})(jQuery);

