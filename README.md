PaginationJs
============

Pagination javascript class

HOW TO:
=======

```JS
var pg;

function getNewData(pgnum){
    var totalCount = 250; // COUNT(*)
    var itemsPerPage = 10; // number of rows
    var pagedItems = 5; // number of pages
    
    var paginator = new Paginator(itemsPerPage, pagedItems);
    pg = paginator.paginate(pgnum, totalCount);
    
    // pseudo request
    ajax({
        // options
        data: {offset : paginator.getOffset(), limit : paginator.getLimit()}
    }).success(function(data){
        console.log(data);
    });
    
    return false;
}

jQuery(document).ready(function(){
    jQuery(".first").click(function(){
        getNewData(pg.first);
    });
    jQuery(".prev").click(function(){
        getNewData(pg.prev);
    });
    jQuery(".next").click(function(){
        getNewData(pg.next);
    });
    jQuery(".last").click(function(){
        getNewData(pg.last);
    });
});

```

HOW TO: Pagination and AngularJS:
===============================

```JS
function UsersController($scope, $http, $routeParams){
    $scope.itemsPerPage = 10; // 10 rows
    $scope.pagedItems = 5; // 5 links in pagination 
    $scope.pg = {};
    $scope.pg.page = ($routeParams.page == null || $routeParams.page == undefined)? 1 : $routeParams.page;
    $scope.paginator = new Paginator($scope.itemsPerPage, $scope.pagedItems);
   
        $http({
            url: '/users/total',
            method: 'POST',
            data: {},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            $scope.userCount = parseInt(data);
            $scope.pg = $scope.paginator.paginate($scope.pg.page, $scope.userCount);
            
            $http({
                url: '/users',
                method: 'POST',
                data: {offset : $scope.paginator.getOffset(), limit : $scope.paginator.getLimit()},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status, headers, config) {
                $scope.users = data;
            });
        });
    
};
```


Html:
-------
```code
<ul class="pagination pagination-sm">
    <li ng-class="(1==pg.page)?'disabled':''"><a href="#/mylist/{{pg.prev}}">&laquo;</a></li>
    <li ng-class="(n==pg.page)?'active':''" ng-repeat="n in pg.range">
        <a href="#/mylist/{{n}}" ng-bind="n">1</a>
    </li>
    <li ng-class="(pg.last==pg.page)?'disabled':''"><a href="#/mylist/{{pg.next}}">&raquo;</a></li>
</ul>
```
