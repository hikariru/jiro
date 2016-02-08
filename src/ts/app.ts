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
    import List = _.List;
    export let list: _mithril.MithrilProperty<Jiro[]>;
    export var listForDisplay: _mithril.MithrilProperty<Jiro[]>;
    export var filter: _mithril.MithrilProperty<Filter>;
    export function init() {
        let list = [];
        vm.list = m.prop([]);
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
            vm.list = m.prop(_.map(list, _.clone));
            vm.listForDisplay = vm.list;
            m.endComputation();
        });
    }
    export function search(open) {
        if (!open) {
            vm.listForDisplay = m.prop(vm.list());
            return
        }

        let originalList : List<Jiro>;
        originalList = vm.list();

        var filteredList : List<Jiro>;
        filteredList=_.filter(originalList, function(item: Jiro) {
            return !_.contains(item.closed(), "日曜");
        });

        m.startComputation();
        vm.listForDisplay = m.prop([]);
        _.each(filteredList, function(item: Jiro) {
            vm.listForDisplay().push(item);
        });
        m.endComputation();
    }
}

let jiroApp = {
    controller: function() {
        vm.init();
    },
    view: function() {
        let openedCheckbox = m('div', [
                m('label', [
                    '今日営業している店舗: ',
                    m('input[type=checkbox]', {onclick: m.withAttr('checked', vm.search.bind(vm.filter().open())), value: vm.filter().open(), checked: vm.filter().open()})
                ])
            ]);

        let searchBox = m('div', [
           m('label', [
               '検索: ',
               m('input[type=text')
           ])
        ]);

        let jiroList = m('div', [
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

        return [openedCheckbox, searchBox, jiroList]
    }
};

m.mount(document.getElementById('root'), jiroApp);