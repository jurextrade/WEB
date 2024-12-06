

  function VueApp_netprog (id) {
    let app = Vue.createApp({
        name: 'netprog_vue',
        data: function() {
            return {
                netprog_vue_manager : [],
            }
        },
        computed: {

        },        
        methods: {  

            getPanel : function (entity, name) {
                return netprog_panelfy(entity, name)
            },
            saveEntity: function(type, code, id) {
                var machine = interface_GetEntity (netprog_manager, type, 'Code', code);
                var site    = interface_GetEntity (netprog_manager, 'Sites', 'Name', machine.Site);
                interface_ArrayRemove (netprog_manager.Machines, machine);
                interface_ArrayRemove (site.Machines, machine);
                for (var i= 0; i < machine.Applications; i++) {
                    var application = interface_GetEntity (netprog_manager, 'Applications', 'Name', machine.Applications.Name);
                    interface_ArrayRemove (netprog_manager.Applications, application);
                }
                //$('#' + id).remove();
              //  $('[id="' + id + '"]').remove();

            },
            insertEntity : function (entity) {

            },
            toggleSidebar () {

            }
        },

        mounted() {
            this.netprog_vue_manager = netprog_manager;
            netprog_manager = this.netprog_vue_manager;
        },
        created() {
            console.log('created')
        },
        unmounted() {
            console.log('unmounted')
        },        
        updated() {
            console.log('updated')
        }
    })
    app.component ('sidebar', {
        props: ['toggle', 'cart', 'inventory'],
        computed : {

        },
        template : HTMLComponent(),
        methods: {

        }
    })
    app.component ('topbar', {
        props: [],
        computed : {

        },
//        template : BarPanel(),
        methods: {

        }
    })    
    app.mount('#' + id);

    return app;
}
