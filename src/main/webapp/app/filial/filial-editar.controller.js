//-----------------------------------------------------
// CONTROLADOR EDICAO
//-----------------------------------------------------
(function() {
	'use strict';

	// Adicionando um Controlador para a tela 'editar' do modulo 'filial'
	angular.module('filial').controller('EditarFilialController',
			EditarFilialController);

	// Definindo atributos e operacoes do Controlador da tela 'editar' do modulo
	// 'Filial'
	/* @ngInject */
	function EditarFilialController($controller, $scope,  $http, $state, $stateParams, $timeout,
			FilialData, MsgCenter, FotoData, AtributoData) {

		
		var vm = this;
		
		// ////////
		// the image
		vm.imagem = undefined;
		vm.nomeImagem = $scope.nomeArquivo;
		vm.enviandoFoto = false;
		

		vm.uploadImage = function() {
			
			var imgBlob = dataURItoBlob(vm.imagem);
			MsgCenter.add("WARN",
					"Anexando foto, Aguarde ...", undefined,
					undefined);
			vm.enviandoFoto = true;
			
			FotoData.incluir(imgBlob, "filial.jpg", 'fjsadffsasadfas').then(function(response) {
				vm.filial.foto = response.data;
				
				MsgCenter.clear();
				MsgCenter.add("INFO",
						"Foto anexada com sucesso", undefined,
						undefined);
				$timeout(function() { MsgCenter.clear();}, 2000);
				
				vm.enviandoFoto = false;
				
			});
		}

		// you need this function to convert the dataURI
		function dataURItoBlob(dataURI) {
			var binary = atob(dataURI.split(',')[1]);
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([ new Uint8Array(array) ], {
				type : mimeString
			});
		}
		// ///////

		// ////// ATRIBUTOS DO CONTROLADOR ////////////////////
		

		vm.filial = {};
		vm.filial.codFilial = $stateParams.codFilial;
		vm.filial.atributos = [];
		vm.atributos = [];

		vm.msgs = "";

		vm.limparFormulario = limparFormulario;
		vm.irParaTelaConsultar = irParaTelaConsultar;
		vm.incluir = incluir;
		vm.alterar = alterar;
		vm.inserirAtributoNaLista = inserirAtributoNaLista;
		vm.carregarAtributos = carregarAtributos;
		vm.removerAtributoDaLista = removerAtributoDaLista;

		activate();

		// ////// OPERACOES DO CONTROLADOR ////////////////////

		function activate() {
			if (vm.filial.codFilial !== undefined) {
				obter();
			}
			carregarAtributos();
		}
		
		function carregarAtributos() {
			MsgCenter.clear();
			var filtros = vm.filtros;

			AtributoData.listar(filtros).then(function(data) {
				//vm.atributos = data.entidades;
				angular.forEach(data.entidades, function(atributo, key){
				      if(atributo.tipo == "1"){
				    	  vm.atributos.push(atributo);
				      }
				         
				});
				
			});
		}
		
		function inserirAtributoNaLista(){
			var attr = vm.atributo;
			vm.filial.atributos.push(attr);
		}

		function removerAtributoDaLista(codAtributo){			
			angular.forEach(vm.filial.atributos, function(item, index){
			      if(item.codAtributo == codAtributo){
			    	  vm.filial.atributos.splice(index, 1);
			      }
			   });
		}

		function recarregarTela() {
			$state.reload();
		}

		function irParaTelaConsultar() {
			MsgCenter.clear();

			$state.go('filialConsultar');
		}

		function incluir() {
			MsgCenter.clear();

			vm.filial.codFilial = undefined;

			FilialData.salvar(vm.filial).then(
					function(data) {
						MsgCenter.add("INFO",
								"Filial incluído(a) com sucesso!", undefined,
								undefined);
						limparFormulario();
					});
		}

		function limparFormulario() {
			vm.filial = {};
		}

		function alterar() {
			MsgCenter.clear();

			FilialData.salvar(vm.filial).then(
					function(data) {
						MsgCenter.add("INFO",
								"Filial alterado(a) com sucesso!", undefined,
								undefined);

						$state.go('filialDetalhar', {
							'codFilial' : vm.filial.codFilial
						});
					});
		}

		function obter() {
			FilialData.obter(vm.filial.codFilial).then(function(data) {
				vm.filial = data.plain();
			});
		}
	}

})();