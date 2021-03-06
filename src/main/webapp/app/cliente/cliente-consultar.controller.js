//-----------------------------------------------------
// CONTROLADOR CONSULTA
//-----------------------------------------------------
(function () {
    'use strict';

    // Adicionando um Controlador para a tela 'consultar' do modulo 'cliente'
    angular.module('cliente').controller(
            'ConsultarClienteController',
            ConsultarClienteController);

    // Definindo atributos e operacoes do Controlador da tela 'consultar' do modulo 'cliente'
    /* @ngInject */
    function ConsultarClienteController($controller, $scope, $state,
            ClienteData, MsgCenter) {

        //////// ATRIBUTOS DO CONTROLADOR ////////////////////
        var vm = this;

        vm.msgs = "";

        vm.filtros = {};
        vm.clientes = [];
        vm.cliente = {};
        
        // Paginação
        vm.totalresults = 0;
        vm.pagesize = 0;
        vm.currentpage = 0;
        vm.pageoptions = [10, 25, 50, 100];

        // Operacoes acessiveis no html
        vm.pesquisarLimpar = pesquisarLimpar;
        vm.pageSizeAlterado = pageSizeAlterado;
        vm.paginaAlterada = paginaAlterada;
        vm.limpar = limpar;
        vm.irParaTelaInclusao = irParaTelaInclusao;
        vm.irParaTelaDetalhamento = irParaTelaDetalhamento;
        vm.gerarRelatorioPDF = gerarRelatorioPDF;

        activate();

        //////// OPERACOES DO CONTROLADOR ////////////////////

        function activate() {
            //vm.deveRestaurar = FiltroService.deveRestaurar();
            //restaurarEstadoTela();
        	pesquisar();
        }
        
        function gerarRelatorioPDF(){
        	ClienteData.gerarRelatorioPDF().then(function (data) {
        		if (data.mensagens) {
                	MsgCenter.addMessages(data.mensagens);  
                }
        	});
        }

        function pesquisarLimpar() {
            vm.filtros.currentpage = 0;
            MsgCenter.clear();
            pesquisar();
        }

        function paginaAlterada() {
            vm.filtros.pagesize = vm.pagesize;
            vm.filtros.currentpage = vm.currentpage - 1;
            pesquisar();
        }

        function pageSizeAlterado() {
            vm.currentpage = 1;
            paginaAlterada();
        }

        function limpar() {
            $state.reload();
        }

        function irParaTelaDetalhamento(codCliente) {
            //salvarEstadoTela();			
            $state.go('clienteDetalhar', {
                'codCliente': codCliente
            });
        }

        function irParaTelaInclusao() {
            //salvarEstadoTela();
            $state.go('clienteEditar');
        }

        function salvarEstadoTela() {
            var devePesquisar = vm.clientes.length > 0;
            //FiltroService.salvarFiltros(vm.filtros, devePesquisar);
        }

        function restaurarEstadoTela() {
            /*if (FiltroService.deveRestaurar()) {
             vm.filtros = FiltroService.obterFiltros();
             
             if (FiltroService.devePesquisar()) {
             pesquisar();
             }
             FiltroService.marcarRestaurado();
             }*/
        }

        function pesquisar() {
        	MsgCenter.clear();
            var filtros = vm.filtros;

            ClienteData.listar(filtros).then(function (data) {
                vm.clientes = data.entidades;

                if (data.pagina) {
                    var page = data.pagina;
                    vm.currentpage = page.currentPage + 1;
                    vm.pagesize = page.pageSize;
                    vm.totalresults = page.totalResults;
                }
                if (data.mensagens) {
                	MsgCenter.addMessages(data.mensagens);  
                }
                
            });
        }
    }

})();

