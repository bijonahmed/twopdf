<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Project\ProjectController;
use App\Http\Controllers\Documents\DocumentsController;
use App\Http\Controllers\Setting\SettingController;
use App\Http\Controllers\UnauthenticatedController;
use App\Http\Controllers\WaterMarkPDFController;
use App\Http\Controllers\Brands\BrandsController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Post\PostController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Mining\MiningController;
use App\Http\Controllers\Payment\PaypalController;
use App\Http\Middleware\CheckUserStatus;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('messages', [ChatController::class, 'message']);
Route::get('/messages/{community_slug}', [ChatController::class, 'getMessages']);
Route::get('/long-poll/{communitySlug}', [ChatController::class, 'longPoll']);
Route::get('settingrowClient', [UnauthenticatedController::class, 'settingrowClient']);

Route::group([
    'middleware' => 'api',
    'prefix'     => 'auth'
], function () {
    Route::post('userRegister', [UserAuthController::class, 'register']);
    Route::post('userLogin', [UserAuthController::class, 'login']);

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('profile', [AuthController::class, 'profile']);
    Route::post('me', [AuthController::class, 'me']);
    Route::post('updateprofile', [AuthController::class, 'updateprofile']);
    Route::post('updateUserProfileSocial', [AuthController::class, 'updateUserProfileSocial']);
    Route::post('changesPassword', [AuthController::class, 'changesPassword']);
    Route::post('updatePassword', [AuthController::class, 'updatePassword']);
    Route::get('showProfileData', [AuthController::class, 'showProfileData']);
    Route::post('payment/createOrder', [PaypalController::class, 'paypal']);
    Route::post('stripe/createOrderStripe', [StripePaymentController::class, 'stripeCheckout']);
    //Route::post('password/email', [ForgotPasswordController::class, 'sendPasswordResetEmail']);
    //Route::post('password/reset', [ResetPasswordController::class, 'updatePassword']);
});

Route::group([
    'prefix' => 'public'
], function () {
    Route::get('/checkSeoContent', [UnauthenticatedController::class, 'checkSeoContent']);
    Route::get('/generate-pdf/{slug}', [UnauthenticatedController::class, 'generatePDF']);
    Route::get('getChildDataParentWise/{slug}', [UnauthenticatedController::class, 'getChildDataParentWise']);
    Route::get('countPerDayValidation', [UnauthenticatedController::class, 'countPerDayValidation']);
    Route::get('countPerDayValidationSplit', [UnauthenticatedController::class, 'countPerDayValidationSplit']);
    Route::post('insertSplitData', [UnauthenticatedController::class, 'insertSplitData']);
    Route::post('convert-pdf-to-txt', [UnauthenticatedController::class, 'converttoword']);
    Route::post('convert-pdf-to-ppt', [UnauthenticatedController::class, 'convertToPowerPoint']);
    Route::post('/protect-pdf', [UnauthenticatedController::class, 'generateProtectedPdf']);
    Route::post('/watermark-pdf', [WaterMarkPDFController::class, 'addWatermark']);
});


