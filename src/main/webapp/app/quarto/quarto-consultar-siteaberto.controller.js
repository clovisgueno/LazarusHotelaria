//-----------------------------------------------------
// CONTROLADOR CONSULTA
//-----------------------------------------------------
(function() {
	'use strict';

	// Adicionando um Controlador para a tela 'consultar' do modulo 'quarto'
	angular.module('quarto').controller('ConsultarQuartoSiteAbertoController',
			ConsultarQuartoSiteAbertoController);

	// Definindo atributos e operacoes do Controlador da tela 'consultar' do
	// modulo 'quarto'
	/* @ngInject */
	function ConsultarQuartoSiteAbertoController($controller, $scope, $state, $stateParams, QuartoData,
			MsgCenter, FiltroService, FilialData, FotoData) {

		
		// ////// ATRIBUTOS DO CONTROLADOR ////////////////////
		var vm = this;

		vm.msgs = "";

		vm.popupDataEntrada = {
			opened : false,
		};

		vm.popupDataSaida = {
			opened : false
		};

		vm.openDataEntrada = openDataEntrada;
		vm.openDataSaida = openDataSaida;
		
		vm.filtros = {};
		vm.quartos = [];
		vm.quarto = {};
		
		vm.filtros.codFilial = $stateParams.codFilial;
		vm.filtros.dataEntrada = $stateParams.dataEntrada;
		vm.filtros.dataSaida = $stateParams.dataSaida;

		// Paginação
		vm.totalresults = 0;
		vm.pagesize = 0;
		vm.currentpage = 0;
		vm.pageoptions = [ 10, 25, 50, 100 ];

		// Operacoes acessiveis no html
		vm.pesquisarLimpar = pesquisarLimpar;
		vm.pageSizeAlterado = pageSizeAlterado;
		vm.paginaAlterada = paginaAlterada;
		vm.limpar = limpar;
		vm.irParaTelaInclusao = irParaTelaInclusao;
		vm.irParaTelaDetalhamento = irParaTelaDetalhamento;
		vm.carregarFiliais = carregarFiliais;
		vm.carregarFilial = carregarFilial;
		vm.pesquisarQuartosSemReserva = pesquisarQuartosSemReserva;
		vm.solicitarReserva = solicitarReserva;
		

		activate();

		// ////// OPERACOES DO CONTROLADOR ////////////////////
		
		function openDataEntrada() {
			vm.popupDataEntrada.opened = true;
		}

		function openDataSaida() {
			vm.popupDataSaida.opened = true;
		}

		function activate() {
			vm.deveRestaurar = FiltroService.deveRestaurar();
			
			restaurarEstadoTela();
			carregarFiliais();
			carregarFilial();
			
			if(preencheuFiltrosObrigatorioParaPesquisa()){
				pesquisarQuartosSemReserva();
			}
		}
		
		
		function preencheuFiltrosObrigatorioParaPesquisa(){
			if(vm.filtros.codFilial == undefined || vm.filtros.codFilial == ''){
				return false;
			}
			if(vm.filtros.dataEntrada == undefined || vm.filtros.dataEntrada == ''){
				return false;
			}
			if(vm.filtros.dataSaida == undefined || vm.filtros.dataSaida == ''){
				return false;
			}
			return true;
		}

		function carregarFiliais() {
			MsgCenter.clear();
			var filtros = vm.filtros;

			FilialData.listar(filtros).then(function(data) {
				vm.filiais = data.entidades;
			});
		}
		
		function carregarFilial(){
			MsgCenter.clear();
			var filtros = vm.filtros;

			FilialData.obter(vm.filtros.codFilial, filtros).then(function(data) {
				vm.filial = data;
				var filtros = { carregarImagemOriginal : true, carregarImagemMiniatura : true };
				
				if(vm.filial.foto != undefined && vm.filial.foto.codFoto != undefined && vm.filial.foto.codFoto != null){
					FotoData.obter(vm.filial.foto.codFoto, filtros).then(function(data) {
						vm.filial.foto = data;
					});	
				}
				
				
				vm.quartos = [];
			});
		}
		
		function pesquisarQuartosSemReserva(){
			MsgCenter.clear();
			var filtros = vm.filtros;
			
			if(!validarFiltrosObrigatorios()){
				return;
			}

			QuartoData.pesquisarSemReserva(filtros).then(function(data) {
				vm.quartos = data.entidades;
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

		function irParaTelaDetalhamento(codQuarto) {
			salvarEstadoTela();
			$state.go('quartoDetalhar', {
				'codQuarto' : codQuarto
			});
		}

		function irParaTelaInclusao() {
			salvarEstadoTela();
			$state.go('quartoEditar');
		}
		
		function solicitarReserva(codQuarto){
			salvarEstadoTela();
			
			MsgCenter.clear();
		
			if(!validarFiltrosObrigatorios()){
				return;
			}
			
			$state.go('solicitarReserva', {
				'codQuarto' : codQuarto,
				'codFilial' : vm.filtros.codFilial,
				'dataEntrada' : vm.filtros.dataEntrada,
				'dataSaida' : vm.filtros.dataSaida
			});
		}
		
		function validarFiltrosObrigatorios() {
			
			var filtrosValidos = true;
			
			if(vm.filtros.codFilial == undefined){
				MsgCenter.add("WARN",
						"Selecione um Hotel", undefined,
						undefined);
				filtrosValidos = false;
			}
			
			if(vm.filtros.dataEntrada == undefined){
				MsgCenter.add("WARN",
						"Selecione uma Data de Entrada", undefined,
						undefined);
				filtrosValidos = false;
			}
			
			if(vm.filtros.dataSaida == undefined){
				MsgCenter.add("WARN",
						"Selecione uma Data de Saida", undefined,
						undefined);
				filtrosValidos = false;
			}
			
			return filtrosValidos;
		}
		
		function salvarEstadoTela() {
			var devePesquisar = vm.quartos.length > 0;
			FiltroService.salvarFiltros(vm.filtros, devePesquisar);
		}

		function restaurarEstadoTela() {
			if (FiltroService.deveRestaurar()) {
				vm.filtros = FiltroService.obterFiltros();

				if (FiltroService.devePesquisar()) {
					pesquisar();
				}
				FiltroService.marcarRestaurado();
			}
		}

		function pesquisar() {
			MsgCenter.clear();
			var filtros = vm.filtros;

			QuartoData.listar(filtros).then(function(data) {
				vm.quartos = data.entidades;

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
