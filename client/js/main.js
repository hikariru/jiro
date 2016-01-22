var Jiro = (function () {
    function Jiro(data) {
        this.name = m.prop(data.name);
        this.location = m.prop(data.location);
        this.business = m.prop(data.business);
        this.closed = m.prop(data.closed);
    }
    return Jiro;
})();
var Filter = (function () {
    function Filter() {
        this.open = m.prop(false);
        this.value = m.prop("");
    }
    return Filter;
})();
var vm;
(function (vm) {
    function init() {
        var list = [];
        vm.list = m.prop([]);
        vm.listForDisplay = m.prop([]);
        vm.filter = m.prop(new Filter());
        m.request({
            method: 'GET',
            background: true,
            url: 'client/json/jiro.json',
            initialValue: [],
        }).then(function (data) {
            m.startComputation();
            data.forEach(function (value) {
                list.push(new Jiro(value));
            });
            vm.list = m.prop(_.map(list, _.clone));
            vm.listForDisplay = vm.list;
            m.endComputation();
        });
    }
    vm.init = init;
    function search() {
        var originalList;
        originalList = vm.list();
        var filteredList;
        filteredList = _.filter(originalList, function (item) {
            return !_.contains(item.closed(), "日曜");
        });
        m.startComputation();
        vm.listForDisplay = m.prop([]);
        _.each(filteredList, function (item) {
            vm.listForDisplay().push(item);
        });
        m.endComputation();
    }
    vm.search = search;
})(vm || (vm = {}));
var jiroApp = {
    controller: function () {
        vm.init();
    },
    view: function () {
        return m('div', [
            m('div', [
                m('label', [
                    '今日営業している店舗',
                    m('input[type=checkbox]', { onclick: m.withAttr('checked', vm.search), checked: vm.filter().open() })
                ])
            ]),
            m('dl', vm.listForDisplay().map(function (jiro) {
                return [
                    m('dt', jiro.name()),
                    m('dd', [
                        '場所: ',
                        m("a[href='http://maps.google.co.jp/maps?hl=ja&ie=UTF8&q=" + jiro.location() + "']", jiro.location())
                    ]),
                    m('dd', "\u958B\u5E97\u6642\u9593: " + jiro.business().join(', ')),
                    m('dd', "\u4F11\u696D\u65E5: " + jiro.closed().join(', '))
                ];
            }))]);
    }
};
m.mount(document.getElementById('root'), jiroApp);
