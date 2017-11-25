(function() {
	'use strict';

	var myApp = angular.module('lazarusApp', [ 
            //Sub-modulos que sao bibliotecas externas
            'ui.router', 
            'restangular',
            'checklist-model',
            'ngMask',
            'datepicker-localdate',
            //'ng-file-upload',            
            'ui.bootstrap',
            'msgcenter',
            
            //Sub-modulos que sao funcionalidades do sistema
			'inicio',
			'cliente', 
			'filial', 
			'atributo', 
			'tipoquarto',
			'usuario',
			'quarto',
			'reserva',
			'foto',
			'contato'
			//'login'
//			'showcase'
	]);
	
	
	
	angular.module('lazarusApp').config(['uibDatepickerConfig', function (uibDatepickerConfig) {
	    uibDatepickerConfig.showWeeks = false;
	}]);
	
})();