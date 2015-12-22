/// <reference path="../../typings/tsd.d.ts" />

class Jiro {
    name: _mithril.MithrilProperty<string>;
    location: _mithril.MithrilProperty<string>;
    business: _mithril.MithrilProperty<string[]>;
    closed: _mithril.MithrilProperty<string[]>;

    constructor(data: any) {
        this.name = m.prop(data.name);
        this.location = m.prop(data.location);
        this.business = m.prop(data.business);
        this.closed = m.prop(data.closed);
    }
}

class Filter {
    open: _mithril.MithrilProperty<boolean>;
    value: _mithril.MithrilProperty<string>;

    constructor() {
        this.open = m.prop(false);
        this.value = m.prop("");
    }
}

module vm {
    import Dictionary = _.Dictionary;
    import List = _.List;
    export let list: _mithril.MithrilProperty<Jiro[]>;
    export var listForDisplay: _mithril.MithrilProperty<Jiro[]>;
    export var filter: _mithril.MithrilProperty<Filter>;
    export function init() {
        let list = [];
        vm.listForDisplay = m.prop([]);
        vm.filter = m.prop(new Filter());
        m.request({
            method: 'GET',
            background: true,
            url: 'client/json/jiro.json',
            initialValue: [],
        }).then(function (data: any[]) {
            m.startComputation();
            data.forEach(function(value) {
               list.push(new Jiro(value))
            });
            vm.listForDisplay = m.prop(_.map(list, _.clone));
            m.endComputation();
        });
    }
    export function search() {
        //let originalList = <List><any> vm.list();
        //filteredList = _.filter(originalList, function() {
        //    !_.contains(this.closed(), "日曜");
        //});
        //
        //m.startComputation();
        //_.each(filteredList, function() {
        //    vm.listForDisplay().push(new Jiro(this));
        //});
        //m.endComputation();
    }
}

let jiroApp = {
    controller: function() {
        vm.init();
    },
    view: function() {
        return m('div', [
            m('div', [
                m('label', [
                    '今日営業している店舗',
                    m('input[type=checkbox]', {onclick: m.withAttr('checked', vm.search), checked: vm.filter().open()})
                ])
            ]),
            m('dl', vm.listForDisplay().map(function (jiro: Jiro) {
            return [
                m('dt', jiro.name()),
                m('dd', [
                    '場所: ',
                    m(`a[href='http://maps.google.co.jp/maps?hl=ja&ie=UTF8&q=${jiro.location()}']`, jiro.location())
                ]),
                m('dd', `開店時間: ${jiro.business().join(', ')}`),
                m('dd', `休業日: ${jiro.closed().join(', ')}`)
            ];
            })
        )]);
    }
};

m.mount(document.getElementById('root'), jiroApp);