Route::middleware(['auth:api', CheckUserStatus::class])->group(function () {

    Route::group([
        'prefix' => 'user'
    ], function () {
       
        Route::get('checkCurrentUser', [UserController::class, 'checkCurrentUser']);
        Route::get('getRoleList', [UserController::class, 'getRoleList']);
        Route::get('allrolelistsInfo', [UserController::class, 'allrolelistsInfo']);
        Route::get('allrolelist', [UserController::class, 'allrolelist']);
        Route::get('roleCheck/{id}', [UserController::class, 'roleCheck']);
        Route::get('getUserRow/{id}', [UserController::class, 'editUserId']);
        Route::get('getCountry', [UserController::class, 'getCountry']);
        Route::get('getTime', [UserController::class, 'getTime']);
        Route::get('inactiveEmployee', [UserController::class, 'inactiveEmployee']);
        Route::get('inactiveUser', [UserController::class, 'inactiveUser']);
        Route::get('getInviteCode', [UserController::class, 'getInviteCode']);
        Route::get('autocompleteUser', [UserController::class, 'autocompleteUser']);
        Route::get('allUsers', [UserController::class, 'AllUsersList']);
        Route::get('allAgent', [UserController::class, 'allAgent']);
        Route::get('allAdmin', [UserController::class, 'allAdmin']);
        Route::get('allSuperAdmin', [UserController::class, 'allSuperAdmin']);
        Route::get('getUserWiseCurrentBalance', [UserController::class, 'getUserWiseCurrentBalance']);
        Route::get('getEmployeeList', [UserController::class, 'getEmployeeList']);
        Route::get('getDesignationList', [UserController::class, 'getDesignationList']);
        Route::get('departmentCheck/{id}', [UserController::class, 'departmentCheck']);
        Route::get('designationCheck/{id}', [UserController::class, 'designationCheck']);
        Route::get('getDepartmentList', [UserController::class, 'getDepartmentList']);
        Route::get('typeofdoucments', [UserController::class, 'typeofdoucments']);
        Route::post('saveDesignation', [UserController::class, 'saveDesignation']);
        Route::post('saveDepartment', [UserController::class, 'saveDepartment']);
        Route::post('changePassword', [UserController::class, 'changePassword']);
        Route::post('changePasswordClient', [UserController::class, 'changePasswordClient']);
        Route::post('updateUserProPass', [UserController::class, 'updateUserProPass']);
        Route::post('saveUser', [UserController::class, 'saveUser']);
        Route::post('updateUser', [UserController::class, 'updateUser']);
        Route::post('updateUserProfileImg', [UserController::class, 'updateUserProfileImg']);
        Route::post('assignToUser', [UserController::class, 'assignToUser']);
        Route::post('saveRole', [UserController::class, 'saveRole']);
      
    });

    Route::group([
        'prefix' => 'category'
    ], function () {
        Route::post('inserMiningCategory', [CategoryController::class, 'inserMiningCategory']);
        Route::post('editMiningCategory', [CategoryController::class, 'editMiningCategory']);
        Route::post('save', [CategoryController::class, 'save']);
        Route::post('edit', [CategoryController::class, 'edit']);
        Route::post('saveAttribute', [CategoryController::class, 'saveAttribute']);
        Route::post('saveAttributeVal', [CategoryController::class, 'saveAttributeVal']);
        Route::get('getCategoryList', [CategoryController::class, 'allCategory']);
        Route::get('allMiningCategoryes', [CategoryController::class, 'allMiningCategoryes']);
        Route::get('getInacCategoryList', [CategoryController::class, 'allInacCategory']);
        Route::get('categoryRow/{id}', [CategoryController::class, 'findCategoryRow']);
        Route::get('getCategoryListParent', [CategoryController::class, 'getCategoryListParent']);
        Route::get('getSubCategoryChild/{id}', [CategoryController::class, 'getSubCategoryChild']);
        Route::get('minningCategoryrow/{id}', [CategoryController::class, 'minningCategoryrow']);
        Route::get('attributeRow/{id}', [CategoryController::class, 'attributeRow']);
        Route::get('attributeValRow/{id}', [CategoryController::class, 'attributeValRow']);
        Route::get('attributeValRows/{product_id}/{product_attribute_id}', [CategoryController::class, 'attributeValRows']);
        Route::get('search', [CategoryController::class, 'searchCategory']);
        Route::get('attributes', [CategoryController::class, 'getAttribute']);
        Route::get('attributes-list', [CategoryController::class, 'getAttributeList']);
        Route::get('attributes-val-list', [CategoryController::class, 'getAttributeValList']);
        Route::get('postCategorysearch', [CategoryController::class, 'postCategorysearch']);
        Route::get('allCategorys', [CategoryController::class, 'getCategoryList']);
        Route::get('getCategoryUnderSubCat', [CategoryController::class, 'getCategoryUnderSubCat']);
    });

    Route::group([
        'prefix' => 'product'
    ], function () {
        Route::get('categoryWiseProduct', [ProductController::class, 'categoryWiseProduct']);
        Route::post('save', [ProductController::class, 'save']);
        Route::get('dashboardCounting', [ProductController::class, 'dashboardCounting']);
        Route::post('product-update', [ProductController::class, 'productUpdate']);
        Route::post('insertVarientGroup', [ProductController::class, 'insertVarientGroup']);
        Route::get('getProductList', [ProductController::class, 'getProductList']);
        Route::get('insertProductAttrAndValues', [ProductController::class, 'insertProductAttrAndValues']);
        Route::get('insertProductVarient', [ProductController::class, 'insertProductVarient']);
        Route::get('deleteValrient', [ProductController::class, 'deleteValrient']);
        Route::get('getAttrHistory/{id}', [ProductController::class, 'getAttrHistory']);
        Route::get('productrow/{id}', [ProductController::class, 'productrow']);
        Route::get('additionaIMagesDelete', [ProductController::class, 'additionaIMagesDelete']);
        Route::get('deleteCategory', [ProductController::class, 'deleteCategory']);
        Route::get('getVarientHistory', [ProductController::class, 'getVarientHistory']);
        Route::get('removeProducts/{id}', [ProductController::class, 'removeProducts']);
    });

    Route::group([
        'prefix' => 'post'
    ], function () {

        Route::post('save', [PostController::class, 'save']);
        Route::post('update', [PostController::class, 'update']);
        Route::get('postrow/{id}', [PostController::class, 'postrow']);
        Route::get('allPost', [PostController::class, 'allPostList']);
        Route::get('postCategoryData', [PostController::class, 'postCategoryData']);
    });

    Route::group([
        'prefix' => 'mining'
    ], function () {
        Route::get('minningDurationrow/{id}', [MiningController::class, 'minningDurationrow']);
        Route::post('inserMiningDuration', [MiningController::class, 'inserMiningDuration']);
        Route::get('allMiningDuration', [MiningController::class, 'allMiningDuration']);
        Route::get('checkMiningInfo', [MiningController::class, 'checkMiningInfo']);
        Route::get('getMiningDuration', [MiningController::class, 'getMiningDuration']);
        Route::get('getMiningCategory', [MiningController::class, 'getMiningCategory']);
        Route::post('miningProcess', [MiningController::class, 'miningProcess']);
        Route::post('buyMiningDuration', [MiningController::class, 'buyMiningDuration']);
        Route::get('checkMiningProcess', [MiningController::class, 'checkMiningProcess']);
        Route::get('miningProcessState', [MiningController::class, 'miningProcessState']);
    });

    Route::group([
        //'middleware' => 'api',
        'prefix' => 'brands'
    ], function () {
        Route::post('save', [BrandsController::class, 'save']);
        Route::get('allbrandlist', [BrandsController::class, 'allbrandlist']);
        Route::get('allCouminitylist', [BrandsController::class, 'allCouminitylist']);
        Route::get('brandrow/{id}', [BrandsController::class, 'brandrow']);
        Route::get('communityrow/{id}', [BrandsController::class, 'communityrow']);
        // Route::get('searchmodels', [BrandsController::class, 'searchmodels']);
        Route::post('communitySave', [BrandsController::class, 'communitySave']);
    });

    Route::group([
        'prefix' => 'project'
    ], function () {
        Route::post('saveTask', [ProjectController::class, 'saveTask']);
        Route::post('saveProject', [ProjectController::class, 'save']);
        Route::get('allProject', [ProjectController::class, 'allProject']);
        Route::get('geTaskList', [ProjectController::class, 'geTaskList']);
        Route::get('checkProjectId/{id}', [ProjectController::class, 'editId']);
        Route::get('taskRow/{id}', [ProjectController::class, 'editTaskId']);
    });
    Route::group([
        'prefix' => 'documents'
    ], function () {
        Route::post('saveDocuments', [DocumentsController::class, 'saveDocuments']);
        Route::get('getAllDocuments', [DocumentsController::class, 'getAllDocuments']);
        Route::get('documents-row/{id}', [DocumentsController::class, 'editId']);
    });

    Route::group([
        'prefix' => 'setting'
    ], function () {
        //emp type
        Route::post('insertEmployeeType', [SettingController::class, 'insertEmployeeType']);
        Route::get('getEmployeeTypeList', [SettingController::class, 'getEmployeeTypeList']);
        Route::get('checkrowEmpleeType/{id}', [SettingController::class, 'checkrowEmpleeType']);
        //pay group
        Route::post('insertPayGroup', [SettingController::class, 'insertPayGroup']);
        Route::get('getPayGroupList', [SettingController::class, 'getPayGroupList']);
        Route::get('checkrowPayGroup/{id}', [SettingController::class, 'checkrowPayGroup']);
        //Annual Pay 
        Route::post('insertAnnualPay', [SettingController::class, 'insertAnnualPay']);
        Route::get('getAnnualPayist', [SettingController::class, 'getAnnualPayist']);
        Route::get('checkrowAnnualPay/{id}', [SettingController::class, 'checkrowAnnualPay']);
        //Bank Master
        Route::post('insertBankMaster', [SettingController::class, 'insertBankMaster']);
        Route::get('getBankMasterlist', [SettingController::class, 'getBankMasterlist']);
        Route::get('checkrowBankMaster/{id}', [SettingController::class, 'checkrowBankMaster']);
        //Bank Short Code 
        Route::post('insertBankCode', [SettingController::class, 'insertBankCode']);
        Route::get('getBankShortCodelist', [SettingController::class, 'getBankShortCodelist']);
        Route::get('checkrowBankShortCode/{id}', [SettingController::class, 'checkrowBankShortCode']);
        //Tax Master
        Route::post('insertTaxMaster', [SettingController::class, 'insertTaxMaster']);
        Route::get('gettxtMastlist', [SettingController::class, 'gettxtMastlist']);
        Route::get('checkrowtxtmaster/{id}', [SettingController::class, 'checkrowtxtmaster']);
        //Payment type
        Route::post('insertPaymentType', [SettingController::class, 'insertPaymentType']);
        Route::get('getPaymentType', [SettingController::class, 'getPaymentType']);
        Route::get('checkrowPaymenttype/{id}', [SettingController::class, 'checkrowPaymenttype']);
        //Wedges pay mode
        Route::post('insertWedges', [SettingController::class, 'insertWedges']);
        Route::get('getWdges', [SettingController::class, 'getWdges']);
        Route::get('checkrowWedges/{id}', [SettingController::class, 'checkrowWedges']);
        //Pay Item List 
        Route::post('insertPayItem', [SettingController::class, 'insertPayItem']);
        Route::get('getPayItemList', [SettingController::class, 'getPayItemList']);
        Route::get('checkPayItemRow/{id}', [SettingController::class, 'checkPayItemRow']);
        Route::get('slidersImages', [SettingController::class, 'slidersImages']);
        //add slider 
        Route::post('insertSlider', [SettingController::class, 'insertSlider']);
        Route::post('upateSetting', [SettingController::class, 'upateSetting']);
        Route::get('slidersImages', [SettingController::class, 'slidersImages']);
        Route::get('sliderrow/{id}', [SettingController::class, 'sliderrow']);
        //setting row
        Route::get('settingrow', [SettingController::class, 'settingrow']);
    });
});
