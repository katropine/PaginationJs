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
function UsersController($scope, $http){
    $scope.itemsPerPage = 10; // 10 rows
    $scope.pagedItems = 5; // 5 links in pagination 
    $scope.pg = {};
    $scope.pg.page = 1;
    $scope.paginator = new Paginator($scope.itemsPerPage, $scope.pagedItems);
    $scope.search = function(){
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

    $scope.setPage = function(p){
        $scope.pg.page = p;
        $scope.search();
    };
    
    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = $scope.pg.end;
            start = $scope.pg.start;
        }
        for (var i = start; i <= end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.setNext = function(){
        if($scope.pg.last!=$scope.pg.page){
          $scope.setPage($scope.pg.next);
        }
    };

    $scope.setPrev = function(){
        if($scope.pg.page > 1){
            $scope.setPage($scope.pg.prev);
        }
    };
};
```


Html:
-------
```code
<ul class="pagination pagination-sm">
    <li ng-class="(1==pg.page)?'disabled':''"><a href="#" ng-click="setPrev()">&laquo;</a></li>
    <li ng-class="(n==pg.page)?'active':''" ng-repeat="n in range(pagedItems)" ng-click="setPage(n)">
        <a href="#" ng-bind="n">1</a>
    </li>
    <li ng-class="(pg.last==pg.page)?'disabled':''"><a href="#" ng-click="setNext()">&raquo;</a></li>
</ul>
```
