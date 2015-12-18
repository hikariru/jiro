/// <reference path="../../typings/mithril/mithril.d.ts" />

class Jiro {
    name: _mithril.MithrilProperty<string>;
    location: _mithril.MithrilProperty<string>;
    business: _mithril.MithrilProperty<string[]>;
    closed: _mithril.MithrilProperty<string[]>;

    constructor(data: any) {
        this.name = m.prop(data["name"]);
        //this.business = m.prop(data.business);
        //this.closed = m.prop(data.closed);
    }
}

module vm {
    export var list: _mithril.MithrilProperty<Jiro[]>;
    export function init() {
        vm.list = m.prop([]);
        let jiroList = {
            "jiro": [
                {
                    "name": "三田本店",
                    "location": "〒108-0073 東京都港区三田2-16-3",
                    "business": ["8:30～15:00", "17:00～20:00"],
                    "closed": ["日曜", "祝日"]
                }
            ]
        };
        for (let i = 0; i < jiroList.jiro.length; i++) {
            console.log(`${i}: ${jiroList.jiro[i]}`);
            vm.list[i] = new Jiro(jiroList.jiro[i])
        }
    }
}

let jiroApp = {
    controller: function() {
        vm.init();
    },
    view: function(controller) {
        return m('ul', vm.list().map(function (jiro: Jiro) {
            return m("li", jiro.name)
        }));
    }
};

m.mount(document.getElementById('root'), jiroApp);