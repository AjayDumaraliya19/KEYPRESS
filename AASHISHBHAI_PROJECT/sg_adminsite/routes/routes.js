const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

//===============User Route ==============
const { userCreate, login, listUser, deleteUser, updateUser,updatePassword } = require('../contorllers/userController');
router.post('/userlist', auth, listUser);
router.post('/user', auth, userCreate);
router.post('/user/login', login);
router.post('/user/update/:UserId', auth, updateUser);
router.delete('/user/delete/:UserId', auth, deleteUser);
router.post('/user/up', auth, updatePassword);

//===============Role Route ===============
const { insertRole, updateRole, deleteRole, listRole, roleWithoutPagination, test } = require('../contorllers/RoleController');
router.get('/getRole', auth, roleWithoutPagination);
router.post('/rolelist', auth, listRole)
router.post('/role', auth, insertRole);
router.post('/role/update/:RoleId', auth, updateRole);
router.delete('/role/delete/:RoleId', auth, deleteRole);
router.get('/test', test);



//===============Permission Route ===============
const { insertPermission, updatePermission, deletePemission, listPermision, insertUpdatePermission, permissionByRoleId } = require('../contorllers/permissionController');
router.post('/permissionByRoleId', auth, permissionByRoleId);
router.post('/permissionlist', auth, listPermision);
router.post('/insertUpdatePermission', auth, insertUpdatePermission)
router.post('/permission', auth, insertPermission);
router.post('/permission/update/:PermissionId', auth, updatePermission);
router.delete('/permission/delete/:PermissionId', auth, deletePemission);



//===============Page Route ===============
const { insertPage, updatePage, deletePage, listPage, listPageWithoutPagination } = require('../contorllers/pageController');
router.get('/getPage/:list', auth, listPageWithoutPagination);
router.post('/pagelist', auth, listPage);
router.post('/page', auth, insertPage);
router.post('/page/update/:PageId', auth, updatePage);
router.delete('/page/delete/:PageId', auth, deletePage);



//===============Game Route ===============
const { insertGame, updateGame, updateGameDetails, deleteGame, gameList, gameWithoutPagination, gameDetailsByGameCode, LastTenWinners ,StartGame,Getallgame,CancelRoundbygameCode} = require('../contorllers/gameContoller');
router.get('/getGame', auth, gameWithoutPagination)
router.post('/gameDetailsByGameCode', auth, gameDetailsByGameCode)
router.post('/gamelist', auth, gameList)
router.post('/game', auth, insertGame);
router.post('/game/update/:GameId', auth, updateGame);
router.post('/game/updateDetails/:GameId', auth, updateGameDetails);
router.delete('/game/delete/:GameId', auth, deleteGame);
router.post('/winners', auth, LastTenWinners);
router.post('/game/sg/:GameId', auth, StartGame);
router.get('/getallGame', auth, Getallgame)
router.post('/cancelgame', auth, CancelRoundbygameCode)


//===============Runner Route ===============
const { insertRunner, updateRunner, deleteRunner, listRunnerByGameId ,Getallrunner} = require('../contorllers/runnerController');
router.get('/runnerByGameId/:GameId', auth, listRunnerByGameId)
router.post('/runner', auth, insertRunner);
router.post('/runner/update/:RunnerId', auth, updateRunner);
router.delete('/runner/delete/:RunnerId', auth, deleteRunner);
router.get('/rnall', auth, Getallrunner);


//===============Currency Route ===============
const { insertCurrency, updateCurrency, deleteCurrency, listCurrency } = require('../contorllers/currencyController');
router.post('/currencylist', auth, listCurrency);
router.post('/currency', auth, insertCurrency)
router.post('/currency/update/:CurrencyId', auth, updateCurrency);
router.delete('/currency/delete/:CurrencyId', auth, deleteCurrency);



//===============Partner Route ===============
const { insertPartner, updatePartner, deletePartner, listPartner, listPartnerGameByPartnerId, deletePartnerGame, updatePartnerGame, insertPartnerGame} = require('../contorllers/partnerController');
router.post('/partnerlist', auth, listPartner);
router.post('/partner', auth, insertPartner)
router.post('/partner/update/:PartnerId', auth, updatePartner);
router.delete('/partner/delete/:PartnerId', auth, deletePartner);
router.post('/listPartnerGameByPartnerId', auth, listPartnerGameByPartnerId);
router.post('/partnerGameMap', auth, insertPartnerGame);
router.post('/partnerGameMap/update/:PartnerGameMapId', auth, updatePartnerGame);
router.delete('/partnerGameMap/delete/:PartnerGameMapId', auth, deletePartnerGame);


//===============Round Route ===============
const { RoundDetails,TicketDetails, ticketInfoByTicketId } = require('../contorllers/roundController');
router.post('/rd', auth, RoundDetails)
router.post('/td', auth, TicketDetails)
router.post('/ti', auth, ticketInfoByTicketId)


//===============Report Route ===============
const { GetRoundReport ,GetRounDetailsdReport,GetPartnerPL,GetTablePL,GetPlayerPL,GetGamePL,GetTicketReport,GetAllPartnerwithsearch,getPlayerByPartnerId} = require('../contorllers/ReportController');
router.post('/report/gr', auth, GetRoundReport)
router.post('/report/gdr', auth, GetRounDetailsdReport)
router.post('/report/PartnerPL', auth, GetPartnerPL)
router.post('/report/TablePL', auth, GetTablePL)
router.post('/report/PlayerPL', auth, GetPlayerPL)
router.post('/report/GamePL', auth, GetGamePL)
router.post('/report/TicketReport', auth, GetTicketReport)


//===============Report Dropdown Route ===============
router.post('/allpt', auth, GetAllPartnerwithsearch);
router.post('/allply', auth, getPlayerByPartnerId);

module.exports = router;