var Jiro = (function () {
    function Jiro(data) {
        this.name = m.prop(data["name"]);
    }
    return Jiro;
})();
var vm;
(function (vm) {
    function init() {
        vm.list = m.prop([]);
        var jiroList = {
            "jiro": [
                {
                    "name": "三田本店",
                    "location": "〒108-0073 東京都港区三田2-16-3",
                    "business": ["8:30～15:00", "17:00～20:00"],
                    "closed": ["日曜", "祝日"]
                }
            ]
        };
        for (var i = 0; i < jiroList.jiro.length; i++) {
            console.log(i + ": " + jiroList.jiro[i]);
            vm.list[i] = new Jiro(jiroList.jiro[i]);
        }
    }
    vm.init = init;
})(vm || (vm = {}));
var jiroApp = {
    controller: function () {
        vm.init();
    },
    view: function (controller) {
        return m('ul', vm.list().map(function (jiro) {
            return m("li", jiro.name);
        }));
    }
};
m.mount(document.getElementById('root'), jiroApp);
