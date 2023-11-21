var app = angular.module('app', []);
app.controller('cApp', function ($scope, $http) {

    //opções para filtrar personagens
    $scope.opcaoStatus = [
        { tStatus: "Selecione um status", status: "" },
        { tStatus: "vivo", status: "alive" },
        { tStatus: "morto", status: "dead" },
        { tStatus: "desconhecido", status: "unknown" }
    ];
    $scope.opcaoGender = [
        { tGender: "Selecione um gênero", gender: ""},
        { tGender: "feminino", gender: "female" },
        { tGender: "masculino", gender: "male" },
        { tGender: "sem gênero", gender: "genderless" },
        { tGender: "desconhecido", gender: "unknown" }
    ];

    $scope.possivelPages = [];
    $scope.ExibirPages = [];
    // se o tamanho for maior que 5 ele vai entrar no controle de tamanho ExibirPages, quando eu estivesse no ultimo elemento da ExibirPages eu adiciono mais 4 valores,
    // mas se não houver mais 4 valores no possivelPages adiciono as quantidades possíveis e removo o tanto que for adicionada

    //ao clicar no botão buscar, sem inserir ou selecionar dados o sistema envia os valores abaixo como padrão
    $urlBase = 'https://rickandmortyapi.com/api/character/';
    $scope.inputName = "";
    $scope.status = $scope.opcaoStatus[0];
    $scope.gender = $scope.opcaoGender[0];
    $scope.Srequisicao = 0;
    $scope.erros = 0;
    $scope.carregando = false;

    $scope.Buscar =  () => {
        $scope.carregando = true;
        //setar o status da requisição que será feita
        $scope.Srequisicao = 1;
        //Define a requisição
        $requisicao = $urlBase + "?status=" + $scope.status.status + "&name=" + $scope.inputName + "&gender=" + $scope.gender.gender;
        console.log("Bom dia "+$requisicao);
        $http.get($requisicao)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.dataPersonagens = resultado.data;
                //dá um valor em inteiro para a variável page
                if(data.info.next == null){
                    $scope.aPage = 1;
                }else{
                    var page = parseInt(data.info.next.replace(/[^0-9]/g,""))-1;
                    $scope.aPage = page;
                }
                //joga no scope todas as numerações possível de página
                var a = 1;
                while(a<=data.info.pages){
                    $scope.possivelPages.push(a)
                    a++;
                }
                paginacao();
                $scope.carregando = false;
                console.log("bug " + $scope.ExibirPages);
            }, function () {
                $scope.erro = "erroBusca";
                $scope.carregando = false;
            })
    }

    $scope.ProximaPagina = () => {
        $scope.carregando = true;
        $scope.inputPage = "";
        $scope.Srequisicao = 1;
        $http.get($scope.dataPersonagens.info.next)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.dataPersonagens = resultado.data;
                $scope.aPage++;
                $scope.carregando = false;
            })
    }

    $scope.VoltaPagina = () => {
        $scope.carregando = true;
        $scope.inputPage = "";
        $scope.Srequisicao = 1;
        $http.get($scope.dataPersonagens.info.prev)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.dataPersonagens = resultado.data;
                $scope.aPage--;
                $scope.carregando = false;
            })
    }

    $scope.Sorteia = () => {
        $scope.carregando = true;
        $scope.Srequisicao = 2;
        //soretia um número 
        $numero = Math.floor(Math.random() * 825)+1;
        //a mesma estrutura para saber mais sobre um personagem
        $requisicao = $urlBase + $numero;
        $http.get($requisicao)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.dataPersonagem = resultado.data;
            //busca por origem do personagem para exibir mais informações da origem
            $http.get(data.origin.url)
                .then(function(resultado){
                    let data = resultado.data;
                    $scope.dataLocalOrigin = resultado.data;
                });
            reqUrls();
            console.log($scope.dataEps)
            $scope.carregando = false;
        });
        //array para guardar urls de episódios
        
    }

    var reqUrls = () => {
        $scope.carregando = true;
        $scope.urlEp = [];
        //criado o objeto para guardar objetos de eps
        $scope.dataEps = [];
        console.log($scope.dataPersonagem);
        $scope.dataPersonagem.episode.forEach(function(ep){
            $scope.urlEp.push(ep);
            $http.get(ep)
                    .then(function(resultado){
                        let data = resultado.data;
                        $scope.dataEps.push(resultado.data);
                        $scope.carregando = false;
                    });
        });
        console.log($scope.urlEp)
    }

    var paginacao = () => {
        if($scope.possivelPages.length>5){
            p = 1;
            do{
                $scope.ExibirPages.push(p);
                p++;
            } while (p <= 5);
        }else{
            $scope.ExibirPages = $scope.possivelPages;
        }
    }

    var ajustePaginas = () => {
            /*
        função pra ser chamada dentro das funções que mudam de paginas (prox,anterior e buscar)
        if(aPage == ultimo elemento da $scope.ExibirPages){
            if(se dentro de $possiverlPages houver elemento maior que o ultimo de $scope.ExibirPages){
                quantos dentro de $scope.possivelPages tem valores maiores que a ultima procurada?{
                    então adiciona dentro de ExibirPages mais x elementos (com limite de 4) e remove x elementos
                }
            }
        }
        if(aPage == primeiro elemento da $scope.ExibirPages){
            if(se dentro de $possiverlPages houver elemento menor que o ultimo de $scope.ExibirPages){
                quantos dentro de $scope.possivelPages tem valores menores que a ultima procurada?{
                    então adiciona dentro de ExibirPages mais x elementos e remove x elementos
                }
            }
        }
        */
       switch($scope.aPage){
        case $scope.ExibirPages[4]:
            if($scope.possivelPages[$scope.possivelPages.length-1]>$scope.aPage){
                
            }
            break;
        case $scope.ExibirPages[0]:
            if($scope.possivelPages[0]<$scope.aPage){

            }
            break;
       }
    }

    $scope.Reiniciar = () => {
        $scope.Srequisicao = 0;
        $scope.dataPersonagens = {};
        $scope.dataPersonagem = {};
        $scope.possivelPages = [];
        $scope.ExibirPages = [];
    }

    $scope.carregarDados = ($id) => {
        $scope.carregando = true;
        $scope.Srequisicao = 2;
        $requisicao = $urlBase + $id;
        $http.get($requisicao)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.dataPersonagem = resultado.data;
                //busca por origem do personagem para exibir mais informações da origem
                $http.get(data.origin.url)
                .then(function(resultado){
                    let data = resultado.data;
                    $scope.dataLocalOrigin = resultado.data;
                });
                reqUrls();
                $scope.carregando = false;
            });
    }

    $scope.voltarParaBusca = () => {
        $scope.Srequisicao = 1;
    }

    $scope.setPage = ($page) => {
        $scope.carregando = true;
        $scope.inputPage = "";
        $requisicao = $urlBase + "?page=" + $page + "&status=" + $scope.status.status + "&name=" + $scope.inputName + "&gender=" + $scope.gender.gender;
        console.log($requisicao)
        $http.get($requisicao)
            .then(function (resultado) {
                let data = resultado.data;
                $scope.aPage = $page;
                $scope.dataPersonagens = resultado.data;
                $scope.carregando = false;
            }, function () {
                $scope.erro = "erroPagina";
                $scope.carregando = false;
            })
    }

    //daqui pra baixo nada foi feito completamente

    $scope.saberQuemEsta = (local) => {
        console.log(local);
        $requisicao = $urlBase + "?location=" + local;
        console.log($requisicao);
    }
});