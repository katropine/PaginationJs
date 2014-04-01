/**
 * Paginator
 *
 * @author kristian@katropine.com
 * @version 1.0
 * @copyright Kristian Beres <kristian@katropine.com>
 * @licence MIT
 *
 *
 * How to:
 *
 * ========================================================================================
var _Paginator; //object
var pg; //object
function countAll(){
    var a = "null";
   $j.ajax({
        type: "POST",
        url: 'Ajax_CountAll.php";?>',
        async: false,
        success: function(_res){
           a = _res;
        },
        error: function(){
            alert("Nahh");
        }
    });
    return a;
}
function doThePagging(pgnum){

    var total = countAll();
    _Paginator = new Paginator(5,5);
     pg = _Paginator.paginate(pgnum, total);
    var HTML = '';
    var arr = null;
    $j("tr.rowcolordark").fadeOut(300);
    $j.ajax({
        type: "POST",
        data: 'offset='+_Paginator.getOffset()+'&limit='+_Paginator.getLimit(),
        url: 'Ajax_Fetch.php";?>',
        dataType: 'json',
        async: false,
        success: function(data){
            $j("tr.rowcolordark").remove();
            $j("#dataholder").after("<tr class=\"headerline\"></tr>", function(){
                    HTML +=  '<tr class="rowcolordark"><td>'+obj.I+'</td>';
                    HTML += '<td>'+obj.Title+'</td></tr>';
            }).append(HTML).hide().fadeIn(500);


        }
    });

    return false;
}
$j(document).ready(function(){
     $j(".first").click(function(){
            doThePagging(pg.first);
        });
        $j(".prev").click(function(){
            doThePagging(pg.prev);
        });
        $j(".next").click(function(){
            doThePagging(pg.next);
        });
        $j(".last").click(function(){
            doThePagging(pg.last);
        });
});
 *
 *  var Paging = new Paginator(10, 5);    // init(limit, howMenyNumbersInMenu)    -> (10 rows, << < 1 2 3 4 5 > >>)
 *  var total = [?php echo $SomeModel->countAll();?] or...
 *  var pg = Paging.paginate($_REQUEST['page'], total);
 *  // for the method that puls data, add to sql: LIMIT "Paging.getOffset().",".Paging.getLimit();
 * ========================================================================================
 * THATS IT!!!!!!!!!!!!!!!!
 *
 *  AngularJS controler methods
 *
 *
 * function UsersController($scope, $http){
 *
 *
        $scope.itemsPerPage = 3; // 3 links in pagination
        $scope.pagedItems = 10; // 10 rows
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
                $scope.userCount =  parseInt(data);
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
 *
 *
 * Html:
 *
    <ul class="pagination pagination-sm">
        <li ng-class="(1==pg.page)?'disabled':''"><a href="#" ng-click="setPrev()">&laquo;</a></li>
        <li ng-class="(n==pg.page)?'active':''" ng-repeat="n in range(pagedItems)" ng-click="setPage(n)">
            <a href="#" ng-bind="n">1</a>
        </li>
        <li ng-class="(pg.last==pg.page)?'disabled':''"><a href="#" ng-click="setNext()">&raquo;</a></li>
    </ul>
 *
 */
function Paginator(numberOfResults, numberOfLinks){

    this.numOfResults = numberOfResults;
    this.numberOfLinks = numberOfLinks;
    this.page = 1;
    this.numberOfLinksCnt = null;

    /**
     *
     * @param page int  $_POST['curent_page'] or $_GET['curent_page']
     * @param total int count with same criteria [sql] as you pull data
     * @return JS object ----------------------
     *               paging.start = starting page value
     *               paging.end = ending page value
     *               paging.last = last page
     *               paging.total = number of results
     *               paging.istart = starting (row) result number for current page
     *               paging.iend = ending (row) result number for current page
     */
    this.paginate = function (page, total){
        if(page > 1){
            this.page = page;
        }else{
            this.page = page = 1;
        }
        var numberOfLinksCnt = this.numberOfLinks;

        if(numberOfLinksCnt <= 1){
            numberOfLinksCnt = this.numberOfLinks;
        }else{
            numberOfLinksCnt -=1;
        }
        var mid = Math.floor(this.numberOflinks/2);
        var numpages = 0;

        if(total > this.numOfResults){
            numpages = Math.ceil(total/this.numOfResults);
        }else{
            numpages = 1;
        }
        var npage = page;
        if (page > numpages) page = numpages;
        while ((npage-1)>0&&npage>(page-mid)&&(npage>0)) npage -= 1;
        var lastpage = npage + numberOfLinksCnt;

        if (lastpage>numpages){
            npage = numpages - numberOfLinksCnt + 1;
            if (npage<0) npage = 1;
            lastpage = npage + numberOfLinksCnt;
            if (lastpage>numpages) lastpage = numpages;
        }
        while ((lastpage-npage)<numberOfLinksCnt) npage -= 1;
        if (npage<1) npage = 1;

        var paging = {
            first: null,
            prev: null,
            start: null,
            end: null,
            page: null,
            next: null,
            last: null,
            total: null,
            iend: null,
            istart: null
        };
        paging.first = 1;
        if (page>1) {paging.prev = page - 1;}else{ paging.prev = 1;}
        paging.start = npage;
        paging.end = lastpage;
        paging.page = page;
        if ((page+1)<numpages) {paging.next = page + 1;}else{ paging.next = numpages;}
        paging.last = numpages;
        paging.total = total;
        paging.iend = page * this.numOfResults;
        paging.istart = (page * this.numOfResults) - this.numOfResults + 1;

        if ((page * this.numOfResults)>total){ paging.iend = total;}

        return paging;
    };
    /**
     *
     * @return int Number or rows per page
     */
    this.getLimit = function(){
        return this.numOfResults;
    };
    /**
     *
     *
     * @return int to start from record number
     */
    this.getOffset = function(){
        return ((this.page-1) * this.numOfResults);
    };
}
