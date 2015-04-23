<?php
/**
 * Paginator
 *		
 * @author Kriss
 * @version 2.2
 * @copyright Kristian Beres <kristian@katropine.com>
 * @licence MIT
 *
 * How to:
 *
 * In controller->action:
 * ========================================================================================
 *  $Paging = new Paginator(10, 5);   // Paginator($limit, $howMenyNumbersInMenu)    -> (10 rows, << < 1 2 3 4 5 > >>)
 *  $total = $SomeModelMapper->countAll();
 *  $pg = $Paging->paging($_REQUEST['page'], $total);
 *  // for the method that puls data, add to sql: LIMIT ".$Paging->getOffset().",".$Paging->getLimit();
 * ========================================================================================
 *
 *
 * CI type of implementation
 * $pg_data['pg'] => $pg;
 *
 * to the page/view/template or /partials/ or directlly in view files add:
 *
 *
 * ========================================================================================
    <div class="pages">
        <center>
       <div class="inside">
           <?php if($pg['total'] > $Paginator->getLimit()):?>
           <a href="<?php echo $_SERVER['PHP_SELF']."?page=".$pg['first'].$url?>" title="Go to First Page" class="first"><span>&laquo;</span></a>
           <a href="<?php echo $_SERVER['PHP_SELF']."?page=".$pg['prev']?>" title="Go to Previous Page" class="prev"><span>&lsaquo;</span></a>

           <?php
               for ($i=$pg['start'];$i<=$pg['end'];$i++) {
               if ($i==$pg['page']) $current = 'current'; else $current="";
           ?>

           <a href="<?php echo $_SERVER['PHP_SELF']."?page=".$i.$url;?>" title="Go to Page <?=$i?>" class="page <?=$current?>"><?=$i?></a>

           <?php } ?>

           <a href="<?php echo $_SERVER['PHP_SELF']."?page=".$pg['next'].$url?>" title="Go to Next Page" class="next"><span>&rsaquo;</span></a>
           <a href="<?php echo $_SERVER['PHP_SELF']."?page=".$pg['last'].$url?>" title="Go to Last Page" class="last"><span>&raquo;</span></a>
           <?php endif;?>
       </div>
       </center>
    </div>
 * ========================================================================================
 * THATS IT!!!!!!!!!!!!!!!!
 *
 * for CodeIgniter use as plugin, for Zend and Kohana use as library
 * 
 * Change Log:
 * - method limit() renamed to getLimit()
 */
class Paginator {

    protected $numOfResoults;
    protected $numberOfLinks;
    protected $page;
    /**
     *
     * @param int $numberOfResoults How meni resoults to display per page
     * @param int $numberOfLinks Number of links in paging meni
     */
    public function  __construct($numberOfResoults, $numberOfLinks) {
        $this->numOfResoults = $numberOfResoults;
        $this->numberOfLinks = $numberOfLinks;
    }
    /**
     *
     * @param int $page $_POST['curent_page'] or $_GET['curent_page']
     * @param int $rp how meni resoults displayd per page
     * @param int $total count with saime criteria [sql] as you pull data
     * @return array $pg_data['pg'] ----------------------
     *               $paging[‘start’] = starting page value
     *               $paging[‘end’] = ending page value
     *               $paging[‘last’] = last page
     *               $paging[‘total’] = number of results
     *               $paging[‘istart’] = starting result number for current page
     *               $paging[‘iend’] = ending result number for current page
     */
    public function paging($page, $total){

        $page = (empty($page))? 1 : $page;

        $this->page = $page;

        $this->numberOfLinks -= 1;

        $mid = floor($this->numberOfLinks/2);

        if ($total>$this->numOfResoults)
            $numpages = ceil($total/$this->numOfResoults);
        else
            $numpages = 1;

        if ($page>$numpages) $page = $numpages;

            $npage = $page;

        while (($npage-1)>0&&$npage>($page-$mid)&&($npage>0))
            $npage -= 1;

        $lastpage = $npage + $this->numberOfLinks;

        if ($lastpage>$numpages)
            {
            $npage = $numpages - $this->numberOfLinks + 1;
            if ($npage<0) $npage = 1;
            $lastpage = $npage + $this->numberOfLinks;
            if ($lastpage>$numpages) $lastpage = $numpages;
            }

        while (($lastpage-$npage)<$this->numberOfLinks) $npage -= 1;

        if ($npage<1) $npage = 1;
        
        $paging['first'] = 1;
        if ($page>1) $paging['prev'] = $page - 1; else $paging['prev'] = 1;
        $paging['start'] = $npage;
        $paging['end'] = $lastpage;
        $paging['page'] = $page;
        if (($page+1)<$numpages) $paging['next'] = $page + 1; else $paging['next'] = $numpages;
        $paging['last'] = $numpages;
        $paging['total'] = $total;
        $paging['iend'] = $page * $this->numOfResoults;
        $paging['istart'] = ($page * $this->numOfResoults) - $this->numOfResoults + 1;

        if (($page * $this->numOfResoults)>$total) $paging['iend'] = $total;

        return $paging;
    }
    /**
     *
     * @return int Number or rows per page
     */
    public function getLimit(){
        return $this->numOfResoults;
    }
    /**
     *
     * @param int $page The number of current page
     * @return int to start from record number
     */
    public function getOffset(){
        return (($this->page-1) * $this->numOfResoults);
    }
    /**
     * Record number in iteration
     * @param int $count
     * @return int 
     *
     * Tutorial !!!!!!!!:
     * 
     * $count = 0;
     *
     * foreach ($array as $row){
     *
     *   $count = $Paging->getRecordNumber($count);
     *
     *   echo $count;
     *
     * }
     *
     */
    public function getRecordNumber($count){
        $_offset = 0;
        if($count == 0){$_offset = $this->getOffset($this->page );}
        $count = $count + 1 + $_offset;
        return $count;
    }
}
