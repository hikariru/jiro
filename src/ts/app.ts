/// <reference path="../../typings/mithril/mithril.d.ts" />

class Jiro {
    name: _mithril.MithrilProperty<string>;
    location: _mithril.MithrilProperty<string>;
    business: _mithril.MithrilProperty<string[]>;
    closed: _mithril.MithrilProperty<string[]>;

    constructor(data: any) {
        this.name = m.prop(data.name);
        this.business = m.prop(data.business);
        this.closed = m.prop(data.closed);
    }
}

module vm {
    export var list: _mithril.MithrilProperty<Jiro[]>;
    export function init() {
        vm.list = m.prop([]);
        m.request({
            method: 'GET',
            background: true,
            url: 'client/json/jiro.json',
            initialValue: [],
        }).then(function (data: any[]) {
            m.startComputation();
            data.forEach(function(value) {
               vm.list().push(new Jiro(value));
            });
            m.endComputation();
        });
    }
}

let jiroApp = {
    controller: function() {
        vm.init();
    },
    view: function() {
        return m('dl', vm.list().map(function (jiro: Jiro) {
            return [
                m('dt', jiro.name()),
                m('dd', `開店時間: ${jiro.business().join(', ')}`),
                m('dd', `休業日: ${jiro.closed().join(', ')}`)
            ];
        }));
    }
};

m.mount(document.getElementById('root'), jiroApp);