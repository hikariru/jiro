var Jiro = (function () {
    function Jiro(data) {
        this.name = m.prop(data.name);
        this.location = m.prop(data.location);
        this.business = m.prop(data.business);
        this.closed = m.prop(data.closed);
    }
    return Jiro;
})();
var vm;
(function (vm) {
    function init() {
        vm.list = m.prop([]);
        m.request({
            method: 'GET',
            background: true,
            url: 'client/json/jiro.json',
            initialValue: [],
        }).then(function (data) {
            m.startComputation();
            data.forEach(function (value) {
                vm.list().push(new Jiro(value));
            });
            m.endComputation();
        });
    }
    vm.init = init;
})(vm || (vm = {}));
var jiroApp = {
    controller: function () {
        vm.init();
    },
    view: function () {
        return m('dl', vm.list().map(function (jiro) {
            return [
                m('dt', jiro.name()),
                m('dd', [
                    '場所: ',
                    m("a[href='http://maps.google.co.jp/maps?hl=ja&ie=UTF8&q=" + jiro.location() + "']", jiro.location())
                ]),
                m('dd', "\u958B\u5E97\u6642\u9593: " + jiro.business().join(', ')),
                m('dd', "\u4F11\u696D\u65E5: " + jiro.closed().join(', '))
            ];
        }));
    }
};
m.mount(document.getElementById('root'), jiroApp);
